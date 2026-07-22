import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { serveStatic } from "@hono/node-server/serve-static";
import { renderPage } from "vike/server";
import { auth } from "./auth";
import { db } from "./db";
import { products, orders, donations, user } from "./db/schema";
import { desc, eq, sql, count, asc } from "drizzle-orm";
import Stripe from "stripe";
import crypto from "crypto";
import fs from "fs";
import path from "path";

// ── Admin helpers ──────────────────────────────────────────────────────────

const DATA_DIR = path.resolve(process.cwd(), "data");

function loadAdminConfig(): string[] {
  try {
    const raw = fs.readFileSync(path.join(DATA_DIR, "admin-config.json"), "utf-8");
    const cfg = JSON.parse(raw);
    return cfg.admins || [];
  } catch {
    return [];
  }
}

function isAdminEmail(email: string): boolean {
  return loadAdminConfig().includes(email);
}

async function getSessionUser(c: any) {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  return session?.user || null;
}

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2025-03-31.basil" })
  : null;

const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || "";

// ── Create Hono app ────────────────────────────────────────────────────

const app = new Hono();

// CORS for API routes
app.use("/api/*", cors());

// ── Auth routes (Better Auth) ──────────────────────────────────────────

app.on(["POST", "GET"], "/api/auth/**", (c) => auth.handler(c.req.raw));

// ── Product API routes ─────────────────────────────────────────────────

app.get("/api/products", async (c) => {
  const all = await db
    .select()
    .from(products)
    .where(eq(products.active, true))
    .orderBy(desc(products.createdAt));
  return c.json(
    all.map((p) => ({
      ...p,
      price: p.price / 100, // convert cents to dollars
    }))
  );
});

app.get("/api/products/:id", async (c) => {
  const id = c.req.param("id");
  const product = await db
    .select()
    .from(products)
    .where(eq(products.id, id))
    .get();
  if (!product) return c.json({ error: "Not found" }, 404);
  return c.json({ ...product, price: product.price / 100 });
});

// ── Stripe Checkout Session ────────────────────────────────────────────

app.post("/api/create-checkout-session", async (c) => {
  if (!stripe) {
    return c.json({ error: "Stripe not configured" }, 500);
  }

  const body = await c.req.json();
  const { items, successUrl, cancelUrl } = body;

  if (!items || items.length === 0) {
    return c.json({ error: "Cart is empty" }, 400);
  }

  try {
    const line_items = items.map((item: any) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
          description: item.description,
        },
        unit_amount: Math.round(item.price * 100), // dollars to cents
      },
      quantity: item.quantity,
    }));

    // Generate a local order ID to track this purchase
    const orderId = crypto.randomUUID();
    const orderItems = JSON.stringify(items.map((i: any) => ({
      id: i.id,
      name: i.name,
      price: i.price,
      quantity: i.quantity,
    })));

    // Store pending order in DB
    await db.insert(orders).values({
      id: orderId,
      userId: "guest", // will be updated if user is logged in
      status: "pending",
      total: Math.round(items.reduce((s: number, i: any) => s + i.price * i.quantity, 0) * 100),
      items: orderItems,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: successUrl || `${new URL(c.req.url).origin}/receipt/${orderId}`,
      cancel_url: cancelUrl || `${new URL(c.req.url).origin}/merchandise`,
      metadata: { orderId },
    });

    return c.json({ url: session.url, sessionId: session.id, orderId });
  } catch (err: any) {
    console.error("Stripe checkout error:", err);
    return c.json({ error: err.message }, 500);
  }
});

// ── Stripe Donation Session ───────────────────────────────────────────

