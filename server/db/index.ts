import { drizzle } from "drizzle-orm/libsql/wasm";
import { createClient } from "@libsql/client-wasm";

// Note: The WASM client only supports remote Turso URLs (libsql://, https://, wss://).
// Set DB_URL to your Turso database URL for both local dev and production.
// File: URLs (file:./jmpls.db) are NOT supported by the WASM client.
const dbUrl = process.env.DB_URL;
if (!dbUrl) {
  throw new Error(
    "DB_URL environment variable is required. " +
    "Set it to your Turso database URL (e.g. libsql://jmpls-production-xxx.turso.io). " +
    "See docs/DEPLOYMENT.md for Turso setup."
  );
}

const turso = createClient({
  url: dbUrl,
  authToken: process.env.DB_AUTH_TOKEN,
});

export const db = drizzle(turso);
