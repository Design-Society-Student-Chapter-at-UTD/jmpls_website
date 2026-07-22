import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";

const turso = createClient({
  url: process.env.DB_URL || "file:./jmpls.db",
});

export const db = drizzle(turso, { schema });
