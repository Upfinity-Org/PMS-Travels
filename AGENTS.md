# P.M.S Tours & Travels — pmstoursandtravels.com

React + Vite + Tailwind CSS v4 marketing site, prerendered to static HTML for SEO, with a small
FastAPI backend that emails contact-form enquiries. See `README.md` at the repo root for the full
picture (setup, SEO, deployment, the contact form pipeline). This file is a quick orientation for
an agent working inside Figma Make specifically.

## Development server

A Vite development server is **already running** on `$PORT` (default 8443). You don't need to
start it manually. It proxies `/api/*` to a FastAPI backend at `http://127.0.0.1:8000` (see
`vite.config.ts` > `server.proxy`) — run the backend yourself with
`cd backend && uvicorn app.main:app --reload` if you're testing the contact form.

- Preview URL: the user can access the running app through the preview panel.
- Hot reload: changes to source files are reflected immediately.
- The contact form and anything under `/api` will not work in the preview unless the backend is
  also running (see `backend/README.md`).

## Project structure

Start with the task-relevant files below; only follow imports elsewhere when required.

- `src/main.tsx` — hydrates the prerendered HTML (`hydrateRoot`), imports `src/index.css`.
- `src/App.tsx` — mounts the client-side router (`createBrowserRouter`).
- `src/routes.tsx` — the single source of truth for every route and URL, shared by the browser app
  and the SSR/prerender entry. Route components are imported eagerly (not `React.lazy` /
  `route.lazy`) — see the comment in that file for why.
- `src/entry-server.tsx` — renders one URL to an HTML string for `scripts/prerender.mjs`.
- `src/pages/*` — one file per route.
- `src/components/*` — shared UI (Header, Footer, ContactForm, cards, etc.).
- `src/content/*` — the fleet, services and FAQ data that pages render from. Edit these, not the
  pages, when copy or rates change.
- `src/config/site.ts` — business details (phone, socials, address) used across the site.
- `src/seo/*` — the `<Seo>` component, `<head>` builder and JSON-LD schema generators.
- `scripts/prerender.mjs` — turns the SSR build into real static HTML per route, plus
  `robots.txt`/`sitemap.xml`/`404.html`. Runs automatically as part of `pnpm build`.
- `backend/` — the FastAPI app that emails contact-form submissions (own SMTP account, no
  third-party form service). See `backend/README.md`.
- `index.html` — Vite HTML shell; `<!--app-html-->`/`<!--app-head-->` are filled in by the
  prerender step, `<!--site-verification-->` by the Google Search Console token if set.
- `vite.config.ts` — Vite config: React, Tailwind v4, the `/api` dev proxy, the Google Search
  Console meta-tag plugin, and the Figma Make platform plugins.

## Dependencies

- Runtime: React 19, React DOM 19, react-router 8 (data router, `StaticRouter` for SSR).
- Styling: Tailwind CSS v4 via `@tailwindcss/vite`; fonts are self-hosted via `@fontsource/*`
  (no Google Fonts network dependency).
- Build tooling: Vite 8, TypeScript 5, `@vitejs/plugin-react`.
- Backend: FastAPI, `slowapi` (rate limiting), stdlib `smtplib` for email — see
  `backend/requirements.txt`.
- Formatting: oxfmt. Linting: ESLint 10 (flat config in `eslint.config.js`) with
  `typescript-eslint`, `eslint-plugin-jsx-a11y`, `eslint-plugin-react-hooks`.

## Styling

Tailwind CSS v4 via the `@tailwindcss/vite` plugin. `src/index.css` imports Tailwind
(`@import 'tailwindcss';`) and defines the design tokens under `@theme` (colors, fonts). Use
Tailwind utility classes directly in JSX; put global CSS or theme changes in `src/index.css`.
No separate Tailwind config or PostCSS config file is used.

## Before committing

Run `pnpm check` (typecheck + lint) and `pnpm build` (also prerenders every page) before shipping
frontend changes. For backend changes, run `pytest` inside `backend/`.
