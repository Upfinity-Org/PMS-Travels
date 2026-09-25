from __future__ import annotations

import hashlib
import logging
import secrets
import uuid
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import ValidationError
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address

from .mailer import MailSendError, send_enquiry_email
from .schemas import ContactRequest
from .settings import get_settings
from .storage import save_enquiry

logger = logging.getLogger("pms.api")
settings = get_settings()

limiter = Limiter(key_func=get_remote_address, default_limits=[])


@asynccontextmanager
async def lifespan(app: FastAPI):
    if not settings.mail_configured:
        logger.warning(
            "SMTP is not fully configured — /api/contact will accept enquiries, log them to "
            "backend/data/enquiries.jsonl, but cannot email them until backend/.env is filled in "
            "(see backend/.env.example)."
        )
    yield


app = FastAPI(title="P.M.S Tours & Travels API", version="1.0.0", docs_url=None, redoc_url=None, lifespan=lifespan)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# In development, Vite's dev server proxies /api itself so the browser never makes a cross-origin
# request; CORS only matters for the built site talking to a separately-hosted API in production.
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins or ["*"],
    allow_methods=["POST", "GET", "OPTIONS"],
    allow_headers=["Content-Type", "X-API-Key"],
)


def _hash_ip(ip: str) -> str:
    # We never store raw IPs (see the privacy policy): only a salted-free one-way hash, kept
    # solely to spot abuse patterns.
    return hashlib.sha256(f"pms-ip-salt:{ip}".encode()).hexdigest()[:16]


def _client_ip(request: Request) -> str:
    return get_remote_address(request)


@app.get("/api/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/api/contact", status_code=status.HTTP_201_CREATED)
@limiter.limit(lambda: f"{get_settings().contact_rate_limit_per_hour}/hour")
async def submit_contact(request: Request) -> JSONResponse:
    if settings.api_shared_secret and request.headers.get("x-api-key") != settings.api_shared_secret:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid API key.")

    body = await request.json()

    try:
        enquiry = ContactRequest.model_validate(body)
    except ValidationError as exc:
        errors: dict[str, str] = {}
        for err in exc.errors():
            field = str(err["loc"][0]) if err["loc"] else "form"
            errors.setdefault(field, err["msg"])
        return JSONResponse(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            content={"message": "Please check the highlighted fields.", "errors": errors},
        )

    # Honeypot: a hidden field real visitors never see or fill (see ContactForm.tsx).
    if enquiry.website.strip():
        logger.info("Dropped honeypot submission (hash=%s)", _hash_ip(_client_ip(request)))
        return JSONResponse(status_code=status.HTTP_201_CREATED, content={"reference": _fake_reference()})

    # A submit faster than a person could plausibly fill the form is treated the same way:
    # accepted silently so the bot moves on, but never emailed or stored as a real enquiry.
    if enquiry.elapsed_ms < 1500:
        logger.info("Dropped too-fast submission (%sms, hash=%s)", enquiry.elapsed_ms, _hash_ip(_client_ip(request)))
        return JSONResponse(status_code=status.HTTP_201_CREATED, content={"reference": _fake_reference()})

    reference = f"PMS-{uuid.uuid4().hex[:8].upper()}"
    remote_ip_hash = _hash_ip(_client_ip(request))

    emailed = True
    try:
        send_enquiry_email(enquiry, reference, remote_ip_hash, settings)
    except MailSendError:
        emailed = False  # Still acknowledge the enquiry — see save_enquiry, the local backup log.

    save_enquiry(enquiry, reference, remote_ip_hash, emailed)

    if not emailed:
        # We could not email the team, but the enquiry is safely logged; tell the visitor plainly
        # rather than pretending it worked, so they know to call instead if it's urgent.
        return JSONResponse(
            status_code=status.HTTP_502_BAD_GATEWAY,
            content={"message": "We saved your enquiry but could not send the notification email just now. Please also call or WhatsApp us."},
        )

    return JSONResponse(status_code=status.HTTP_201_CREATED, content={"reference": reference})


def _fake_reference() -> str:
    # Given to rejected bot/honeypot submissions so their response is indistinguishable from a
    # real success, without ever being written to the enquiry log or emailed.
    return f"PMS-{secrets.token_hex(4).upper()}"
