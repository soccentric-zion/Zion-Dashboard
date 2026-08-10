/**
 * Pure reducer for the live-run SSE stream. Kept side-effect-free so the dedup
 * (high-water mark of result ids) and terminal-state logic are unit-testable in
 * Node without a browser EventSource. The React hook (useLiveRunStream) wraps
 * this reducer and owns the EventSource lifecycle + reconnect behaviour.
 */
import {
  type LiveRunEvent,
  type LiveRunState,
  type LiveResult,
  type ModuleState,
  isTerminalRunStatus,
} from "./types";

export function initialLiveRunState(): LiveRunState {
  return {
    run: null,
    modules: {},
    moduleOrder: [],
    results: [],
    seenResultIds: new Set<string>(),
    terminal: false,
    terminalStatus: null,
    flowPaused: false,
    lastEventSeq: 0,
  };
}

/**
 * Apply one parsed SSE event to the state. Returns a NEW state object (the
 * `seenResultIds` Set is copied-on-write so React state updates are detected).
 * Duplicate `result` events (id already in the high-water set) are dropped.
 */
export function liveRunReducer(
  state: LiveRunState,
  event: LiveRunEvent,
): LiveRunState {
  switch (event.type) {
    case "run.start": {
      // run.start may arrive twice on reconnect (replay + live). The latest
      // always wins; modules merge (replay modules + later transitions).
      const modules = { ...state.modules };
      const moduleOrder = [...state.moduleOrder];
      for (const m of event.modules) {
        if (!(m in modules)) {
          modules[m] = "pending";
          moduleOrder.push(m);
        }
      }
      return {
        ...state,
        run: event.run,
        modules,
        moduleOrder,
        // A run.start with a terminal status (replay of a finished run) is
        // treated as terminal — the live view will have rendered the banner.
        terminal:
          state.terminal || isTerminalRunStatus(event.run?.status),
        terminalStatus:
          state.terminalStatus ??
          (isTerminalRunStatus(event.run?.status) ? event.run.status : null),
      };
    }

    case "module.transition": {
      if (state.terminal) return state;
      const modules = { ...state.modules };
      const moduleOrder = [...state.moduleOrder];
      if (!(event.module_id in modules)) {
        moduleOrder.push(event.module_id);
      }
      const next: ModuleState = event.state;
      // Don't regress from "done" back to "running" (a late transition after
      // completion would be confusing); allow pending->running->done only.
      const current = modules[event.module_id];
      if (current === "done" && next !== "done") {
        return state;
      }
      modules[event.module_id] = next;
      return { ...state, modules, moduleOrder };
    }

    case "result": {
      // Dedup by result id (high-water mark). A reconnect replays already-landed
      // rows; drop them so the list doesn't duplicate.
      if (state.seenResultIds.has(event.id)) {
        return state;
      }
      const result: LiveResult = {
        id: event.id,
        run_id: event.run_id,
        module_id: event.module_id,
        module_version: event.module_version,
        test_id: event.test_id,
        name: event.name,
        sequence: event.sequence,
        timestamp: event.timestamp,
        duration_ns: event.duration_ns,
        status: event.status,
        severity: event.severity,
        mode: event.mode,
        error_message: event.error_message,
        reason: event.reason,
        metrics: event.metrics,
        monitoring: event.monitoring,
        event: event.event,
        parent_id: event.parent_id,
      };
      const seen = new Set(state.seenResultIds);
      seen.add(event.id);
      // Newest first (the live list reads top-down).
      const results = [result, ...state.results];
      const modules = { ...state.modules };
      const moduleOrder = [...state.moduleOrder];
      if (!(event.module_id in modules)) {
        modules[event.module_id] = "running";
        moduleOrder.push(event.module_id);
      }
      return {
        ...state,
        results,
        seenResultIds: seen,
        modules,
        moduleOrder,
        lastEventSeq: Math.max(state.lastEventSeq, event.sequence),
      };
    }

    case "run.complete": {
      // Terminal: once terminal, further events are ignored (the hook closes
      // the EventSource). The terminal status from the event wins.
      return {
        ...state,
        run: event.run,
        terminal: true,
        terminalStatus: event.run?.status ?? state.terminalStatus,
        flowPaused: false,
      };
    }

    case "flow.paused": {
      // The server dropped an event from this viewer's bounded queue under
      // backpressure. Surface it; the next non-duplicate event clears it.
      return { ...state, flowPaused: true };
    }

    default: {
      return state;
    }
  }
}

/** Running pass/fail tally from the accumulated results. */
export function tallyResults(results: LiveResult[]): {
  total: number;
  passed: number;
  failed: number;
} {
  let passed = 0;
  let failed = 0;
  for (const r of results) {
    const s = r.status.toLowerCase();
    if (s.includes("pass")) ++passed;
    else if (s.includes("fail") || s.includes("error") || s.includes("abort") || s.includes("timeout")) ++failed;
  }
  return { total: results.length, passed, failed };
}