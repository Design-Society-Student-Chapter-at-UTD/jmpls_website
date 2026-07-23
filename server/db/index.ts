import { drizzle } from "drizzle-orm/libsql";

// Try the native Node client first (supports file: for local dev).
// Fall back to the web client (no native binary) for Vercel.
let createClient: (config: any) => any;
try {
  const mod = await import("@libsql/client");
  createClient = mod.createClient;
} catch {
  const mod = await import("@libsql/client/web");
  createClient = mod.createClient;
}

const turso = createClient({
  url: process.env.DB_URL || "file:./jmpls.db",
});

export const db = drizzle(turso);
