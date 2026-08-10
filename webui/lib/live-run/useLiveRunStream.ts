/**
 * useLiveRunStream — React hook that consumes the live-run SSE stream.
 *
 * Opens an EventSource to `GET /api/v1/runs/{run_id}/stream` (the Server's
 * live-run endpoint), parses each event payload, and folds it through the pure
 * `liveRunReducer` (see ./reducer.ts). Owns the EventSource lifecycle and
 * surfaces a coarse connection status for the UI.
 *
 * Returns `{ state, connection }`:
 *   - `state`      — the current `LiveRunState` (run, modules, results, terminal…)
 *   - `connection` — `"connecting" | "open" | "closed"`
 *
 * The server replays current state on (re)connect; the reducer's high-water
 * mark of result ids dedups replayed rows so a reconnect resumes cleanly.
 */
"use client";

import { useEffect, useReducer, useRef, useState } from "react";
import { apiUrl } from "@/lib/api/client";
import {
  type LiveRunEvent,
  type LiveRunState,
} from "./types";
import { initialLiveRunState, liveRunReducer } from "./reducer";

export type LiveRunConnection = "connecting" | "open" | "closed";

export interface UseLiveRunStreamResult {
  state: LiveRunState;
  connection: LiveRunConnection;
}

/**
 * Parse one SSE `data:` payload into a `LiveRunEvent`. The server serialises
 * each event as a JSON object carrying a `type` discriminator. Malformed or
 * unknown payloads are dropped (never crash the stream).
 */
function parseEvent(raw: string): LiveRunEvent | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as LiveRunEvent;
    if (parsed && typeof parsed === "object" && "type" in parsed) {
      return parsed;
    }
  } catch {
    // ignore malformed frames
  }
  return null;
}

export function useLiveRunStream(runId: string): UseLiveRunStreamResult {
  const [state, dispatch] = useReducer(liveRunReducer, undefined, initialLiveRunState);
  const [connection, setConnection] = useState<LiveRunConnection>("connecting");
  const esRef = useRef<EventSource | null>(null);

  useEffect(() => {
    if (!runId) {
      setConnection("closed");
      return;
    }

    setConnection("connecting");
    const es = new EventSource(apiUrl(`/api/v1/runs/${encodeURIComponent(runId)}/stream`));
    esRef.current = es;

    es.onopen = () => setConnection("open");
    es.onerror = () => {
      // EventSource auto-reconnects; surface the transient state to the UI.
      setConnection("closed");
    };

    es.onmessage = (ev) => {
      const event = parseEvent(ev.data);
      if (event) dispatch(event);
    };

    return () => {
      es.close();
      esRef.current = null;
    };
  }, [runId]);

  return { state, connection };
}
