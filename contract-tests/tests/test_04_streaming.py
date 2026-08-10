"""Contract: SSE live-run stream (Zion-Server /api/v1/runs/:id/stream).

Locks the wire contract the Dashboard's live run view consumes:
  - event names: run.start, module.transition, result, run.complete
  - event order: run.start precedes result precedes run.complete
  - run.complete carries a terminal status
  - a second concurrent viewer on the same run receives the same run.complete
  - a viewer that connects AFTER results have landed sees them replayed
    (reconnect without duplication)

Drive path: the Server exposes a minimal run-control REST surface alongside
the SSE endpoint (POST /api/v1/runs, /start, /results, /complete). These are
the write-side companions to the SSE read endpoint; the full REST API is
Phase 2.

Run against a live Server:
  ARCHES_HTTP_LISTEN=127.0.0.1:8080 ./build/native/bin/zion-server &
  ACADIA_SERVER_URL=http://localhost:8080 \
    ../../../../Zion-Dashboard/contract-tests/.venv/bin/python -m pytest \
    contract-tests/tests/test_04_streaming.py -v -m streaming
"""
from __future__ import annotations

import json
import threading
import time
from typing import Any

import httpx
import pytest


def _create_run(http: httpx.Client, mode: str = "single_shot") -> str:
    r = http.post("/api/v1/runs", json={"mode": mode})
    assert r.status_code in (200, 201), f"POST /runs -> {r.status_code}: {r.text}"
    return r.json()["id"]


def _post(http: httpx.Client, run_id: str, action: str, body: dict[str, Any] | None = None) -> None:
    r = http.post(f"/api/v1/runs/{run_id}/{action}", json=body or {})
    assert r.status_code == 200, f"POST /{action} -> {r.status_code}: {r.text}"


def _collect_stream(server_url: str, run_id: str, deadline_s: float = 10.0) -> list[dict[str, Any]]:
    """Open the SSE stream and collect events until run.complete or deadline."""
    url = f"{server_url}/api/v1/runs/{run_id}/stream"
    events: list[dict[str, Any]] = []
    deadline = time.monotonic() + deadline_s

    def reader() -> None:
        client = httpx.Client(timeout=deadline_s)
        try:
            with client.stream("GET", url) as resp:
                assert resp.status_code == 200, f"GET /stream -> {resp.status_code}"
                event_type: str | None = None
                data_lines: list[str] = []
                for line in resp.iter_lines():
                    if time.monotonic() > deadline:
                        break
                    if line == "":
                        if event_type is not None:
                            payload = "\n".join(data_lines)
                            try:
                                data = json.loads(payload) if payload else {}
                            except json.JSONDecodeError:
                                data = {"_raw": payload}
                            events.append({"event": event_type, "data": data})
                            if event_type == "run.complete":
                                return
                        event_type = None
                        data_lines = []
                        continue
                    if line.startswith("event: "):
                        event_type = line[len("event: "):]
                    elif line.startswith("data: "):
                        data_lines.append(line[len("data: "):])
        finally:
            client.close()

    t = threading.Thread(target=reader, daemon=True)
    t.start()
    t.join(timeout=deadline_s + 2)
    return events


@pytest.mark.streaming
def test_stream_events_in_order(server_url: str, http: httpx.Client) -> None:
    run_id = _create_run(http)
    # Open the viewer before driving so the live run.start is observed.
    collected: list[dict[str, Any]] = []
    done = threading.Event()

    def watcher() -> None:
        collected.extend(_collect_stream(server_url, run_id, deadline_s=10))
        done.set()

    t = threading.Thread(target=watcher, daemon=True)
    t.start()
    time.sleep(0.4)  # let the viewer connect + receive the on-connect replay

    _post(http, run_id, "start")
    _post(http, run_id, "results", {
        "module_id": "cpu", "test_id": "temp", "status": "pass",
        "name": "CPU Temp", "sequence": 1,
    })
    _post(http, run_id, "complete", {"status": "completed"})

    assert done.wait(timeout=12), "viewer never received run.complete"

    names = [e["event"] for e in collected]
    assert "run.start" in names, f"missing run.start in {names}"
    assert "result" in names, f"missing result in {names}"
    assert "run.complete" in names, f"missing run.complete in {names}"
    # Order: last run.start before last result before run.complete.
    assert names.index("run.start") < names.index("result") < names.index("run.complete"), (
        f"events out of order: {names}"
    )
    complete = next(e for e in collected if e["event"] == "run.complete")
    status = (complete["data"].get("run") or {}).get("status") or complete["data"].get("status")
    assert status in ("completed", "failed", "cancelled", "aborted", "rejected"), (
        f"run.complete has non-terminal status: {status!r}"
    )


@pytest.mark.streaming
def test_second_concurrent_viewer_gets_run_complete(server_url: str, http: httpx.Client) -> None:
    run_id = _create_run(http)
    _post(http, run_id, "start")
    _post(http, run_id, "results", {
        "module_id": "mem", "test_id": "size", "status": "pass",
        "name": "Mem Size", "sequence": 1,
    })

    ev1: list[dict[str, Any]] = []
    ev2: list[dict[str, Any]] = []
    done1 = threading.Event()
    done2 = threading.Event()

    def watch(out: list[dict[str, Any]], done: threading.Event) -> None:
        out.extend(_collect_stream(server_url, run_id, deadline_s=10))
        done.set()

    t1 = threading.Thread(target=watch, args=(ev1, done1), daemon=True)
    t2 = threading.Thread(target=watch, args=(ev2, done2), daemon=True)
    t1.start()
    t2.start()
    time.sleep(0.4)

    _post(http, run_id, "complete", {"status": "completed"})

    assert done1.wait(timeout=12), "viewer 1 never received run.complete"
    assert done2.wait(timeout=12), "viewer 2 never received run.complete"
    assert any(e["event"] == "run.complete" for e in ev1), "viewer 1 missing run.complete"
    assert any(e["event"] == "run.complete" for e in ev2), "viewer 2 missing run.complete"


@pytest.mark.streaming
def test_late_viewer_replays_existing_results(server_url: str, http: httpx.Client) -> None:
    run_id = _create_run(http)
    _post(http, run_id, "start")
    _post(http, run_id, "results", {
        "module_id": "cpu", "test_id": "temp", "status": "pass",
        "name": "CPU Temp", "sequence": 1,
    })

    # A late viewer connects after the result has landed.
    events = _collect_stream(server_url, run_id, deadline_s=6)
    names = [e["event"] for e in events]
    # Replay: run.start + at least one result, immediately on connect.
    assert "run.start" in names, f"late viewer did not get run.start replay: {names}"
    assert "result" in names, f"late viewer did not get replayed result: {names}"
    # Exactly one result (the replayed row) — no duplication.
    assert names.count("result") == 1, f"late viewer saw {names.count('result')} result events (expected 1)"


@pytest.mark.streaming
def test_sse_endpoint_404_for_unknown_run(server_url: str, http: httpx.Client) -> None:
    r = http.get("/api/v1/runs/does-not-exist/stream")
    # An EventSource would retry on non-200; the contract is that the server
    # returns 404 for an unknown run rather than an infinite empty stream.
    assert r.status_code == 404, f"expected 404 for unknown run, got {r.status_code}"