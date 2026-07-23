import { drizzle } from "drizzle-orm/libsql/http";
import { createClient } from "@libsql/client/http";

// Uses the HTTP-based Hrana client (pure JS, no native binaries).
// Set DB_URL to your Turso database URL for both local dev and production.
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
