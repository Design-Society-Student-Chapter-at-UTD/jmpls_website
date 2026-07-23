import { drizzle } from "drizzle-orm/libsql";

// On Vercel, use the WASM-compatible web client to avoid native binary issues.
// Locally, use the Node client which supports file: URLs.
const { createClient } =
  process.env.VERCEL === "1"
    ? await import("@libsql/client/web")
    : await import("@libsql/client");

const turso = createClient({
  url: process.env.DB_URL || "file:./jmpls.db",
});

export const db = drizzle(turso);
