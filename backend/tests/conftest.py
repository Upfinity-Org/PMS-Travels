import os
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

os.environ.setdefault("SMTP_HOST", "smtp.example.test")
os.environ.setdefault("SMTP_USERNAME", "bot@example.test")
os.environ.setdefault("SMTP_PASSWORD", "test-password")
os.environ.setdefault("CONTACT_TO_EMAIL", "owner@example.test")
os.environ.setdefault("CONTACT_RATE_LIMIT_PER_HOUR", "3")

import pytest


@pytest.fixture(autouse=True)
def _reset_rate_limiter():
    """slowapi's in-memory limiter storage is process-global; without a reset it leaks hits
    between test functions since the test client always uses the same fake IP."""
    from app.main import limiter

    limiter.reset()
    yield
