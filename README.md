# P.M.S Tours & Travels — website

A prerendered React site (Vite + React Router 8 + Tailwind v4) for a car-rental-with-driver
business, plus a small FastAPI backend that emails contact-form enquiries straight to your inbox.
Built to be production-ready: real per-page SEO, generated logos/favicons, a multi-page structure,
and a self-hosted contact form with no third-party form service in the loop.

## What's here

```
src/            React app: pages, shared components, content data, SEO helpers
scripts/        prerender.mjs — turns the build into static HTML + robots.txt + sitemap.xml
backend/        FastAPI app that emails contact-form submissions over your own SMTP account
tools/          build_brand_assets.py — regenerates every logo/favicon/OG image in public/
public/         Generated logos, favicons, manifest, self-hosted font files land here at build time
```

## Quick start (frontend)

```bash
pnpm install
cp .env.example .env      # set VITE_SITE_URL to your real domain before deploying
pnpm dev                  # http://localhost:8443 — proxies /api to the backend (see below)
```

```bash
pnpm build                # typechecked, linted output goes to dist/ (prerendered, ready to deploy)
pnpm preview               # serve the production build locally to sanity-check it
```

`pnpm build` runs three steps (see `package.json`): a normal Vite client build, an SSR build of
`src/entry-server.tsx`, then `scripts/prerender.mjs`, which renders every route in
`src/routes.tsx` to real static HTML, so each page has full content and correct `<head>` tags
before any JavaScript runs — this is what makes the site properly crawlable (see SEO section
below). React then hydrates over that markup in the browser.

## Quick start (backend — the contact form)

```bash
cd backend
pip install -r requirements.txt
cp .env.example .env      # SMTP_HOST, SMTP_USERNAME, SMTP_PASSWORD, CONTACT_TO_EMAIL — see backend/README.md
uvicorn app.main:app --reload
```

With both running, `pnpm dev`'s Vite server proxies `/api/*` to `http://127.0.0.1:8000`
automatically (see `vite.config.ts`), so the contact form on `/contact` works end-to-end locally.
Full details, including how to get Gmail/Zoho SMTP credentials and how the anti-spam and
rate-limiting logic works, are in `backend/README.md`.

**No third-party form service is involved anywhere.** The form posts to your own FastAPI endpoint,
which sends over your own mailbox's SMTP using Python's standard library — nothing about a
visitor's enquiry passes through Formspree, Netlify Forms, Zapier, or similar.

## The site structure

The original single-page design is now ten distinct pages, which is generally better for SEO than
one long page: each page can target a specific search intent (e.g. "tempo traveller rental" vs.
"airport taxi") with its own title, meta description and heading, and can be linked to directly.

- `/` — home
- `/fleet` and `/fleet/:slug` — sedans, MPVs/SUVs, group travellers, each with its own detail page
- `/services` and `/services/:slug` — temple circuits, family trips, corporate travel, airport
  transfers, custom itineraries
- `/pricing` — the rate card
- `/about`, `/contact`, `/privacy-policy`

Edit content in `src/content/fleet.ts`, `src/content/services.ts` and `src/content/faqs.ts` —
pages render from this data, so a rate change or new FAQ doesn't require touching page markup.
Business details (phone, WhatsApp, Instagram, address) are centralised in `src/config/site.ts`.

## SEO & Google Search Console

What's implemented:

- **Per-page metadata**: unique `<title>`, meta description, canonical URL, Open Graph and Twitter
  card tags for all 15 pages (see `src/seo/head.ts`, used via the `<Seo>` component on every page).
- **Structured data (JSON-LD)**: `LocalBusiness`/`TravelAgency`, `Service`, `BreadcrumbList`, and
  page-type schema, generated in `src/seo/schema.ts`.
- **Static prerendering**: every page ships as real HTML (see above), not just a JS shell.
- **`robots.txt` and `sitemap.xml`**: generated automatically at build time from the real route
  list (`src/routes.tsx` → `staticPaths()`), so they can never drift out of sync with the site.
- **A real `404.html`**: most static hosts (Netlify, Vercel, GitHub Pages, S3+CloudFront with a
  custom error response) serve this automatically for unmatched URLs.

### Verifying the site in Google Search Console

1. In Search Console, add your property and choose the **HTML tag** verification method (not the
   file-upload method, which prerendering doesn't fit as naturally).
2. Copy just the `content="..."` value it gives you.
3. Put it in `.env` as `VITE_GOOGLE_SITE_VERIFICATION=that-value` and rebuild — the tag is injected
   into `index.html` automatically (see the `googleSiteVerification` plugin in `vite.config.ts`).
4. Once verified, submit `https://yourdomain.com/sitemap.xml` under Search Console → Sitemaps.

### Before you go live, edit these

- `src/config/site.ts` — phone number, WhatsApp/Instagram links, and (optional) street address and
  public email are placeholders/your originals; fill in `address` if you want it published (it's
  left out of the page and structured data entirely until you do).
- `.env` — set `VITE_SITE_URL` to your real domain. This drives every canonical URL, Open Graph
  URL, and the sitemap — the build does not guess it for you.
- `public/og-image.png`, `public/logo*.svg`, `public/favicon*` — regenerate any time your branding
  changes with `python3 tools/build_brand_assets.py` (see below).

## Logos & favicons

Every logo, favicon and the social-share (OG) image are generated by
`tools/build_brand_assets.py` — a from-scratch mark (no external logo file was supplied), rendered
as SVG and rasterized with Playwright, so it's crisp at every size and reproducible if you ever
want to tweak a colour and regenerate everything identically.

```bash
pip install fonttools pillow playwright
playwright install chromium
python3 tools/build_brand_assets.py     # writes everything into public/
```

Files it produces: `favicon.ico` (16/32/48px), `favicon.svg`, `apple-touch-icon.png`,
`icon-192.png` / `icon-512.png` / `icon-maskable-512.png` (PWA), `logo.svg` / `logo-white.svg`
(header/footer wordmark, light and dark), `logo-mark.svg` (icon alone), and `og-image.png`
(1200×630 social preview).

## Deployment

The build output (`dist/`) is a plain static site — any static host works:

- **Netlify / Vercel / GitHub Pages**: point the build command at `pnpm build`, publish directory
  `dist`. 404.html is picked up automatically by all three.
- **S3 + CloudFront**: upload `dist/`, set the CloudFront custom error response for 404 to return
  `/404.html` with a 404 status.
- **Your own server (nginx)**: see `nginx.conf` at the repo root for a working config (also used by
  the included `Dockerfile`/`docker-compose.yml` for a one-command local full-stack run).

The backend (FastAPI) is a separate small service — deploy it anywhere that runs Python
(a VPS, a container platform, etc.) and point your static host's `/api/*` requests at it (reverse
proxy, or a platform's own rewrite rules). See `backend/README.md`.

## Checks

```bash
pnpm check     # tsc --noEmit + eslint .
pnpm build     # also fails loudly if any page doesn't render (see scripts/prerender.mjs)
cd backend && pytest
```
