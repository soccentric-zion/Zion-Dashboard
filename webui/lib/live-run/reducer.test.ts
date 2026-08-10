import { describe, it, expect } from "vitest";
import { initialLiveRunState, liveRunReducer, tallyResults } from "./reducer";
import type { LiveRunEvent, LiveResult } from "./types";

function result(partial: Partial<LiveResult> & { id: string }): LiveResult {
  return {
    id: partial.id,
    run_id: partial.run_id ?? "run-1",
    module_id: partial.module_id ?? "cpu",
    module_version: partial.module_version ?? "1.0.0",
    test_id: partial.test_id ?? "temp",
    name: partial.name ?? "CPU Temp",
    sequence: partial.sequence ?? 1,
    timestamp: partial.timestamp ?? "2026-07-28T12:00:00Z",
    duration_ns: partial.duration_ns ?? 2_000_000,
    status: partial.status ?? "PASS",
    severity: partial.severity ?? "INFO",
    mode: partial.mode ?? "single_shot",
    error_message: partial.error_message ?? "",
    reason: partial.reason ?? {},
    metrics: partial.metrics ?? {},
    monitoring: partial.monitoring ?? {},
    event: partial.event ?? {},
    parent_id: partial.parent_id ?? null,
  };
}

const runStart = (status = "running", modules = ["cpu"]): LiveRunEvent => ({
  type: "run.start",
  run: {
    id: "run-1", name: "Run", mode: "single_shot", status,
    board_id: "board-1", started_at: "2026-07-28T12:00:00Z",
    ended_at: null, created_at: "2026-07-28T12:00:00Z", error_message: "",
  },
  modules,
});

const runComplete = (status: string): LiveRunEvent => ({
  type: "run.complete",
  run: {
    id: "run-1", name: "Run", mode: "single_shot", status,
    board_id: "board-1", started_at: "2026-07-28T12:00:00Z",
    ended_at: "2026-07-28T12:00:05Z", created_at: "2026-07-28T12:00:00Z", error_message: "",
  },
  total: 1,
});

describe("liveRunReducer — run.start", () => {
  it("seeds run + modules in pending state", () => {
    const s = liveRunReducer(initialLiveRunState(), runStart("running", ["cpu", "mem"]));
    expect(s.run?.id).toBe("run-1");
    expect(s.moduleOrder).toEqual(["cpu", "mem"]);
    expect(s.modules.cpu).toBe("pending");
    expect(s.terminal).toBe(false);
  });

  it("treats a replayed terminal run.start as terminal", () => {
    const s = liveRunReducer(initialLiveRunState(), runStart("completed", []));
    expect(s.terminal).toBe(true);
    expect(s.terminalStatus).toBe("completed");
  });

  it("merges modules on a second run.start (reconnect) without duplicating", () => {
    let s = liveRunReducer(initialLiveRunState(), runStart("running", ["cpu"]));
    s = liveRunReducer(s, runStart("running", ["cpu", "mem"]));
    expect(s.moduleOrder).toEqual(["cpu", "mem"]);
  });
});

describe("liveRunReducer — module.transition", () => {
  it("advances pending -> running -> done", () => {
    let s = liveRunReducer(initialLiveRunState(), runStart("running", ["cpu"]));
    s = liveRunReducer(s, { type: "module.transition", module_id: "cpu", state: "running" });
    expect(s.modules.cpu).toBe("running");
    s = liveRunReducer(s, { type: "module.transition", module_id: "cpu", state: "done" });
    expect(s.modules.cpu).toBe("done");
  });

  it("does not regress from done back to running", () => {
    let s = liveRunReducer(initialLiveRunState(), runStart("running", ["cpu"]));
    s = liveRunReducer(s, { type: "module.transition", module_id: "cpu", state: "done" });
    s = liveRunReducer(s, { type: "module.transition", module_id: "cpu", state: "running" });
    expect(s.modules.cpu).toBe("done");
  });

  it("ignores transitions after terminal", () => {
    let s = liveRunReducer(initialLiveRunState(), runStart("running", ["cpu"]));
    s = liveRunReducer(s, runComplete("completed"));
    s = liveRunReducer(s, { type: "module.transition", module_id: "cpu", state: "done" });
    expect(s.modules.cpu).toBe("pending");
  });
});

