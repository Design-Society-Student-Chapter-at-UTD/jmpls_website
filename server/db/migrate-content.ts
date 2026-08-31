import fs from "fs";
import path from "path";
import crypto from "crypto";
import { db } from "./index";
import { products, siteContent, user, orders, orderItems } from "./schema";
import { eq } from "drizzle-orm";

const dataDir = path.resolve(process.cwd(), "data");
const files = [
  "site-config.json", "officers.json", "constitution.json", "gallery.json",
  "home-carousel.json", "law-school-tours.json", "event-history.json",
  "resources.json", "beyond-the-bar.json", "admin-config.json", "merchandise.json",
] as const;

async function migrate() {
  for (const file of files) {
    const content = fs.readFileSync(path.join(dataDir, file), "utf8");
    JSON.parse(content);
    await db.insert(siteContent).values({ key: file, content, createdAt: new Date(), updatedAt: new Date() })
      .onConflictDoUpdate({ target: siteContent.key, set: { content, updatedAt: new Date() } });
    console.log(`Imported ${file}`);
  }

  const merchandise = JSON.parse(fs.readFileSync(path.join(dataDir, "merchandise.json"), "utf8"));
  for (const item of merchandise) {
    await db.insert(products).values({
      id: item.id, name: item.name, description: item.description,
      price: Math.round(item.price * 100), quantity: item.quantity,
      image: item.image, category: item.category, details: item.details,
      active: true, createdAt: new Date(),
    }).onConflictDoUpdate({ target: products.id, set: {
      name: item.name, description: item.description, price: Math.round(item.price * 100),
      quantity: item.quantity, image: item.image, category: item.category,
      details: item.details, active: true,
    } });
  }

  const legacyOrders = await db.select().from(orders).all();
  for (const order of legacyOrders) {
    const items = JSON.parse(order.items || "[]");
    for (const item of items) {
      const existing = await db.select({ id: orderItems.id }).from(orderItems)
        .where(eq(orderItems.orderId, order.id)).get();
      if (existing) break;
      await db.insert(orderItems).values({
        id: crypto.randomUUID(), orderId: order.id, productId: item.id,
        name: item.name, price: Math.round(item.price * 100), quantity: item.quantity,
      });
    }
  }

  const config = JSON.parse(fs.readFileSync(path.join(dataDir, "admin-config.json"), "utf8"));
  for (const email of config.admins || []) {
    await db.update(user).set({ role: "admin", updatedAt: new Date() }).where(eq(user.email, email));
  }
  const supportDocs = {
    title: "JMPLS Admin Support",
    sections: [
      { title: "Getting started", body: "Sign in with an administrator account, then use the Dashboard tabs. Changes are stored in Turso and become available immediately." },
      { title: "Content management", body: "Use Content for site settings, Events for events and law-school tours, and Members for officers and administrator access." },
      { title: "Marketplace", body: "Open Money → Marketplace to edit an item. Set quantity to zero or mark it Sold out to remove it from the public store. Restore quantity and availability to return it." },
      { title: "Account recovery", body: "Passwords cannot be viewed. Use Members → Registered Users → Reset password for an email/password account; existing sessions are revoked." },
      { title: "Deployment notes", body: "Turso is the runtime source of truth. Keep DB_URL, DB_AUTH_TOKEN, BETTER_AUTH_SECRET, and trusted origins configured in Vercel." },
    ],
  };
  await db.insert(siteContent).values({ key: "support-docs", content: JSON.stringify(supportDocs), createdAt: new Date(), updatedAt: new Date() })
    .onConflictDoUpdate({ target: siteContent.key, set: { content: JSON.stringify(supportDocs), updatedAt: new Date() } });
  console.log("Imported content and synchronized configured admin roles.");
}

migrate().then(() => process.exit(0)).catch((error) => { console.error("Content migration failed:", error); process.exit(1); });
