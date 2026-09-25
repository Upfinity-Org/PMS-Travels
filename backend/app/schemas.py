from __future__ import annotations

import re
from datetime import date

from pydantic import BaseModel, EmailStr, Field, TypeAdapter, field_validator, model_validator

PHONE_RE = re.compile(r"^\+?[\d\s()-]+$")


class ContactRequest(BaseModel):
    """
    Mirrors the client-side checks in src/lib/enquiry.ts so a request that passes here would also
    have passed there — anything that fails must be either a stale form or a direct/bot request.
    """

    name: str = Field(min_length=2, max_length=80)
    phone: str = Field(min_length=1, max_length=24)
    email: str = Field(default="", max_length=120)
    service: str = Field(default="", max_length=80)
    vehicle: str = Field(default="", max_length=80)
    pickup: str = Field(default="", max_length=120)
    dropoff: str = Field(default="", max_length=120)
    travel_date: date | None = None
    passengers: int | None = Field(default=None, ge=1, le=60)
    message: str = Field(default="", max_length=1500)
    # Honeypot field: real visitors never see or fill this input (see ContactForm.tsx).
    website: str = Field(default="", max_length=200)
    # Milliseconds between the form rendering and the submit click; used to catch instant bot submits.
    elapsed_ms: int = Field(default=10_000, ge=0)

    @field_validator("name", "pickup", "dropoff", "message", "service", "vehicle")
    @classmethod
    def _strip(cls, v: str) -> str:
        return v.strip()

    @field_validator("email")
    @classmethod
    def _blank_or_valid_email(cls, v: str) -> str:
        # An empty string is a valid "no email given"; only validate the format when non-empty.
        v = v.strip()
        if v == "":
            return v
        # Delegate to Pydantic's own email check rather than re-implementing RFC 5322.
        TypeAdapter(EmailStr).validate_python(v)
        return v

    @field_validator("phone")
    @classmethod
    def _valid_phone(cls, v: str) -> str:
        v = v.strip()
        digits = re.sub(r"\D", "", v)
        if not PHONE_RE.match(v) or not (7 <= len(digits) <= 15):
            raise ValueError("Enter a valid phone number, for example +91 98765 43210.")
        return v

    @model_validator(mode="after")
    def _travel_date_not_past(self) -> "ContactRequest":
        if self.travel_date is not None and self.travel_date < date.today():
            raise ValueError("travel_date must be today or later")
        return self


class ContactSuccess(BaseModel):
    reference: str


class ContactError(BaseModel):
    message: str
    errors: dict[str, str] = Field(default_factory=dict)
