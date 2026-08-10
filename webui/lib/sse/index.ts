import { apiUrl } from "@/lib/api/client";

/**
 * Open an SSE stream to a relative path on the platform server.
 *
 * The returned EventSource has its default browser auto-reconnect behaviour
 * preserved. Consumers should NOT attach an onerror that calls close() —
 * that defeats the reconnect. The provided `setSseStatus` hook below is the
 * opt-in way to surface connection state to the UI.
 */
export function openSse(path: string): EventSource {
  const source = new EventSource(apiUrl(path));

  // Dev-mode observability: surface a warning when the browser reports an
  // error event so a 401/403/network-unreachable shows up in the console
  // instead of vanishing. EventSource.readyState is the only signal the
  // browser exposes; 0=connecting, 1=open, 2=closed.
  if (process.env.NODE_ENV !== "production") {
    source.addEventListener("error", () => {
      console.warn(`[sse] error on ${path} (readyState=${source.readyState})`);
    });
  }

  return source;
}

export function parseSsePayload<T>(raw: string): T | null {
  try {
    return JSON.parse(raw) as T;
  } catch (err) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[sse] failed to parse payload", { raw, err });
    }
    return null;
  }
}

/**
 * Attach a status observer to an EventSource. The observer receives
 * "connecting" | "open" | "closed" updates whenever the source's
 * readyState changes. Use this to surface reconnect state in the UI.
 */
export function observeSseStatus(
  source: EventSource,
  onStatus: (status: "connecting" | "open" | "closed") => void,
): () => void {
  const stateName = (s: number): "connecting" | "open" | "closed" =>
    s === 0 ? "connecting" : s === 1 ? "open" : "closed";

  onStatus(stateName(source.readyState));

  const onOpen = () => onStatus("open");
  const onError = () => onStatus(stateName(source.readyState));

  source.addEventListener("open", onOpen);
  source.addEventListener("error", onError);

  return () => {
    source.removeEventListener("open", onOpen);
    source.removeEventListener("error", onError);
  };
}
