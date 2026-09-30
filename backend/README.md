# Backend — contact form API

A small FastAPI service with one real job: take a validated enquiry from the website's contact
form and email it to your inbox over your own SMTP account. No third-party form or email API is
involved — sending happens with Python's standard-library `smtplib`, so nothing about a visitor's
enquiry passes through another company's servers before it reaches you.

## What it does

- `POST /api/contact` — validates the payload (mirrors the checks in
  `src/lib/enquiry.ts` on the frontend), rejects spam (a hidden honeypot field plus a
  minimum-fill-time check), rate-limits by IP (`CONTACT_RATE_LIMIT_PER_HOUR`), emails the
  enquiry, and appends a backup copy to `backend/data/enquiries.jsonl` regardless of whether the
  email send succeeds — so an enquiry is never silently lost to an SMTP hiccup.
- `GET /api/health` — plain liveness check.

## Setup

```bash
cd backend
python3 -m venv .venv && source .venv/bin/activate    # or your preferred way of isolating deps
pip install -r requirements.txt
cp .env.example .env
# edit .env: SMTP_HOST, SMTP_USERNAME, SMTP_PASSWORD, CONTACT_TO_EMAIL, CORS_ALLOW_ORIGINS
uvicorn app.main:app --reload
```

### Getting SMTP credentials

Any mailbox with SMTP access works. Two common ones:

- **Gmail / Google Workspace**: enable 2-Step Verification on the account, then create an
  [App Password](https://myaccount.google.com/apppasswords) (Google Account → Security → 2-Step
  Verification → App passwords). Use that 16-character password as `SMTP_PASSWORD`, your Gmail
  address as `SMTP_USERNAME`, `smtp.gmail.com` / port `587` for host/port.
- **Zoho Mail / your web host's mailbox**: use the SMTP host, port and password your provider's
  mail settings page gives you (Zoho: `smtp.zoho.com`, port `587`).

### Running the tests

```bash
pip install -r requirements-dev.txt
pytest
```

11 tests cover: valid submissions being emailed, every validation rule (name, phone, email,
travel date), the honeypot and fill-speed anti-spam checks, a failed email send still returning a
clear error instead of crashing, and the rate limiter.

## Configuration reference

See `.env.example` for every variable with inline explanations. The important ones:

| Variable | Purpose |
|---|---|
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_USERNAME` / `SMTP_PASSWORD` | Your mail account. |
| `CONTACT_TO_EMAIL` | Where enquiries land. Comma-separate for more than one inbox. |
| `CORS_ALLOW_ORIGINS` | Your real site origin(s) — required once frontend and backend are on different hosts. |
| `CONTACT_RATE_LIMIT_PER_HOUR` | Submissions allowed per IP per hour before a 429. |
| `API_SHARED_SECRET` | Optional extra header check (`X-API-Key`) if you want a second layer beyond CORS. |

## Deploying

- **Railway** (recommended, see root `README.md` > "Publishing on Netlify" for the full walkthrough
  alongside the frontend): connect this repo, set the service's root directory to `backend`.
  Railway auto-detects `backend/Procfile` and runs
  `uvicorn app.main:app --host 0.0.0.0 --port $PORT`. Add the environment variables from
  `.env.example` under the service's Variables tab, then generate a public domain under
  Settings → Networking.
- **Docker**: `docker build -t pms-backend .` then run with your `.env` file, or use the root
  `docker-compose.yml` which wires this up alongside the frontend.
- **Anywhere else that runs a Python process** (Render, Fly.io, a VPS): `uvicorn app.main:app
  --host 0.0.0.0 --port 8000` behind a reverse proxy (nginx, Caddy, your platform's own proxy)
  that forwards `/api/*` to it. Set `VITE_SITE_URL`'s origin as the deployed API's
  `CORS_ALLOW_ORIGINS`.

The enquiry backup log (`backend/data/enquiries.jsonl`) is append-only local storage, not a
database — for meaningful production volume, swap `app/storage.py`'s `save_enquiry` for a real
datastore, but for a small business site's enquiry volume this is a durable, dependency-free
safety net.
