# Wasay Online Mobile Shop — Production Build

Cinematic 3D storefront (React 18 + Vite + Tailwind + React Three Fiber) with a
full product management system, WhatsApp ordering, and an admin panel.

```
npm install
npm run dev      # → http://localhost:5173  (shop)
                 # → http://localhost:5173/admin  (admin panel)
```

---

## Two data modes (automatic)

| Mode | When | Data stored |
|---|---|---|
| **Demo / local** | No env vars set | Browser localStorage — products + images persist in that browser only |
| **Production** | `SUPABASE_URL` + `SUPABASE_SERVICE_KEY` set | Supabase Postgres + Storage — shared, persistent, survives redeploys |

The site detects the mode automatically on first load. In local mode the admin
password is `wasay123`. **In production the admin password is your `ADMIN_KEY` env var.**

---

## Production setup (Supabase + Vercel) — ~10 minutes

### 1. Create the database (free)
1. Go to https://supabase.com → **New project** (free tier is fine).
2. Open **SQL Editor** → paste the contents of `schema.sql` → **Run**.
3. Open **Storage** → **New bucket** → name it exactly `product-images` → toggle **Public = ON**.

### 2. Get your keys
- **Project Settings → API**:
  - `Project URL` → your `SUPABASE_URL`
  - `service_role` key (secret) → your `SUPABASE_SERVICE_KEY`

### 3. Deploy to Vercel
1. Push this folder to GitHub/GitLab.
2. https://vercel.com → **Add New Project** → import the repo.
   Vercel auto-detects Vite — no build settings needed.
3. Before deploying, open **Environment Variables** and add:
   ```
   SUPABASE_URL=https://YOUR_PROJECT.supabase.co
   SUPABASE_SERVICE_KEY=YOUR_SERVICE_ROLE_KEY
   ADMIN_KEY=pick-a-strong-password-you-will-remember
   ```
4. **Deploy.**

The `api/` folder becomes serverless functions automatically. `vercel.json`
handles SPA routing so `/admin` works on refresh.

### 4. Use it
- Shop: `https://your-app.vercel.app`
- Admin: `https://your-app.vercel.app/admin` → sign in with your `ADMIN_KEY`.

---

## Managing products

At `/admin` you can:
- **Add / edit / delete** phones: photo upload (auto-compressed), name, brand,
  price (Rs), storage, description, featured flag (featured shows first).
- **Set your WhatsApp number** (Settings tab) — every product card's
  "Order on WhatsApp" button instantly points to it, with a pre-filled order message.

Data changes appear on the storefront immediately (no code edits, no redeploys).

---

## Customizing content

- All static text/stats/links: `src/content.js`
- Brand colors: `tailwind.config.js`
- 3D hero phone screen: `src/three/screenTexture.js` (procedural placeholder —
  swap for a real screenshot; see README section in git history or ask)
- Store links in Download section: `content.js` (`iosUrl` / `androidUrl`)
  — or replace with your WhatsApp catalog link in `src/components/Download.jsx`

## Project map

```
api/                    # Vercel serverless functions (Node)
  _lib/supabase.js      # DB client + admin check
  products.js           # GET / POST / PUT / DELETE /api/products
  settings.js           # GET / PUT /api/settings (WhatsApp number)
  upload.js             # POST /api/uploads → Supabase Storage, returns public URL
  login.js              # POST /api/login (verifies ADMIN_KEY)
src/
  api/client.js         # Frontend data layer — auto API/localStorage fallback
  pages/Admin.jsx       # Admin panel (products CRUD + settings)
  components/
    Products.jsx        # Live product grid with WhatsApp order buttons
    ...                 # Navbar, Hero (3D), About, Features, HowItWorks,
                        # Benefits, Download, Footer, Reveal (unchanged)
vercel.json             # SPA rewrites + asset caching
schema.sql              # Run once in Supabase SQL Editor
.env.example            # Copy to .env for local production-mode testing
```

## Security notes

- `SUPABASE_SERVICE_KEY` and `ADMIN_KEY` live **only** in Vercel env vars —
  never exposed to the browser.
- All write operations (create/update/delete product, settings, upload) require
  the admin key, verified server-side.
- Image uploads are resized client-side before upload (~50–150 KB each).
