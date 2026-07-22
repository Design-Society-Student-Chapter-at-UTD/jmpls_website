# JMPLS Website Guide

## For Site Owners (Non-Technical)

### Editing Site Content

All site content can be edited through the **Content Admin** panel in the Dashboard.

1. Go to `/dashboard` and sign in with your admin email
2. Click the **Content Admin** tab
3. Select a data file from the left sidebar
4. Edit the JSON content in the editor
5. Click **Save** — changes take effect immediately

### What You Can Edit

| File | What It Controls |
|------|-----------------|
| **Site Configuration** | Organization name, email, social links, Stripe settings, form URLs |
| **About Us — Officers** | Officer names, roles, photos, and bios for each academic year |
| **About Us — Constitution** | Full constitution text with articles and sections |
| **Gallery** | Gallery image paths and captions |
| **Home Page Carousel** | Slides shown on the hero carousel |
| **Law School Tours** | Tour listings with dates and descriptions |
| **Events** | Event listings on the events page |
| **Resources** | Resources and download links |
| **Beyond the Bar** | Beyond the Bar program content |
| **Merchandise** | Product listings for the merchandise page |
| **Admin Access** | Which email addresses have admin panel access |

### Admin Access

To grant someone admin access:
1. Go to Dashboard → **Content Admin**
2. Select **Admin Access Settings** (`admin-config.json`)
3. Add their email to the `"admins"` array
4. Click **Save**

Example:
```json
{
  "admins": ["you@gmail.com", "officer@gmail.com"]
}
```

Only users with emails in this list will see the Content Admin tab.

### Important Notes

- **Be careful when editing JSON** — a misplaced comma or quote can break a page. The editor will show an error if the JSON is invalid.
- Changes take effect immediately after saving — no need to restart the server.
- Photos and images cannot be uploaded through the admin panel yet. See the **Image Hosting Guide** below for how to add images.

### Image Hosting Guide

Images referenced in the data files (officer photos, gallery images, carousel slides, etc.) need to be hosted at a publicly accessible URL. Here are three options:

**Option 1: Local storage (recommended for developers)**

If you have git access to the project, place image files in the `assets/images/` folder, commit them, and reference them by path:
```json
{ "imageFileName": "Jackson_Logue.jpg" }
```
For Gallery and Carousel items that use a URL-based `"image"` field, reference the local path:
```json
{ "image": "/assets/images/Jackson_Logue.jpg" }
```

**Option 2: Imgur (easiest for non-technical admins)**

