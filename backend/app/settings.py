from __future__ import annotations

from functools import lru_cache

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """
    Loaded from environment variables / backend/.env (see .env.example).
    Nothing here is a secret default: SMTP credentials and recipients must be set explicitly,
    so the server refuses to start half-configured rather than silently failing to send mail.
    """

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    smtp_host: str = "localhost"
    smtp_port: int = 587
    smtp_username: str = ""
    smtp_password: str = ""
    smtp_use_tls: bool = True

    contact_to_email: str = ""
    contact_from_name: str = "Website enquiry"

    cors_allow_origins: str = ""
    contact_rate_limit_per_hour: int = 5
    api_shared_secret: str = ""

    @field_validator("contact_rate_limit_per_hour")
    @classmethod
    def _positive_rate_limit(cls, v: int) -> int:
        return max(1, v)

    @property
    def to_addresses(self) -> list[str]:
        return [a.strip() for a in self.contact_to_email.split(",") if a.strip()]

    @property
    def allowed_origins(self) -> list[str]:
        return [o.strip() for o in self.cors_allow_origins.split(",") if o.strip()]

    @property
    def mail_configured(self) -> bool:
        return bool(self.smtp_host and self.smtp_username and self.smtp_password and self.to_addresses)


@lru_cache
def get_settings() -> Settings:
    return Settings()
