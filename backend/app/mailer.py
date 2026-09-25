from __future__ import annotations

import logging
import smtplib
import ssl
from datetime import UTC, datetime
from email.message import EmailMessage
from email.utils import formataddr

from .schemas import ContactRequest
from .settings import Settings

logger = logging.getLogger("pms.mailer")


def _field_rows(enquiry: ContactRequest, reference: str, remote_ip: str) -> list[tuple[str, str]]:
    rows = [
        ("Reference", reference),
        ("Name", enquiry.name),
        ("Phone", enquiry.phone),
        ("Email", enquiry.email or "—"),
        ("Trip type", enquiry.service or "—"),
        ("Vehicle", enquiry.vehicle or "—"),
        ("Passengers", str(enquiry.passengers) if enquiry.passengers else "—"),
        ("Pickup", enquiry.pickup or "—"),
        ("Destination", enquiry.dropoff or "—"),
        ("Travel date", enquiry.travel_date.isoformat() if enquiry.travel_date else "—"),
    ]
    if enquiry.message:
        rows.append(("Message", enquiry.message))
    rows.append(("Submitted", datetime.now(UTC).strftime("%d %b %Y, %H:%M UTC")))
    rows.append(("Sender IP", remote_ip))
    return rows


def _escape(text: str) -> str:
    return text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def build_email(enquiry: ContactRequest, reference: str, remote_ip: str) -> EmailMessage:
    rows = _field_rows(enquiry, reference, remote_ip)

    text_lines = [f"{label}: {value}" for label, value in rows]
    text_body = "New website enquiry\n\n" + "\n".join(text_lines) + "\n"

    html_rows = "".join(
        f'<tr><td style="padding:6px 14px 6px 0;color:#666;white-space:nowrap;vertical-align:top">{_escape(label)}</td>'
        f'<td style="padding:6px 0;color:#111">{_escape(value)}</td></tr>'
        for label, value in rows
    )
    html_body = (
        '<div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#111">'
        '<h2 style="margin:0 0 12px">New website enquiry</h2>'
        f'<table cellpadding="0" cellspacing="0">{html_rows}</table>'
        "</div>"
    )

    msg = EmailMessage()
    subject_bits = [enquiry.name, enquiry.service or "Enquiry", enquiry.travel_date.isoformat() if enquiry.travel_date else None]
    msg["Subject"] = "New enquiry: " + " · ".join(b for b in subject_bits if b)
    msg.set_content(text_body)
    msg.add_alternative(html_body, subtype="html")
    if enquiry.email:
        # Lets whoever reads the inbox hit "Reply" and land straight in the customer's mailbox,
        # without letting the customer spoof the mail's real From: address (SMTP auth still uses ours).
        msg["Reply-To"] = enquiry.email
    return msg


class MailSendError(RuntimeError):
    pass


def send_enquiry_email(enquiry: ContactRequest, reference: str, remote_ip: str, settings: Settings) -> None:
    """
    Sends over SMTP using the project's own mail account — no third-party form/email API involved.
    Raises MailSendError on any failure so the caller can decide how to respond to the visitor.
    """
    if not settings.mail_configured:
        raise MailSendError("SMTP is not configured (see backend/.env.example).")

    msg = build_email(enquiry, reference, remote_ip)
    msg["From"] = formataddr((settings.contact_from_name, settings.smtp_username))
    msg["To"] = ", ".join(settings.to_addresses)

    try:
        if settings.smtp_port == 465:
            context = ssl.create_default_context()
            with smtplib.SMTP_SSL(settings.smtp_host, settings.smtp_port, context=context, timeout=15) as server:
                server.login(settings.smtp_username, settings.smtp_password)
                server.send_message(msg)
        else:
            with smtplib.SMTP(settings.smtp_host, settings.smtp_port, timeout=15) as server:
                server.ehlo()
                if settings.smtp_use_tls:
                    server.starttls(context=ssl.create_default_context())
                    server.ehlo()
                server.login(settings.smtp_username, settings.smtp_password)
                server.send_message(msg)
    except (smtplib.SMTPException, OSError) as exc:
        logger.exception("Failed to send enquiry email (reference=%s)", reference)
        raise MailSendError(str(exc)) from exc
