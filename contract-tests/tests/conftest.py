"""Shared fixtures for the Zion Server contract tests.

These tests run against a live Server (bring your own — the `make up` stack is
the natural target).

Environment:
  ACADIA_SERVER_URL  — base URL of the Server HTTP API  (default: http://localhost:8080)
"""
from __future__ import annotations

import os
import pytest
import httpx


@pytest.fixture(scope="session")
def server_url() -> str:
    url = os.environ.get("ACADIA_SERVER_URL", "http://localhost:8080")
    return url.rstrip("/")


@pytest.fixture(scope="session")
def http(server_url: str) -> httpx.Client:
    """Shared httpx client for the session."""
    with httpx.Client(base_url=server_url, timeout=10.0) as client:
        yield client
