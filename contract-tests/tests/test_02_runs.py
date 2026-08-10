"""Contract: run lifecycle — create, poll, cancel, and mode round-trip.

The long_run / LONG_TERM mapping fix from Phase 5 is locked here:
  POST {"mode":"long_run"} → GET run → mode field MUST be "long_run"
"""
from __future__ import annotations

import time
import pytest
import httpx

VALID_MODES = ("single_shot", "long_run", "monitoring", "event")


def _create_run(http: httpx.Client, mode: str) -> dict:
    r = http.post("/api/v1/runs", json={"mode": mode})
    assert r.status_code in (200, 201), f"create_run({mode}) returned {r.status_code}: {r.text}"
    return r.json()


def _get_run(http: httpx.Client, run_id: str) -> dict:
    r = http.get(f"/api/v1/runs/{run_id}")
    assert r.status_code == 200, f"get_run({run_id}) returned {r.status_code}: {r.text}"
    return r.json()


@pytest.mark.runs
def test_create_run_single_shot(http: httpx.Client) -> None:
    run = _create_run(http, "single_shot")
    assert "id" in run
    assert run.get("mode") == "single_shot", f"Expected mode 'single_shot', got {run.get('mode')!r}"


@pytest.mark.runs
def test_mode_round_trip_long_run(http: httpx.Client) -> None:
    """Phase 5 lock: 'long_run' must survive the REST round-trip unchanged."""
    run = _create_run(http, "long_run")
    run_id = run["id"]
    fetched = _get_run(http, run_id)
    assert fetched.get("mode") == "long_run", (
        f"long_run mode was not preserved! Got: {fetched.get('mode')!r}\n"
        "This regression was fixed in Phase 5 — check normalize_mode() in RunsController.cc"
    )


@pytest.mark.runs
def test_mode_round_trip_monitoring(http: httpx.Client) -> None:
    run = _create_run(http, "monitoring")
    fetched = _get_run(http, run["id"])
    assert fetched.get("mode") == "monitoring"


@pytest.mark.runs
def test_mode_round_trip_event(http: httpx.Client) -> None:
    run = _create_run(http, "event")
    fetched = _get_run(http, run["id"])
    assert fetched.get("mode") == "event"


@pytest.mark.runs
def test_runs_list_includes_created_run(http: httpx.Client) -> None:
    run = _create_run(http, "single_shot")
    r = http.get("/api/v1/runs")
    assert r.status_code == 200
    ids = [r_["id"] for r_ in r.json().get("runs", [])]
    assert run["id"] in ids, f"Created run {run['id']} not found in /runs list"


@pytest.mark.runs
def test_run_results_endpoint(http: httpx.Client) -> None:
    run = _create_run(http, "single_shot")
    run_id = run["id"]
    # Results may be empty for a brand-new run — just verify the endpoint exists
    r = http.get(f"/api/v1/runs/{run_id}/results")
    assert r.status_code == 200
    body = r.json()
    assert "results" in body or isinstance(body, list), f"Unexpected results shape: {body}"


@pytest.mark.runs
def test_invalid_run_id_returns_404(http: httpx.Client) -> None:
    r = http.get("/api/v1/runs/does-not-exist-12345")
    assert r.status_code == 404


@pytest.mark.runs
def test_config_id_flow_round_trip(http: httpx.Client) -> None:
    """The webui always creates a config first and then POSTs a run
    with { config_id, mode }. Lock that contract: a config must be
    creatable, a run referencing it must succeed, and the run's
    `config_id` must be preserved on GET.

    See webui/components/chrome/app-shell.tsx:51-74.
    """
    cfg_payload = {
        "name": "contract-config-id-flow",
        "description": '{"module_id":"contract-cfg","enabled_test_names":[]}',
        "mode": "single_shot",
        "common_config": {"source": "contract-test", "execution_mode": "single_shot"},
        "modules": [
            {
                "module_id": "contract-cfg",
                "config_type_url": "",
                "config": {},
            }
        ],
    }
    cfg_resp = http.post("/api/v1/configs", json=cfg_payload)
    assert cfg_resp.status_code in (200, 201), (
        f"createConfig returned {cfg_resp.status_code}: {cfg_resp.text!r}. "
        "The webui always creates a config first; if this endpoint is "
        "broken, the dashboard's 'start run' flow cannot work end-to-end."
    )
    cfg = cfg_resp.json()
    assert "id" in cfg, f"createConfig response missing 'id': {cfg}"

    run_resp = http.post(
        "/api/v1/runs",
        json={"config_id": cfg["id"], "mode": "single_shot"},
    )
    assert run_resp.status_code in (200, 201), (
        f"createRun with config_id returned {run_resp.status_code}: {run_resp.text!r}. "
        "The webui sends { config_id, mode } — the server must accept that exact shape."
    )
    run = run_resp.json()
    assert "id" in run, f"createRun response missing 'id': {run}"

    # The run's config_id must be preserved. If the server drops it, the
    # dashboard loses the link between a run and the config that drove it.
    fetched = _get_run(http, run["id"])
    assert fetched.get("config_id") == cfg["id"], (
        f"Run's config_id was not preserved. Sent {cfg['id']!r}, "
        f"got {fetched.get('config_id')!r}."
    )