describe("liveRunReducer — result dedup (high-water mark)", () => {
  it("appends a new result and records its id", () => {
    let s = liveRunReducer(initialLiveRunState(), runStart("running", ["cpu"]));
    s = liveRunReducer(s, { type: "result", ...result({ id: "r1", sequence: 1 }) });
    expect(s.results).toHaveLength(1);
    expect(s.results[0].id).toBe("r1");
    expect(s.seenResultIds.has("r1")).toBe(true);
  });

  it("drops a duplicate result id (reconnect replay)", () => {
    let s = liveRunReducer(initialLiveRunState(), runStart("running", ["cpu"]));
    s = liveRunReducer(s, { type: "result", ...result({ id: "r1", sequence: 1 }) });
    // Reconnect: run.start replay + the same result row again.
    s = liveRunReducer(s, runStart("running", ["cpu"]));
    s = liveRunReducer(s, { type: "result", ...result({ id: "r1", sequence: 1 }) });
    expect(s.results).toHaveLength(1);
    expect(s.seenResultIds.size).toBe(1);
  });

  it("keeps results with distinct ids", () => {
    let s = liveRunReducer(initialLiveRunState(), runStart("running", ["cpu"]));
    s = liveRunReducer(s, { type: "result", ...result({ id: "r1", sequence: 1 }) });
    s = liveRunReducer(s, { type: "result", ...result({ id: "r2", sequence: 2 }) });
    expect(s.results.map((r) => r.id)).toEqual(["r2", "r1"]);
  });

  it("auto-creates a module as running when a new module's result arrives", () => {
    let s = liveRunReducer(initialLiveRunState(), runStart("running", ["cpu"]));
    s = liveRunReducer(s, { type: "result", ...result({ id: "r1", module_id: "mem" }) });
    expect(s.modules.mem).toBe("running");
    expect(s.moduleOrder).toContain("mem");
  });
});

describe("liveRunReducer — run.complete (terminal)", () => {
  it("marks terminal and records the terminal status", () => {
    let s = liveRunReducer(initialLiveRunState(), runStart("running", ["cpu"]));
    s = liveRunReducer(s, runComplete("failed"));
    expect(s.terminal).toBe(true);
    expect(s.terminalStatus).toBe("failed");
  });

  it("clears flowPaused on terminal", () => {
    let s = liveRunReducer(initialLiveRunState(), runStart("running", []));
    s = liveRunReducer(s, { type: "flow.paused" });
    expect(s.flowPaused).toBe(true);
    s = liveRunReducer(s, runComplete("completed"));
    expect(s.flowPaused).toBe(false);
  });
});

describe("liveRunReducer — flow.paused", () => {
  it("sets flowPaused and does not touch results", () => {
    let s = liveRunReducer(initialLiveRunState(), runStart("running", ["cpu"]));
    s = liveRunReducer(s, { type: "result", ...result({ id: "r1" }) });
    s = liveRunReducer(s, { type: "flow.paused" });
    expect(s.flowPaused).toBe(true);
    expect(s.results).toHaveLength(1);
  });
});

describe("tallyResults", () => {
  it("counts pass vs fail/error/abort/timeout", () => {
    const rs = [
      result({ id: "1", status: "PASS" }),
      result({ id: "2", status: "FAIL" }),
      result({ id: "3", status: "ERROR" }),
      result({ id: "4", status: "TIMEOUT" }),
      result({ id: "5", status: "SKIPPED" }),
    ];
    expect(tallyResults(rs)).toEqual({ total: 5, passed: 1, failed: 3 });
  });
});