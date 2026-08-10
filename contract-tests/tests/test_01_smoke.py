"""Contract: health, target info, and module listing."""
from __future__ import annotations

import pytest
import httpx


@pytest.mark.smoke
def test_health_ok(http: httpx.Client) -> None:
    r = http.get("/api/v1/health")
    assert r.status_code == 200
    body = r.json()
    assert "status" in body, f"Missing 'status' in health response: {body}"


@pytest.mark.smoke
def test_modules_list_shape(http: httpx.Client) -> None:
    r = http.get("/api/v1/modules")
    assert r.status_code == 200
    body = r.json()
    assert "modules" in body, f"Missing 'modules' key: {body}"
    modules = body["modules"]
    assert isinstance(modules, list)
    if modules:
        m = modules[0]
        assert "id" in m, f"Module missing 'id': {m}"
        assert "display_name" in m or "name" in m, f"Module missing name: {m}"


@pytest.mark.smoke
def test_module_detail(http: httpx.Client) -> None:
    r = http.get("/api/v1/modules")
    assert r.status_code == 200
    modules = r.json().get("modules", [])
    if not modules:
        pytest.skip("No modules registered — cannot test module detail endpoint")
    mid = modules[0]["id"]
    r2 = http.get(f"/api/v1/modules/{mid}")
    assert r2.status_code == 200
    assert r2.json().get("id") == mid
