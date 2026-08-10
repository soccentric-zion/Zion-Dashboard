"""Contract: settings/retention endpoints.

The webui (webui/lib/types/api.ts:119-122) reads `retention_days` and
`max_run_results` and the settings page PUTs the same keys. This test
locks those exact names so a server-side rename or field replacement
breaks the contract rather than silently breaking the dashboard.
"""
from __future__ import annotations

import pytest
import httpx


@pytest.mark.settings
def test_get_retention_settings(http: httpx.Client) -> None:
    r = http.get("/api/v1/settings/retention")
    assert r.status_code == 200
    body = r.json()
    # The webui reads these exact keys — anything else means a server
    # rename that the dashboard will not survive.
    assert "retention_days" in body, f"Missing 'retention_days': {body}"
    assert "max_run_results" in body, f"Missing 'max_run_results': {body}"
    assert isinstance(body["retention_days"], int), f"'retention_days' must be int, got {type(body['retention_days']).__name__}"
    assert isinstance(body["max_run_results"], int), f"'max_run_results' must be int, got {type(body['max_run_results']).__name__}"
    assert body["retention_days"] >= 1, f"'retention_days' must be >= 1, got {body['retention_days']}"
    assert body["max_run_results"] >= 1, f"'max_run_results' must be >= 1, got {body['max_run_results']}"


@pytest.mark.settings
def test_put_retention_settings_round_trip(http: httpx.Client) -> None:
    """PUT should accept the same keys and the response must echo them."""
    original = http.get("/api/v1/settings/retention").json()
    # Round-trip with a known safe value; restore the original after.
    safe_retention = max(1, int(original["retention_days"]))
    safe_max_results = max(1, int(original["max_run_results"]))
    try:
        r = http.put(
            "/api/v1/settings/retention",
            json={"retention_days": safe_retention, "max_run_results": safe_max_results},
        )
        assert r.status_code in (200, 204), f"PUT failed: {r.status_code} {r.text}"
        # A 200 response body should echo the keys back; a 204 has no body.
        if r.status_code == 200:
            echoed = r.json()
            assert echoed.get("retention_days") == safe_retention
            assert echoed.get("max_run_results") == safe_max_results
    finally:
        # Restore original values — don't leave the contract test's noise
        # in the server's state.
        http.put(
            "/api/v1/settings/retention",
            json={"retention_days": original["retention_days"], "max_run_results": original["max_run_results"]},
        )


@pytest.mark.settings
def test_get_configs_list(http: httpx.Client) -> None:
    r = http.get("/api/v1/configs")
    assert r.status_code == 200
    body = r.json()
    assert "configs" in body or isinstance(body, list), f"Unexpected configs shape: {body}"