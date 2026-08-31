import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db";
import * as schema from "./db/schema";

function asOrigin(value: string | undefined): string | null {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  return trimmed.startsWith("http://") || trimmed.startsWith("https://")
    ? trimmed.replace(/\/$/, "")
    : `https://${trimmed}`;
}

const configuredOrigins = [
  asOrigin(process.env.BETTER_AUTH_URL),
  asOrigin(process.env.VERCEL_URL),
  asOrigin(process.env.VERCEL_PROJECT_PRODUCTION_URL),
  ...(process.env.TRUSTED_ORIGINS || "").split(",").map(asOrigin),
].filter((origin): origin is string => Boolean(origin));

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "sqlite",
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
    },
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  socialProviders: {
    microsoft: {
      clientId: process.env.MICROSOFT_CLIENT_ID || "",
      clientSecret: process.env.MICROSOFT_CLIENT_SECRET || "",
      tenantId: process.env.MICROSOFT_TENANT_ID || "common",
    },
  },
  // Set base URL from env var (required for production)
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  // Allow both local dev and production origins
  trustedOrigins: [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3002",
    ...configuredOrigins,
  ],
});
