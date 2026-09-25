from __future__ import annotations

import json
import logging
from datetime import UTC, datetime
from pathlib import Path
from threading import Lock

from .schemas import ContactRequest

logger = logging.getLogger("pms.storage")

_LOCK = Lock()
DATA_DIR = Path(__file__).resolve().parent.parent / "data"
LOG_PATH = DATA_DIR / "enquiries.jsonl"


def save_enquiry(enquiry: ContactRequest, reference: str, remote_ip: str, emailed: bool) -> None:
    """
    Append-only local backup of every enquiry, independent of whether the email send succeeded.
    This is a safety net (see README > Contact form), not a database — for real production traffic,
    swap this for a proper store, but for a small business site a durable local log is enough to
    make sure no enquiry is ever silently lost if a mail send fails.
    """
    record = {
        "reference": reference,
        "received_at": datetime.now(UTC).isoformat(),
        "remote_ip": remote_ip,
        "emailed": emailed,
        **enquiry.model_dump(mode="json", exclude={"website", "elapsed_ms"}),
    }
    try:
        DATA_DIR.mkdir(parents=True, exist_ok=True)
        with _LOCK, LOG_PATH.open("a", encoding="utf-8") as f:
            f.write(json.dumps(record, ensure_ascii=False) + "\n")
    except OSError:
        logger.exception("Failed to persist enquiry backup (reference=%s)", reference)
