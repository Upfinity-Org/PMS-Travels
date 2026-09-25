from __future__ import annotations

from datetime import date, timedelta
from unittest.mock import patch

from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)

VALID_PAYLOAD = {
    "name": "Anita Raman",
    "phone": "+91 98765 43210",
    "email": "anita@example.com",
    "service": "Airport pickup or drop",
    "vehicle": "Sedan (4 guests)",
    "pickup": "Chennai Airport",
    "dropoff": "T. Nagar",
    "travel_date": (date.today() + timedelta(days=3)).isoformat(),
    "passengers": 3,
    "message": "Flight lands at 6am.",
    "website": "",
    "elapsed_ms": 8000,
}


def _post(payload: dict) -> "httpx.Response":  # type: ignore[name-defined]
    return client.post("/api/contact", json=payload)


def test_health() -> None:
    res = client.get("/api/health")
    assert res.status_code == 200
    assert res.json() == {"status": "ok"}


@patch("app.main.send_enquiry_email")
def test_valid_submission_is_emailed_and_returns_reference(mock_send) -> None:
    res = _post(VALID_PAYLOAD)
    assert res.status_code == 201
    body = res.json()
    assert body["reference"].startswith("PMS-")
    mock_send.assert_called_once()


def test_missing_name_returns_422_with_field_errors() -> None:
    payload = {**VALID_PAYLOAD, "name": "A"}
    res = _post(payload)
    assert res.status_code == 422
    assert "name" in res.json()["errors"]


def test_invalid_phone_returns_422() -> None:
    payload = {**VALID_PAYLOAD, "phone": "call me maybe"}
    res = _post(payload)
    assert res.status_code == 422
    assert "phone" in res.json()["errors"]


def test_invalid_email_returns_422() -> None:
    payload = {**VALID_PAYLOAD, "email": "not-an-email"}
    res = _post(payload)
    assert res.status_code == 422
    assert "email" in res.json()["errors"]


def test_blank_email_is_allowed() -> None:
    payload = {**VALID_PAYLOAD, "email": ""}
    with patch("app.main.send_enquiry_email"):
        res = _post(payload)
    assert res.status_code == 201


def test_past_travel_date_returns_422() -> None:
    payload = {**VALID_PAYLOAD, "travel_date": (date.today() - timedelta(days=1)).isoformat()}
    res = _post(payload)
    assert res.status_code == 422


@patch("app.main.send_enquiry_email")
def test_honeypot_field_is_silently_dropped(mock_send) -> None:
    payload = {**VALID_PAYLOAD, "website": "http://spam.example"}
    res = _post(payload)
    assert res.status_code == 201
    assert res.json()["reference"].startswith("PMS-")
    mock_send.assert_not_called()


@patch("app.main.send_enquiry_email")
def test_too_fast_submission_is_silently_dropped(mock_send) -> None:
    payload = {**VALID_PAYLOAD, "elapsed_ms": 200}
    res = _post(payload)
    assert res.status_code == 201
    mock_send.assert_not_called()


@patch("app.main.send_enquiry_email", side_effect=Exception("smtp down"))
def test_mail_failure_still_returns_502_but_does_not_crash(mock_send) -> None:
    from app.mailer import MailSendError

    mock_send.side_effect = MailSendError("smtp down")
    res = _post(VALID_PAYLOAD)
    assert res.status_code == 502
    assert "reference" not in res.json()


@patch("app.main.send_enquiry_email")
def test_rate_limit_blocks_after_configured_threshold(mock_send) -> None:
    # CONTACT_RATE_LIMIT_PER_HOUR=3 is set in tests/conftest.py
    for _ in range(3):
        res = _post(VALID_PAYLOAD)
        assert res.status_code == 201
    res = _post(VALID_PAYLOAD)
    assert res.status_code == 429
