/**
 * Live-run SSE event contract — mirrors Zion-Server's
 * `GET /api/v1/runs/{run_id}/stream` event payloads (see
 * Zion-Server/src/http/HttpServer.cc + services/RunService.cc).
 *
 * The server serialises run/result rows with the minimal util::ResultConvert
 * JSON serializer (no JsonCpp). Field shapes:
 *   - `run.start`      : { run: Run, modules: string[] }
 *   - `module.transition` : { module_id, state: "running" | "done" }
 *   - `result`         : a result row (see LiveResult)
 *   - `run.complete`    : { run: Run, total: number }
 *   - `flow.paused`    : "{}" (the viewer's bounded queue dropped an event)
 *
 * On (re)connect the server replays current state: one run.start + a result
 * event per already-landed top-level row. The client dedups result events by
 * id (high-water mark) so a reconnect resumes without duplication.
 */

export type RunStatus =
  | "queued"
  | "running"
  | "paused"
  | "completed"
  | "failed"
  | "cancelled"
  | "rejected"
  | "unspecified"
  | string;

export interface LiveRun {
  id: string;
  name: string;
  mode: string;
  status: RunStatus;
  board_id: string | null;
  started_at: string | null;
  ended_at: string | null;
  created_at: string | null;
  error_message: string;
}

export interface LiveResult {
  id: string;
  run_id: string;
  module_id: string;
  module_version: string;
  test_id: string;
  name: string;
  sequence: number;
  timestamp: string | null;
  duration_ns: number;
  status: string; // uppercase: PASS | FAIL | ERROR | TIMEOUT | ABORTED | SKIPPED
  severity: string;
  mode: string;
  error_message: string;
  reason: Record<string, unknown>;
  metrics: Record<string, unknown>;
  monitoring: Record<string, unknown>;
  event: Record<string, unknown>;
  parent_id: string | null;
}

export interface RunStartEvent {
  type: "run.start";
  run: LiveRun;
  modules: string[];
}

export interface ModuleTransitionEvent {
  type: "module.transition";
  module_id: string;
  state: "pending" | "running" | "done";
}

export type ResultEvent = {
  type: "result";
  // All LiveResult fields are spread at the top level of the payload.
} & LiveResult;

export interface RunCompleteEvent {
  type: "run.complete";
  run: LiveRun;
  total: number;
}

export interface FlowPausedEvent {
  type: "flow.paused";
}

export type LiveRunEvent =
  | RunStartEvent
  | ModuleTransitionEvent
  | ResultEvent
  | RunCompleteEvent
  | FlowPausedEvent;

export type ModuleState = "pending" | "running" | "done";

export interface LiveRunState {
  run: LiveRun | null;
  modules: Record<string, ModuleState>;
  moduleOrder: string[];
  results: LiveResult[];
  /** High-water mark of result ids — a reconnect replays already-seen rows,
   *  which the reducer drops to avoid duplication. */
  seenResultIds: Set<string>;
  terminal: boolean;
  terminalStatus: RunStatus | null;
  flowPaused: boolean;
  lastEventSeq: number;
}

export const TERMINAL_RUN_STATUSES: ReadonlySet<string> = new Set([
  "completed",
  "failed",
  "cancelled",
  "rejected",
]);

export function isTerminalRunStatus(status: string | null | undefined): boolean {
  if (!status) return false;
  return TERMINAL_RUN_STATUSES.has(status.toLowerCase());
}