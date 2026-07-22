# Deployment Guide

This document covers deploying the JMPLS website to **Vercel** (with Turso) and to a **traditional VPS**. The README has a quick-start overview; this doc has the full details.

---

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Prerequisites](#prerequisites)
- [Turso Database Setup](#turso-database-setup)
- [Environment Variables](#environment-variables)
- [Stripe Webhook Configuration](#stripe-webhook-configuration)
- [Deploy to Vercel](#deploy-to-vercel)
- [Custom Domain](#custom-domain)
- [Important Limitations on Vercel](#important-limitations-on-vercel)
- [Local Production Test](#local-production-test)
- [Troubleshooting](#troubleshooting)
- [VPS Alternative](#vps-alternative)

---

## Architecture Overview

When deployed to Vercel, requests are handled by two separate systems:

| Request Path | Handler | Technology |
|-------------|---------|------------|
| `/**` (page routes) | Vercel serverless function | Built by `vite-plugin-vercel` + `@vite-plugin-vercel/vike` |
| `/api/**` (API routes) | `api/index.ts` | Hono serverless function |
| `/assets/**` (static files) | Vercel Edge Network | Served from `dist/client/assets/` |

### Local vs Vercel logic

The server code detects where it's running:

```ts
// server/index.ts (relevant logic)
if (process.env.NODE_ENV === "production" && process.env.VERCEL !== "1") {
  // Vike SSR middleware and static file serving — ONLY for local/VPS production
}
```

This means:

- **Locally** (`bun run dev`): Vite dev server handles Vike SSR, Hono handles API on port 3001, Vite proxies `/api/*` to it
- **Vercel**: `vite-plugin-vercel` generates serverless functions for each Vike page route; `api/index.ts` handles `/api/*` as a separate serverless function
- **Local production** (`NODE_ENV=production bun run server/index.ts`): The single Node server handles both SSR pages and API routes with static file serving

### Files involved

| File | Purpose |
|------|---------|
| `api/index.ts` | Vercel serverless function entry — imports `server/api.ts`, exports `app.fetch` for Vercel to call |
| `server/api.ts` | API-only Hono app — all API routes extracted without SSR dependencies |
| `server/index.ts` | Production server — imports from `server/api.ts`, adds Vike SSR + static files (only when NOT on Vercel) |
| `vite.config.ts` | Includes `vercel()` plugin after `vike()` — `@vite-plugin-vercel/vike` is auto-detected |
| `vercel.json` | Build command, output directory, framework, install command, git config |

### What changes on Vercel vs local

| Feature | Local (`bun run dev`) | Vercel | Notes |
|---------|----------------------|--------|-------|
| Database | Local SQLite (`jmpls.db`) | Turso (hosted) | SQLite filesystem won't work on serverless |
| Auth redirects | `http://localhost:3000` | Your Vercel domain | `BETTER_AUTH_URL` must match deployment URL |
| Stripe webhook | `http://localhost:3001/api/stripe-webhook` | `https://your-domain.vercel.app/api/stripe-webhook` | Must update Stripe dashboard webhook URL |
| Data file editing (admin panel) | Persists to `data/*.json` on disk | **Does NOT persist** | Read-only filesystem. Edit locally and redeploy |
| Image files | `assets/images/*` served from disk | Must be hosted externally (Imgur, etc.) | No persistent filesystem for uploads |

---

## Prerequisites

1. A [Vercel](https://vercel.com) account
2. A [Turso](https://turso.tech) account (free tier: up to 500 databases, 9GB each)
3. A domain name for custom domain (optional — Vercel provides `*.vercel.app`)
4. All environment variable values ready

---

## Turso Database Setup

Vercel serverless functions can't write to the local filesystem, so SQLite (`jmpls.db`) won't work. Turso is a hosted LibSQL database wire-compatible with SQLite — the existing Drizzle schema works without changes.

### 1. Create a Turso account

Go to [turso.tech](https://turso.tech) and sign up (GitHub login works).

### 2. Install the Turso CLI

```bash
# macOS (Homebrew)
brew install tursodatabase/tap/turso

# OR — direct install script
eval "$(curl -sSfL https://get.tur.so/install.sh)"
```

### 3. Log in and create a database

```bash
turso auth login
# Opens a browser window — complete the login flow
```

Then create the production database:

```bash
turso db create jmpls-production
```

You'll see output like:
```
Created database jmpls-production at aws-us-east-1.turso.io
```

### 4. Get the database URL

```bash
turso db show jmpls-production --url
```

This prints something like:
```
libsql://jmpls-production-yourname.turso.io
```

Copy this — you'll use it as the `DB_URL` environment variable.

### 5. Generate an auth token

Turso databases require authentication for remote access:

```bash
turso db tokens create jmpls-production
```

This prints a long token string. You'll need to add `DB_AUTH_TOKEN` to your environment variables.

**Important**: Update `server/db/index.ts` to use the token. Currently it only passes `url`:

```ts
const turso = createClient({
  url: process.env.DB_URL || "file:./jmpls.db",
});
```

Add the `authToken` option:

```ts
const turso = createClient({
  url: process.env.DB_URL || "file:./jmpls.db",
  authToken: process.env.DB_AUTH_TOKEN,
});
```

### 6. Push the schema

```bash
# From the app/ directory
DB_URL="libsql://jmpls-production-yourname.turso.io" DB_AUTH_TOKEN="your-token" bun run db:push
```

This runs `drizzle-kit push`, reading the schema from `server/db/schema.ts` and creating all tables in Turso. You should see:
```
✓ Your database schema is up to date
```

### 7. Verify the tables

```bash
turso db shell jmpls-production
```

```sql
.tables
.schema
SELECT * FROM user;
```

### 8. Export data from local SQLite (if you have existing data)

```bash
sqlite3 jmpls.db .dump > local-dump.sql

# Import into Turso
cat local-dump.sql | turso db shell jmpls-production
```

> **Warning**: The `.dump` includes `CREATE TABLE` statements which may conflict if drizzle-kit already created the schemas. You may need to edit the dump to remove those statements before importing.

### drizzle.config.ts for Turso

The current `drizzle.config.ts` uses a local SQLite URL. To manage schema changes against Turso, create a separate `drizzle.turso.config.ts`:

```ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./server/db/schema.ts",
  out: "./server/db/migrations",
  dialect: "sqlite",
  dbCredentials: {
    url: process.env.DB_URL || "file:./jmpls.db",
    authToken: process.env.DB_AUTH_TOKEN,
  },
});
```

Then add a script to `package.json`:

```json
"db:push:turso": "drizzle-kit push --config=drizzle.turso.config.ts"
```

Then run: `DB_URL=... DB_AUTH_TOKEN=... bun run db:push:turso`

---

## Environment Variables

### Required

| Variable | Description | Where to get it |
|----------|-------------|----------------|
| `BETTER_AUTH_SECRET` | Auth secret (min 32 characters) | `openssl rand -hex 32` or `bun -e "console.log(crypto.randomBytes(32).toString('hex'))"` |
| `BETTER_AUTH_URL` | Your deployed URL (e.g. `https://jmpls.vercel.app`) | Your Vercel project domain — needed for OAuth redirects and session cookies |
| `DB_URL` | Turso database URL | From `turso db show jmpls-production --url` |
| `DB_AUTH_TOKEN` | Turso authentication token | From `turso db tokens create jmpls-production` |

### Conditional (depending on features used)

| Variable | When needed | Description |
|----------|------------|-------------|
| `STRIPE_SECRET_KEY` | Merchandise & donations | Stripe Dashboard → Developers → API keys (`sk_live_...` or `sk_test_...`) |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook | Stripe Dashboard → Webhooks → your endpoint's signing secret (`whsec_...`) |
| `MICROSOFT_CLIENT_ID` | Microsoft OAuth login | Azure AD App Registration → Application (client) ID |
| `MICROSOFT_CLIENT_SECRET` | Microsoft OAuth login | Azure AD → Certificates & Secrets → Client secret value |
| `MICROSOFT_TENANT_ID` | Microsoft OAuth login | Azure AD → Directory (tenant) ID |

### How to set them on Vercel

**Via Vercel CLI:**
```bash
cd app
bun x vercel env add BETTER_AUTH_SECRET
# Paste the value, select production
```

**Via Vercel Dashboard:**
1. Go to [vercel.com](https://vercel.com)
2. Select your project
3. Settings → Environment Variables
4. Add each variable and its value
5. Under "Environments", select "Production"
6. Click Save

**Via `.env` file (for CLI deployment):**
Create `.env.production` in `app/`:
```bash
BETTER_AUTH_SECRET=your-secret
BETTER_AUTH_URL=https://jmpls.vercel.app
DB_URL=libsql://jmpls-production-yourname.turso.io
DB_AUTH_TOKEN=your-turso-token
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

Then deploy with `bun x vercel --prod` and the CLI will prompt you to link the file.

> **Security**: Never commit `.env` or `.env.production` to git. The `.gitignore` already excludes `.env*`.

---

## Stripe Webhook Configuration

After deploying, Stripe needs to send webhook events to your production URL so order/donation statuses are updated.

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/webhooks)
2. Click **Add endpoint**
3. **Endpoint URL**: `https://your-domain.vercel.app/api/stripe-webhook`
4. **Events to send**: Select `checkout.session.completed`
5. Click **Add endpoint**
6. Copy the **Signing secret** (starts with `whsec_`)
7. Set this as `STRIPE_WEBHOOK_SECRET` in Vercel environment variables and redeploy

> **Local testing**: Use the Stripe CLI to forward webhooks: `stripe listen --forward-to localhost:3001/api/stripe-webhook`

---

## Deploy to Vercel

### Prerequisite check

- [ ] Turso database created and schema pushed
- [ ] All environment variables added to Vercel
- [ ] Git repo pushed to GitHub (or Git-compatible host)
- [ ] Stripe webhook endpoint configured for production URL

### Option A: Deploy via CLI (fastest, no web UI)

```bash
cd /Users/taufeeqali/Projects/JMPLS Website/app

# First time: link to a Vercel project
bun x vercel link
# Follow the prompts — create a new project or link to existing

# Deploy to production
bun x vercel --prod
```

What happens:
1. Vercel CLI uploads the `app/` directory
2. Vercel runs `bun install` (as specified in `vercel.json`)
3. Vercel runs `bun run build` (as specified in `vercel.json`)
4. `vite-plugin-vercel` generates serverless functions for each Vike page
5. Vercel detects `api/index.ts` as a serverless function
6. Vercel deploys everything and gives you a URL like `https://your-project.vercel.app`

### Option B: Deploy via Git (GitHub integration)

1. Push your code to GitHub:
   ```bash
   git push origin main
   ```

2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your GitHub repository
4. **Root Directory**: Set this to `app` (critical — Vercel needs `package.json` in the root directory)
5. **Build and Output Settings**: Leave as defaults (handled by `vercel.json`)
6. **Environment Variables**: Add all variables
7. Click **Deploy**

Every subsequent push to `main` will auto-deploy.

---

## Custom Domain

If you own a domain (e.g., `jmpls.org`):

1. Go to Vercel Dashboard → Your Project → **Domains**
2. Enter your domain (e.g., `jmpls.org`) and click **Add**
3. Vercel will show you DNS records to configure (typically a CNAME record pointing to `cname.vercel-dns.com` or A records to Vercel's IPs)
4. Update your domain's DNS settings at your registrar
5. Wait for DNS propagation (a few minutes to an hour)
6. Update `BETTER_AUTH_URL` to `https://jmpls.org` and redeploy
7. Update Stripe webhook URL to `https://jmpls.org/api/stripe-webhook`

---

## Important Limitations on Vercel

### Data files (`data/*.json`) don't persist

The admin panel reads and writes JSON files from the `data/` directory on disk. On Vercel serverless functions, the filesystem is **read-only** except for `/tmp`.

- **Existing data files** (committed to git) are readable — they're bundled with the deployment
- **Admin panel edits** (Dashboard → Content Admin) will appear to succeed but changes are **lost on the next deployment** or when the serverless instance recycles

**Workarounds:**
1. **Edit files locally and redeploy** — most reliable. Edit `data/*.json`, commit, push
2. **Migrate to database** — future enhancement: move `data/` content to DB tables
3. **Use object storage** — Store files in S3/R2 and fetch via API

### Microsoft OAuth redirect URIs

After deploying, update your Azure AD app registration:

1. Go to [Azure Portal → App Registrations](https://portal.azure.com/#view/Microsoft_AAD_RegisteredApps/)
2. Select your app
3. Under **Authentication** → **Redirect URIs**, add:
   ```
   https://your-domain.vercel.app/api/auth/callback/microsoft
   ```
4. Save

Without this, Microsoft login will fail with a redirect URI mismatch error.

### Cold starts

- Vercel serverless functions spin down after inactivity (15-30 min on Hobby plan)
- First request after idle takes **2-5 seconds** (cold start)
- Subsequent requests are fast (<100ms)
- Pro plan ($20/mo) enables "Lambda Advanced Features" for faster cold starts

### Build and deploy times

| Step | Typical time |
|------|-------------|
| `bun install` | 5-15s |
| `bun run build` | 10-30s |
| `vite-plugin-vercel` | 5-10s |
| Vercel deployment | 10-20s |
| **Total** | **30-75s** |

---

## Local Production Test (Before Deploying)

To verify the production build before deploying to Vercel:

```bash
# Build the Vike pages
bun run build

# Start production server (port 3000)
NODE_ENV=production BETTER_AUTH_SECRET=your-secret BETTER_AUTH_URL=http://localhost:3000 \
  bun run server/index.ts
```

If everything works at `http://localhost:3000`, the Vercel deployment will work too (with Turso instead of SQLite).

---

## Troubleshooting

| Problem | Likely Cause | Solution |
|---------|-------------|----------|
| Build fails with `Cannot find module` | Missing dependency | Check `package.json` includes all imports. Run `bun install` locally first |
| API returns 404 | Serverless function not detecting routes | Check `api/index.ts` path matches Hono's route definitions |
| Login fails with redirect error | `BETTER_AUTH_URL` doesn't match actual domain | Set to exact deployed URL (including `https://`) |
| Microsoft login fails | Wrong redirect URI in Azure AD | Add `https://your-domain.vercel.app/api/auth/callback/microsoft` to Azure AD |
| Stripe webhook returning 400 | Wrong signing secret | Copy fresh `whsec_...` from Stripe Dashboard → Webhooks |
| Admin panel saves but changes don't persist | Vercel read-only filesystem | Edit `data/*.json` locally and redeploy via git |
| Cold starts are slow | Serverless idle timeout | Normal, or upgrade to Pro plan |
| Database connection refused | Wrong Turso URL or missing auth token | Verify `DB_URL` and `DB_AUTH_TOKEN` in Vercel env vars |

---

## VPS Alternative

If you prefer a VPS (DigitalOcean Droplet, Railway, Fly.io, Hetzner, etc.) instead of Vercel:

**Advantages over Vercel:**
- Works with local SQLite — no Turso needed
- Persistent file storage — admin panel edits to `data/*.json` persist
- No cold starts — server runs continuously
- Simpler single-process architecture

### Deployment steps

1. Set up a VPS or use Railway/Fly.io
2. Copy the `app/` directory to the server (or use Git)
3. Install Bun:
   ```bash
   curl -fsSL https://bun.sh/install | bash
   ```
4. Install dependencies:
   ```bash
   cd app && bun install
   ```
5. Build:
   ```bash
   bun run build
   ```
6. Set environment variables:
   ```bash
   export BETTER_AUTH_SECRET=your-secret
   export BETTER_AUTH_URL=https://your-domain.com
   # ... other vars
   ```
7. Start the server:
   ```bash
   NODE_ENV=production bun run server/index.ts &
   ```
8. Set up a reverse proxy (Nginx/Caddy) for port 3000

### Example Nginx config

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Process management with pm2

```bash
npm install -g pm2
pm2 start "NODE_ENV=production bun run server/index.ts" --name jmpls
pm2 save
pm2 startup
```

This VPS approach doesn't need `vite-plugin-vercel` or the `api/` directory — those are Vercel-specific.