1. Go to [imgur.com](https://imgur.com) — no account required
2. Drag and drop your image onto the page
3. Right-click the uploaded image and select **Copy Image Link** (or use the "Get share links" button and copy the **Direct Link**)
4. The URL will look like: `https://i.imgur.com/abc123.jpg`
5. Paste that URL into the `"image"` or `"imageFileName"` field in the data file

**Option 3: OneDrive**

1. Upload the image to OneDrive
2. Right-click → **Share** → set to "Anyone with the link can view"
3. Click **Copy Link** (looks like `https://1drv.ms/i/s!...`)
4. Use a link converter like [onedrive-share-link-converter.netlify.app](https://onedrive-share-link-converter.netlify.app) to get a direct image URL
5. Paste the converted URL into the `"image"` field

**Option 4: Google Drive**

1. Upload the image to Google Drive
2. Share → **General access: Anyone with the link** → **Copy link**
3. The link looks like: `https://drive.google.com/file/d/FILE_ID/view?usp=sharing`
4. Extract the `FILE_ID` and use this URL pattern:
   ```
   https://drive.google.com/uc?export=view&id=FILE_ID
   ```
5. Paste that URL into the `"image"` field

> **Tip:** Imgur is the simplest option for quick updates. Local storage is best for production since you control the files. OneDrive and Google Drive may sometimes block image embedding on external sites.

---

---

## For Developers (Technical)

### Architecture

```
app/
├── pages/          # Vike file-based routing (each folder = a route)
│   ├── +Layout.tsx # Global layout (nav, footer)
│   ├── +config.ts  # Vike configuration
│   ├── index/      # Home page
│   ├── about-us/   # About Us (includes constitution viewer)
│   ├── donate/     # Donations page (merged into merchandise)
│   ├── dashboard/  # Admin dashboard (stats + content admin)
│   └── ...         # Other pages
├── server/
│   ├── index.ts    # Hono API server (routes, Stripe, admin)
│   ├── auth.ts     # Better Auth configuration
│   └── db/         # Database (Drizzle + SQLite/Turso)
│       ├── schema.ts
│       └── index.ts
├── src/
│   └── lib/
│       └── auth-client.ts  # Better Auth client
├── components/     # Reusable React components
├── data/           # JSON data files (editable via admin panel)
├── assets/         # Images, fonts, etc.
├── docs/           # This guide
├── vite.config.ts  # Vite + Vike configuration
└── package.json
```

### Tech Stack

- **Frontend**: React 19 + Vike (SSR) + Tailwind CSS 4
- **Server**: Hono (API) + @hono/node-server
- **Auth**: Better Auth (email/password + Microsoft OAuth)
- **Database**: SQLite (local) or Turso (production) via Drizzle ORM
- **Payments**: Stripe (merchandise + donations)
- **Runtime**: Bun (recommended) or Node.js

### Getting Started

```bash
# Prerequisites: Bun installed
cd app
bun install

# Set up environment
cp .env.example .env  # Add your keys

# Push database schema
bun run db:push

# Start dev server
bun run dev
# → http://localhost:3000 (Vike SSR)
# → http://localhost:3001 (API, proxied through Vite)
```

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `BETTER_AUTH_SECRET` | Yes | Auth secret (min 32 chars) |
| `BETTER_AUTH_URL` | No | Base URL for auth |
| `DB_URL` | No | Database URL (defaults to local SQLite) |
| `STRIPE_SECRET_KEY` | For payments | Stripe secret key |
| `STRIPE_WEBHOOK_SECRET` | For webhooks | Stripe webhook signing secret |
| `MICROSOFT_CLIENT_ID` | For Microsoft login | OAuth client ID |
| `MICROSOFT_CLIENT_SECRET` | For Microsoft login | OAuth client secret |
| `MICROSOFT_TENANT_ID` | For Microsoft login | OAuth tenant ID |

### Production Build

```bash
# Build
npm run build

# Start production server
NODE_ENV=production BETTER_AUTH_SECRET=your-secret bun run server/index.ts
```

### Admin API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/verify` | Check if current user is admin |
| GET | `/api/admin/data-files` | List all editable data files |
| GET | `/api/admin/data/:fileName` | Read a data file's content |
| POST | `/api/admin/data/:fileName` | Write a data file (body: `{ content: "..." }`) |

All admin endpoints require authentication and an email in `data/admin-config.json`.

### Database

The schema uses SQLite with Drizzle ORM. Tables:

- `user`, `session`, `account`, `verification` — Better Auth
- `products` — Merchandise products
- `orders` — Stripe order tracking
- `donations` — Donation tracking

To modify the schema: edit `server/db/schema.ts`, then run `bun run db:push`.

### Stripe Integration

- **Merchandise**: `POST /api/create-checkout-session` → Stripe Checkout → webhook updates order
- **Donations**: `POST /api/create-donation-session` → Stripe Checkout → webhook updates donation

The webhook endpoint is `POST /api/stripe-webhook`.

---

---

## Deploying to Vercel

### Overview

The project is pre-configured for Vercel deployment. Here's how it works:

#### Architecture (Vercel)

When deployed to Vercel, requests are handled by two separate systems:

| Request Path | Handler | Technology |
|-------------|---------|------------|
| `/**` (page routes) | Vercel serverless function | Built by `vite-plugin-vercel` + `@vite-plugin-vercel/vike` |
| `/api/**` (API routes) | `api/index.ts` | Hono serverless function |
| `/assets/**` (static files) | Vercel Edge Network | Served from `dist/client/assets/` |

#### Local vs Vercel logic

The server code (`server/index.ts`) detects whether it's running on Vercel using the `VERCEL` environment variable:
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

#### Files involved

| File | Purpose |
|------|---------|
| `api/index.ts` | Vercel serverless function entry — imports `server/api.ts`, exports `app.fetch` for Vercel to call |
| `server/api.ts` | API-only Hono app — all API routes (products, Stripe, dashboard, admin) extracted without SSR dependencies |
| `server/index.ts` | Production server — imports from `server/api.ts`, adds Vike SSR + static files (only when NOT on Vercel) |
| `vite.config.ts` | Includes `vercel()` plugin after `vike()` — `@vite-plugin-vercel/vike` is auto-detected and bundles each page |
| `vercel.json` | Build command, output directory, framework, install command, git config |

#### What changes on Vercel vs local development

| Feature | Local (`bun run dev`) | Vercel | Notes |
|---------|----------------------|--------|-------|
| Database | Local SQLite (`jmpls.db`) | Turso (hosted) | SQLite filesystem won't work; must use Turso |
| Auth redirects | `http://localhost:3000` | Your Vercel domain | `BETTER_AUTH_URL` must match deployment URL |
| Stripe webhook | `http://localhost:3001/api/stripe-webhook` | `https://your-domain.vercel.app/api/stripe-webhook` | Must update Stripe dashboard webhook URL |
| Data file editing (admin panel) | Persists to `data/*.json` on disk | **Does NOT persist** | Vercel serverless filesystem is read-only (except `/tmp`). Admin panel edits will appear to succeed but reset on next deploy |
| Image files | `assets/images/*` served from disk | Must be hosted externally (Imgur, etc.) | Same reason — no persistent filesystem for uploads |

### Prerequisites

1. A [Vercel](https://vercel.com) account
2. A [Turso](https://turso.tech) account (free tier: up to 500 databases, 9GB each)
3. A domain name if you want a custom domain (optional — Vercel provides `*.vercel.app`)
4. All environment variable values ready

### Step 1: Set Up Turso (Hosted Database)

Vercel serverless functions can't write to the local filesystem, so SQLite (`jmpls.db`) won't work. Turso is a hosted LibSQL database that is wire-compatible with SQLite, so the existing Drizzle schema works without changes.

**1. Create a Turso account**

Go to [turso.tech](https://turso.tech) and sign up (GitHub login works).

**2. Install the Turso CLI**

```bash
# macOS (Homebrew)
brew install tursodatabase/tap/turso

# OR — direct install script
eval "$(curl -sSfL https://get.tur.so/install.sh)"
```

**3. Log in and create a database**

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

**4. Get the database URL**

```bash
turso db show jmpls-production --url
```

This prints something like:
```
libsql://jmpls-production-yourname.turso.io
```

Copy this — you'll use it as the `DB_URL` environment variable.

**5. Generate an auth token**

Turso databases require authentication for remote access. Generate a token:

```bash
turso db tokens create jmpls-production
```

This prints a long token string. You'll also need to set this in your environment. In `server/db/index.ts`, the client is initialized as:

```ts
const turso = createClient({
  url: process.env.DB_URL || "file:./jmpls.db",
});
```

If your Turso database requires a token (most do), you also need to pass `authToken`. Update `server/db/index.ts` to:

```ts
const turso = createClient({
  url: process.env.DB_URL || "file:./jmpls.db",
  authToken: process.env.DB_AUTH_TOKEN,
});
```

And add `DB_AUTH_TOKEN` to your environment variables.

**6. Push the schema**

```bash
# From the app/ directory
DB_URL="libsql://jmpls-production-yourname.turso.io" DB_AUTH_TOKEN="your-token" bun run db:push
```

This runs `drizzle-kit push`, which reads the schema from `server/db/schema.ts` and creates all tables in Turso. You should see output like:
```
✓ Your database schema is up to date
```

**7. (Optional) Verify the tables**

```bash
turso db shell jmpls-production
```

Then in the SQL shell:
```sql
.tables
.schema
SELECT * FROM user;
```

**8. Export data from local SQLite (if you have existing data)**

If you've been running locally with `jmpls.db` and need to migrate that data to Turso:

```bash
# Dump local data to SQL
sqlite3 jmpls.db .dump > local-dump.sql

# Remove schema-only lines (the .dump includes CREATE TABLE, which drizzle-kit already handles)
# Then import into Turso
cat local-dump.sql | turso db shell jmpls-production
```

> **Warning**: Be careful with `sqlite3 .dump` — it includes CREATE TABLE statements that may conflict if drizzle-kit already created the schemas. You may need to edit the dump file to remove CREATE statements before importing.

### Step 2: Configure `drizzle.config.ts` for Turso

The current `drizzle.config.ts` uses a local SQLite URL:

```ts
export default defineConfig({
  schema: "./server/db/schema.ts",
  out: "./server/db/migrations",
  dialect: "sqlite",
  dbCredentials: {
    url: "file:./jmpls.db",
  },
});
```

To manage schema changes against Turso, you have two options:

**Option A: Change the URL when running against Turso**

```bash
# Set the env var and drizzle-kit will use the dialect from drizzle.config.ts
# but connect to the Turso URL via DB_URL environment variable
# (Note: drizzle.config.ts uses url directly, so you'd need a script)
```

**Option B: Create a separate `drizzle.turso.config.ts`**

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

This way you can run `DB_URL=... DB_AUTH_TOKEN=... bun run db:push:turso` without modifying the original config.

### Step 3: Set Environment Variables on Vercel

Environment variables tell your app how to connect to Turso, Stripe, and auth providers when running on Vercel.

**Via Vercel CLI:**
```bash
cd app
bun x vercel env add BETTER_AUTH_SECRET
# Paste the value, select production
```

**Required variables:**

| Variable | Required | Description | Where to get it |
|----------|----------|-------------|----------------|
| `BETTER_AUTH_SECRET` | Yes | Auth secret (min 32 characters) | Generate with: `openssl rand -hex 32` or `bun -e "console.log(crypto.randomBytes(32).toString('hex'))"` |
| `BETTER_AUTH_URL` | Yes | Your deployed URL (e.g. `https://jmpls.vercel.app`) | Use your Vercel project domain — needed for OAuth redirects and session cookies |
| `DB_URL` | Yes | Turso database URL | From `turso db show jmpls-production --url` |
| `DB_AUTH_TOKEN` | Yes | Turso authentication token | From `turso db tokens create jmpls-production` |

**Conditional variables (depending on features used):**

| Variable | When needed | Description |
|----------|------------|-------------|
| `STRIPE_SECRET_KEY` | Merchandise & donations | From Stripe Dashboard → Developers → API keys (`sk_live_...` or `sk_test_...`) |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook | From Stripe Dashboard → Webhooks → your endpoint's signing secret (`whsec_...`) |
| `MICROSOFT_CLIENT_ID` | Microsoft OAuth login | From Azure AD App Registration → Application (client) ID |
| `MICROSOFT_CLIENT_SECRET` | Microsoft OAuth login | From Azure AD → Certificates & Secrets → Client secret value |
| `MICROSOFT_TENANT_ID` | Microsoft OAuth login | From Azure AD → Directory (tenant) ID |

**Via Vercel Dashboard (Web UI):**
1. Go to [vercel.com](https://vercel.com)
2. Select your project
3. Settings → Environment Variables
4. Add each variable and its value
5. Under "Environments", select "Production"
6. Click Save

**Via `.env` file (for CLI deployment):**
Create a `.env.production` file in the `app/` directory:
```bash
BETTER_AUTH_SECRET=your-secret
BETTER_AUTH_URL=https://jmpls.vercel.app
DB_URL=libsql://jmpls-production-yourname.turso.io
DB_AUTH_TOKEN=your-turso-token
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

Then deploy with `bun x vercel --prod` and the CLI will prompt you to link the file.

> **Security**: Never commit `.env` or `.env.production` to version control. The `.gitignore` already excludes `.env*`.

### Step 4: Configure Stripe Webhook for Production

After deploying, Stripe needs to send webhook events to your production URL so order/donation statuses are updated.

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/webhooks)
2. Click **Add endpoint**
3. **Endpoint URL**: `https://your-domain.vercel.app/api/stripe-webhook`
4. **Events to send**: Select `checkout.session.completed`
5. Click **Add endpoint**
6. Copy the **Signing secret** (starts with `whsec_`)
7. Set this as `STRIPE_WEBHOOK_SECRET` in Vercel environment variables and redeploy

> **Local testing webhook**: For testing webhooks locally, use the Stripe CLI: `stripe listen --forward-to localhost:3001/api/stripe-webhook` — this creates a forwarding tunnel from Stripe to your local server.

### Step 5: Deploy

**Prerequisite check:**
- [ ] Turso database created and schema pushed
- [ ] All environment variables added to Vercel
- [ ] Git repo pushed to GitHub (or Git-compatible host)
- [ ] Stripe webhook endpoint configured for production URL

**Option A: Deploy via CLI (fastest, no web UI)**

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

**Option B: Deploy via Git (GitHub integration)**

1. Push your code to GitHub:
   ```bash
   git push origin main
   ```

2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your GitHub repository
4. **Root Directory**: Set this to `app` (this is critical — Vercel needs to find `package.json` in the root directory)
5. **Build and Output Settings**: Leave as defaults (handled by `vercel.json`)
6. **Environment Variables**: Add all variables from Step 3
7. Click **Deploy**

Every subsequent push to `main` will auto-deploy.

### Step 6: Set Up a Custom Domain (Optional)

If you own a domain (e.g., `jmpls.org`):

1. Go to Vercel Dashboard → Your Project → **Domains**
2. Enter your domain (e.g., `jmpls.org`) and click **Add**
3. Vercel will show you DNS records to configure (typically a CNAME record pointing to `cname.vercel-dns.com` or A records to Vercel's IPs)
4. Update your domain's DNS settings at your registrar
5. Wait for DNS propagation (a few minutes to an hour)
6. Update `BETTER_AUTH_URL` to `https://jmpls.org` and redeploy
7. Update Stripe webhook URL to `https://jmpls.org/api/stripe-webhook`

### Important Architecture Notes

#### Data files (`data/*.json`) on Vercel

The admin panel reads and writes JSON files from the `data/` directory on disk. On Vercel serverless functions, the filesystem is **read-only** except for `/tmp`. This means:

- **Existing data files** (committed to git) will be readable — they're bundled with the deployment
- **Admin panel edits** (saving through the Dashboard → Content Admin) will appear to succeed but changes are **lost on the next deployment** or when the serverless instance recycles

**Workaround options:**
1. **Edit files locally and redeploy** — the most reliable approach. Make changes in `data/*.json`, commit, and push to auto-deploy
2. **Store data in the database** — Future enhancement: migrate the `data/` file system to database tables and serve via API endpoints
3. **Use a CDN or object storage** — Store files in S3/R2 and fetch via API

#### Stripe webhook delivery

- Stripe webhooks are sent to a **public URL** only. During development, the Stripe CLI's `listen` command creates a tunnel to your local machine
- On Vercel, the webhook endpoint is `https://your-domain.vercel.app/api/stripe-webhook`
- If your custom domain isn't set up yet, use the `*.vercel.app` domain initially and update the Stripe webhook URL later

#### Microsoft OAuth redirect URIs

After deploying, you must update your Azure AD app registration:
1. Go to [Azure Portal → App Registrations](https://portal.azure.com/#view/Microsoft_AAD_RegisteredApps/)
2. Select your app
3. Under **Authentication** → **Redirect URIs**, add:
   ```
   https://your-domain.vercel.app/api/auth/callback/microsoft
   ```
4. Save

Without this, Microsoft login will fail with a redirect URI mismatch error.

#### Cold starts

- Vercel serverless functions spin down after periods of inactivity (typically 15-30 minutes on the Hobby plan)
- The first request after idle will take **2-5 seconds** (the "cold start")
- Subsequent requests are fast (<100ms)
- This applies to both page loads (SSR) and API calls
- On the Pro plan ($20/month), you can enable "Lambda Advanced Features" for faster cold starts

#### Build and deploy times

| Step | Typical time | Notes |
|------|-------------|-------|
| `bun install` | 5-15s | Bun is very fast — these are cached if `bun.lock` hasn't changed |
| `bun run build` | 10-30s | Vite builds the client bundle + Vike renders pages |
| `vite-plugin-vercel` | 5-10s | Generates serverless functions for each page route |
| Vercel deployment | 10-20s | Uploading artifacts to Vercel's CDN |
| **Total** | **30-75s** | From `vercel --prod` to live |

### Troubleshooting

| Problem | Likely Cause | Solution |
|---------|-------------|----------|
| Build fails with `Cannot find module` | Missing dependency | Check `package.json` includes all imports. Run `bun install` locally first |
| API returns 404 | Serverless function not detecting routes | Check the path in `api/index.ts` matches Hono's route definitions |
| Login fails with redirect error | `BETTER_AUTH_URL` doesn't match actual domain | Set to exact deployed URL (including `https://`) |
| Microsoft login fails | Wrong redirect URI in Azure AD | Add `https://your-domain.vercel.app/api/auth/callback/microsoft` to Azure AD |
| Stripe webhook returning 400 | Wrong signing secret | Copy the fresh `whsec_...` from Stripe Dashboard → Webhooks |
| Admin panel saves but changes don't persist | Vercel read-only filesystem | Edit `data/*.json` locally and redeploy via git |
| Cold starts are slow | Serverless idle timeout | Normal — or upgrade to Pro plan for faster responses |
| Database connection refused | Wrong Turso URL or missing auth token | Verify `DB_URL` and `DB_AUTH_TOKEN` are set correctly in Vercel env vars |

### Local Production Test (Before Deploying)

To verify the production build works before deploying to Vercel:

```bash
# Build the Vike pages
bun run build

# Start the production server (runs on port 3000)
NODE_ENV=production BETTER_AUTH_SECRET=your-secret BETTER_AUTH_URL=http://localhost:3000 \
  bun run server/index.ts
```

This starts the full Node server with Vike SSR + static file serving. If everything works at `http://localhost:3000`, the Vercel deployment will work too (with Turso instead of SQLite).

---

### Alternative: Single-Server Deployment (VPS)

If you prefer a traditional VPS (DigitalOcean Droplet, Railway, Fly.io, Hetzner, etc.) instead of Vercel, you can run the full Node server directly. This approach:

- **Works with local SQLite** — no Turso needed
- **Has persistent file storage** — admin panel edits to `data/*.json` persist correctly
- **No cold starts** — server runs continuously
- **Simpler architecture** — single process handles both SSR and API

**Deployment steps:**

1. Set up a VPS or use a platform like Railway/Fly.io
2. Copy the `app/` directory to the server (or use Git)
3. Install Bun on the server:
   ```bash
   curl -fsSL https://bun.sh/install | bash
   ```
4. Install dependencies:
   ```bash
   cd app && bun install
   ```
5. Build the frontend:
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
8. Set up a reverse proxy (Nginx/Caddy) to forward requests to port 3000

**Example Nginx config:**
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

**Process management:** Use `pm2` or a systemd service to keep the server running:
```bash
npm install -g pm2
pm2 start "NODE_ENV=production bun run server/index.ts" --name jmpls
pm2 save
pm2 startup
```

This VPS approach doesn't need `vite-plugin-vercel` or the `api/` directory — those are Vercel-specific.
