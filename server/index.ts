import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { renderPage } from "vike/server";
import { app as apiApp } from "./api";

// ── Serve static files in production ────────────────────────────────────

if (process.env.NODE_ENV === "production" && process.env.VERCEL !== "1") {
  // Vike SSR for page routes
  apiApp.use("*", async (c, next) => {
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
  apiApp.use(
    "/*",
    serveStatic({
      root: "./dist/client",
      precompressed: true,
    })
  );
}

export { apiApp as app };

// Start server directly when run as entry point (non-Vercel production)
if (process.env.NODE_ENV === "production" && process.env.VERCEL !== "1") {
  const port = Number(process.env.PORT) || 3000;
  console.log(`Server running at http://localhost:${port}`);
  serve({ fetch: apiApp.fetch, port });
}
