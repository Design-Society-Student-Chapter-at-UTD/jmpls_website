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

The project is already set up for Vercel deployment. Here's what's configured:

| File | Purpose |
|------|---------|
| `api/index.ts` | Vercel serverless function — exports the Hono API `fetch` handler |
| `server/api.ts` | API-only Hono app (all API routes, no SSR middleware) |
| `server/index.ts` | Production server — imports `server/api.ts`, adds Vike SSR + static file serving for non-Vercel deployments |
| `vite.config.ts` | Includes `vite-plugin-vercel` adapter (auto-detects `@vite-plugin-vercel/vike`) |
| `vercel.json` | Build and deployment configuration |

**Key architecture for Vercel:**
- **Vike SSR pages** → built into serverless functions by `vite-plugin-vercel`
- **API routes** (`/api/*`) → handled by the `api/index.ts` serverless function
- **Database** → Local SQLite won't work on Vercel (no persistent filesystem). You must use [Turso](https://turso.tech) or another hosted database.

### Prerequisites

1. A [Vercel](https://vercel.com) account
2. A [Turso](https://turso.tech) account for the hosted database
3. Environment variables ready (see [Environment Variables](#environment-variables))

### Step 1: Migrate Database to Turso

Vercel serverless functions don't have a persistent filesystem, so local SQLite won't work.

1. Create a free Turso account:
   ```bash
   # Install Turso CLI
   brew install tursodatabase/tap/turso
   # or: curl -sSfL https://get.tur.so/install.sh | bash

   # Login and create a database
   turso auth login
   turso db create jmpls
   turso db show jmpls --url  # copy this URL
   ```

2. Push the schema:
   ```bash
   DB_URL="libsql://your-db-url.turso.io" bun run db:push
   ```

> **Note**: Any data in your local `jmpls.db` won't transfer automatically. Export it before switching.

### Step 2: Set Environment Variables on Vercel

| Variable | Required | Description |
|----------|----------|-------------|
| `BETTER_AUTH_SECRET` | Yes | Auth secret (min 32 chars) |
| `BETTER_AUTH_URL` | Yes | Your Vercel domain (`https://your-project.vercel.app`) |
| `DB_URL` | Yes | Turso database URL |
| `STRIPE_SECRET_KEY` | For payments | Stripe secret key |
| `STRIPE_WEBHOOK_SECRET` | For webhooks | Stripe webhook signing secret |
| `MICROSOFT_CLIENT_ID` | For Microsoft login | OAuth client ID |
| `MICROSOFT_CLIENT_SECRET` | For Microsoft login | OAuth client secret |
| `MICROSOFT_TENANT_ID` | For Microsoft login | OAuth tenant ID |

### Step 3: Deploy

**Via CLI (no web UI needed):**
```bash
cd app
bun x vercel --prod
```
The CLI will prompt you to link to an existing project or create a new one. The `vercel.json` in `app/` handles all build settings.

**Via Git (GitHub integration):**
1. Push the repo to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your repo
4. Set **Root Directory** to `app` (where `package.json` lives)
5. Add environment variables from Step 2
6. Deploy

> The `vercel.json` handles all build and output settings — no need to configure through the web UI beyond root directory and env vars.

### Notes

- **`vite-plugin-vercel`** automatically bundles Vike SSR pages into serverless functions. The `@vite-plugin-vercel/vike` integration is auto-detected.
- **`api/index.ts`** is auto-detected by Vercel as a serverless function serving all `/api/*` routes.
- **Cold starts**: The first request may be slow. This is normal for serverless.
- **Local development** still runs via `bun run dev` — the api-server Vite plugin starts a Hono server on port 3001 as before.

### Alternative: Single-Server Deployment

If you prefer a VPS (DigitalOcean, Railway, Fly.io, etc.) instead of Vercel, the existing `server/index.ts` still works for traditional deployments:

```bash
NODE_ENV=production BETTER_AUTH_SECRET=... bun run server/index.ts
```

This approach works with local SQLite and doesn't need `vite-plugin-vercel` or the `api/` directory.