app.post("/api/create-donation-session", async (c) => {
  if (!stripe) {
    return c.json({ error: "Stripe not configured" }, 500);
  }

  const body = await c.req.json();
  const { amount, donorName, donorEmail, message } = body;

  if (!amount || amount < 100) {
    return c.json({ error: "Minimum donation is $1.00" }, 400);
  }

  try {
    const donationId = crypto.randomUUID();

    // Store pending donation in DB
    await db.insert(donations).values({
      id: donationId,
      amount: Math.round(amount * 100), // dollars to cents
      donorName: donorName || null,
      donorEmail: donorEmail || null,
      message: message || null,
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Donation to JMPLS",
              description: message
                ? `Donation to John Marshall Pre-Law Society — ${message}`
                : "Donation to John Marshall Pre-Law Society",
            },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${new URL(c.req.url).origin}/donate?success=true`,
      cancel_url: `${new URL(c.req.url).origin}/donate?canceled=true`,
      metadata: {
        type: "donation",
        donationId,
      },
    });

    return c.json({ url: session.url, sessionId: session.id, donationId });
  } catch (err: any) {
    console.error("Donation session error:", err);
    return c.json({ error: err.message }, 500);
  }
});

// ── Stripe Webhook (handles successful payments) ────────────────────────

app.post("/api/stripe-webhook", async (c) => {
  if (!stripe) {
    return c.json({ error: "Stripe not configured" }, 500);
  }

  const rawBody = await c.req.text();
  const signature = c.req.header("stripe-signature");

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature || "", STRIPE_WEBHOOK_SECRET);
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return c.json({ error: "Invalid signature" }, 400);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const metadata = session.metadata || {};

    if (metadata.type === "donation") {
      const donationId = metadata.donationId;
      if (donationId) {
        await db
          .update(donations)
          .set({
            status: "paid",
            stripePaymentId: session.payment_intent?.toString() || null,
            updatedAt: new Date(),
          })
          .where(eq(donations.id, donationId));
        console.log(`Donation ${donationId} marked as paid`);
      }
    } else {
      const orderId = metadata.orderId;
      if (orderId) {
        await db
          .update(orders)
          .set({
            status: "paid",
            stripePaymentId: session.payment_intent?.toString() || null,
            updatedAt: new Date(),
          })
          .where(eq(orders.id, orderId));
        console.log(`Order ${orderId} marked as paid`);
      }
    }
  }

  return c.json({ received: true });
});

// ── Order/Receipt API ──────────────────────────────────────────────────

app.get("/api/orders/:id", async (c) => {
  const id = c.req.param("id");
  const order = await db.select().from(orders).where(eq(orders.id, id)).get();
  if (!order) return c.json({ error: "Order not found" }, 404);
  return c.json({
    ...order,
    items: JSON.parse(order.items),
    total: order.total / 100,
  });
});

// ── Dashboard API ────────────────────────────────────────────────────────

app.get("/api/dashboard/stats", async (c) => {
  const totalUsers = await db.select({ count: count() }).from(user).get();

  const ordersList = await db
    .select()
    .from(orders)
    .orderBy(desc(orders.createdAt))
    .all();

  const totalOrders = ordersList.length;
  const totalRevenue = ordersList
    .filter((o) => o.status === "paid")
    .reduce((sum, o) => sum + o.total, 0);

  const ordersByStatus = ordersList.reduce((acc: Record<string, number>, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const recentOrders = ordersList.slice(0, 10).map((o) => ({
    ...o,
    items: JSON.parse(o.items),
    total: o.total / 100,
  }));

  return c.json({
    totalOrders,
    totalRevenue: totalRevenue / 100,
    totalUsers: totalUsers?.count || 0,
    ordersByStatus,
    recentOrders,
  });
});

app.get("/api/dashboard/orders", async (c) => {
  const all = await db
    .select()
    .from(orders)
    .orderBy(desc(orders.createdAt))
    .all();

  return c.json(
    all.map((o) => ({
      ...o,
      items: JSON.parse(o.items),
      total: o.total / 100,
    }))
  );
});

// ── Admin: Donations ────────────────────────────────────────────────────

app.get("/api/admin/donations", async (c) => {
  const user = await getSessionUser(c);
  if (!user || !isAdminEmail(user.email)) {
    return c.json({ error: "Unauthorized" }, 403);
  }
  const all = await db
    .select()
    .from(donations)
    .orderBy(desc(donations.createdAt))
    .all();
  return c.json(
    all.map((d) => ({
      ...d,
      amount: d.amount / 100,
    }))
  );
});

// ── Admin: Users ─────────────────────────────────────────────────────────

app.get("/api/admin/users", async (c) => {
  const user = await getSessionUser(c);
  if (!user || !isAdminEmail(user.email)) {
    return c.json({ error: "Unauthorized" }, 403);
  }
  const all = await db
    .select({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      image: user.image,
      createdAt: user.createdAt,
    })
    .from(user)
    .orderBy(asc(user.name))
    .all();
  return c.json(all);
});

// ── Admin API ────────────────────────────────────────────────────────────

app.get("/api/admin/verify", async (c) => {
  const user = await getSessionUser(c);
  if (!user) return c.json({ admin: false, error: "Not logged in" });
  const admin = isAdminEmail(user.email);
  return c.json({ admin, email: user.email });
});

const ALLOWED_DATA_FILES = [
  "site-config.json",
  "officers.json",
  "constitution.json",
  "gallery.json",
  "home-carousel.json",
  "law-school-tours.json",
  "event-history.json",
  "resources.json",
  "beyond-the-bar.json",
  "merchandise.json",
  "admin-config.json",
];

app.get("/api/admin/data-files", async (c) => {
  const user = await getSessionUser(c);
  if (!user || !isAdminEmail(user.email)) {
    return c.json({ error: "Unauthorized" }, 403);
  }
  const files = ALLOWED_DATA_FILES.map((name) => {
    const filePath = path.join(DATA_DIR, name);
    const exists = fs.existsSync(filePath);
    const stat = exists ? fs.statSync(filePath) : null;
    return {
      name,
      exists,
      size: stat?.size || 0,
      lastModified: stat?.mtime?.toISOString() || null,
    };
  });
  return c.json({ files });
});

app.get("/api/admin/data/:fileName", async (c) => {
  const user = await getSessionUser(c);
  if (!user || !isAdminEmail(user.email)) {
    return c.json({ error: "Unauthorized" }, 403);
  }
  const fileName = c.req.param("fileName");
  if (!ALLOWED_DATA_FILES.includes(fileName)) {
    return c.json({ error: "File not allowed" }, 400);
  }
  const filePath = path.join(DATA_DIR, fileName);
  if (!fs.existsSync(filePath)) {
    return c.json({ error: "File not found" }, 404);
  }
  const content = fs.readFileSync(filePath, "utf-8");
  return c.json({ fileName, content });
});

app.post("/api/admin/data/:fileName", async (c) => {
  const user = await getSessionUser(c);
  if (!user || !isAdminEmail(user.email)) {
    return c.json({ error: "Unauthorized" }, 403);
  }
  const fileName = c.req.param("fileName");
  if (!ALLOWED_DATA_FILES.includes(fileName)) {
    return c.json({ error: "File not allowed" }, 400);
  }
  const body = await c.req.json();
  const { content } = body;
  if (typeof content !== "string") {
    return c.json({ error: "content must be a string" }, 400);
  }
  // Validate JSON before writing
  try {
    JSON.parse(content);
  } catch {
    return c.json({ error: "Invalid JSON" }, 400);
  }
  const filePath = path.join(DATA_DIR, fileName);
  fs.writeFileSync(filePath, content, "utf-8");
  console.log(`Admin ${user.email} updated ${fileName}`);
  return c.json({ success: true, fileName });
});

// ── Production: Vike SSR + static file fallback ────────────────────────

if (process.env.NODE_ENV === "production") {
  // Vike SSR for page routes
  app.use("*", async (c, next) => {
    // Skip API routes — they're handled by handlers above
    if (c.req.path.startsWith("/api")) {
      await next();
      return;
    }
    const pageContextInit = {
      urlOriginal: c.req.url,
      headersOriginal: c.req.raw.headers,
    };
    const pageContext = await renderPage(pageContextInit);
    const { httpResponse } = pageContext;
    if (httpResponse) {
      const { body, statusCode, headers } = httpResponse;
      c.status(statusCode);
      headers.forEach(([name, value]) => c.res.headers.set(name, value));
      return c.body(body);
    }
    // Vike didn't handle this — try static files
    await next();
  });

  // Static file fallback
  app.use(
    "/*",
    serveStatic({
      root: "./dist/client",
      precompressed: true,
    })
  );
}

// Named export to avoid Bun auto-detecting a server to start
// (Bun starts a server automatically when a file's default export has a .fetch method)
export { app };

// Start server directly when run as entry point (production)
// Using a function so Bun doesn't detect `fetch` on the default export
if (process.env.NODE_ENV === "production") {
  const port = Number(process.env.PORT) || 3000;
  console.log(`Server running at http://localhost:${port}`);
  serve({ fetch: app.fetch, port });
}
