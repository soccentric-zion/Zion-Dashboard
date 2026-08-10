---
name: dashboard-architecture
description: Explains the Zion-Dashboard (Zion IV&V Web UI) system architecture, frontend/backend communication protocol, execution-mode lifecycle, and UI layout/design conventions. Use this whenever working on webui/ code — adding a page, a component, an API call, an SSE consumer, or reasoning about how the dashboard fits into the wider IV&V platform (HAL → Client → Server → Web).
--- # Zion-Dashboard architecture & UI conventions This is the Web leaf of a 4-tier IV&V validation platform. Read this before
touching webui/. ## 1. System topology (binding — do not blur these boundaries) ```
HAL (C++, on-target drivers) ↓ C++ HAL API
Client (on-target app) ↓ gRPC + protobuf
Server (Zion-Server, C++ on x86) ↓ REST + SSE (JSON)
Web ← this repo (webui)
``` - The Web UI talks only to Server, over REST + SSE. It never talks to Client or HAL directly.
- One server, one target, one test at a time. Not multi-tenant, not a fleet dashboard. No concurrent runs across modules in v1.
- Source of truth for the actual (verified) Server contract is [docs/WEB_FINDINGS.md](../../docs/WEB_FINDINGS.md) plus the real types in [webui/lib/types/api.ts](../../webui/lib/types/api.ts) and [webui/lib/api/](../../webui/lib/api). [docs/req.md](../../docs/req.md) is the original design prompt (aspirational/binding UI spec) — where it disagrees with WEB_FINDINGS.md or the code, the code wins. Note the code has grown beyond req.md's original four-mode HAL scope (auth, alerts, notifications, schedules, templates, configs, backup endpoints also exist server-side). ## 2. Frontend ↔ backend communication - REST: webui/lib/api/client.ts exposes apiUrl(path) and fetchJson<T>(path, init). Base URL comes from NEXT_PUBLIC_PLATFORM_SERVER (default http://localhost:8080). All request functions live under webui/lib/api/ and are re-exported from webui/lib/api/index.ts. cache: "no-store" is always set — this is a live operator console, never cache stale run state.
- SSE: webui/lib/sse/index.ts exposes openSse(path) (returns a raw EventSource), parseSsePayload<T>(raw), and observeSseStatus(source, cb). Two live streams exist: run events (GET/api/v1/runs/{id}/events) and log tail (GET/api/v1/runs/{run_id}/logs/tail).
- Critical SSE rule: never call source.close from an onerror handler. EventSource auto-reconnects on transient errors; closing on error drops the next batch of events. The effect cleanup owns the source's lifecycle, bound to a stable id (e.g. activeRunId), not to a derived boolean like isRunning.
- Live-run event contract (see [webui/lib/live-run/types.ts](../../webui/lib/live-run/types.ts)): run.start → module.transition (pending/running/done) → result (one per landed test row) → run.complete, plus flow.paused if the client's bounded queue drops events. On reconnect the server replays current state; the client dedups by result id (seenResultIds high-water mark in [webui/lib/live-run/reducer.ts](../../webui/lib/live-run/reducer.ts)).
- Platform identity: webui/lib/platform.ts — PLATFORM_SLUG, PLATFORM_NAME, and the server URL are all env-parameterized (NEXT_PUBLIC_PLATFORM_SLUG/NAME/SERVER). Never hard-code a platform name like "Zion" as an identifier — only as an env default literal. ## 3. Execution modes (the core domain concept) Four canonical mode strings, matching Server's normalize_mode exactly —
ExecutionMode in [webui/lib/types/api.ts](../../webui/lib/types/api.ts): - single_shot — one-off test, pass/fail hero + history table.
- monitoring — live rolling 60s-window chart + data table.
- event — scrolling event table only (no chart).
- long_run — same treatment as monitoring, longer duration. Only one mode is globally active at a time (top-bar segmented control). The
run lifecycle is: pick a module → enable HAL tests → createConfig →
createRun(mode, configId) → subscribe to the run's SSE stream → cancelRun
to stop. See the runMutation in
[webui/components/chrome/app-shell.tsx](../../webui/components/chrome/app-shell.tsx)
for the canonical start/stop flow, including the "orphan config" error path
(if createRun fails after createConfig succeeds, there is no delete-config
API — invalidate the configs query and surface the orphan id to the operator). ## 4. UI layout & design system (binding — see docs/req.md §3 for full detail) - Chrome: four-region layout — frosted top bar, frosted collapsible sidebar, main content, all wrapped by AppShell ([webui/components/chrome/app-shell.tsx](../../webui/components/chrome/app-shell.tsx)). - Top bar: mode segmented control (left) + Start/Stop button + elapsed timer + connection indicator (right). - Sidebar: top region = modules grouped by category (server-driven), bottom region = Settings. Collapsible to icon-only rail; width persists. - Lockout while running: mode switcher, sidebar nav, and the active module's config controls all disable; only Stop stays interactive.
- Module page: header strip (name, status, metadata) → two-column body (config panel ~340px left, live/results right) → Previous Runs list below the fold. Only the config section matching the active global mode is enabled; the other three are visible but grayed out.
- Visual language: iOS-inspired desktop density (Linear/ Things 3/ macOS System Settings references). Rounded 12–14px cards, pill buttons, iOS switches (not checkboxes), iOS segmented control for mode, hairline separators, backdrop-blur on top bar/sidebar only. Inter font. Light + dark mode both first-class (follow OS by default, override in Settings). Color signals: blue = primary, green = go/healthy/start, red = stop/error, orange/amber = warn.
- Honest UI, always: no fake "Reconnecting…" theater, no mocked/stale data shown as live, no invented endpoints. Offline state is a single calm panel with a manual Retry — never an animated spinner pretending to reconnect.
- Settings: own sidebar entry, sub-tab strip (General/ OTA-Host/ OTA-Device). General is iOS Settings-style grouped rounded sections (Connection, System, Preferences, Operator).
- Tech: Tailwind for styling; shadcn/ui primitives only as unstyled plumbing (Dialog, DropdownMenu, Tabs, Tooltip, Switch) — the look itself is hand-rolled, never "stock shadcn". TanStack Query for all REST server state. TanStack Table for all data tables (virtualize > 200 rows). A single chart library for rolling-window (live) and historical (pan/zoom) charts. ## 5. Repo layout cheatsheet - webui/components/chrome/ — top bar, sidebar, mode switcher, start/stop, connection indicator.
- webui/components/module-page/ — module workspace, config panels, result blocks.
- webui/components/settings/ — settings tabs, grouped rows, OTA stepper/log panel.
- webui/lib/api/ — typed REST client + per-endpoint functions.
- webui/lib/sse/ — SSE wrapper (openSse, parseSsePayload, observeSseStatus).
- webui/lib/live-run/ — SSE event types + reducer that builds LiveRunState.
- webui/lib/modules/ — HAL-derived module/test catalog (hal-derived-catalog.ts), used to render the sidebar and config sections without hard-coding modules.
- webui/lib/types/api.ts — hand-written TypeScript types mirroring Server DTOs; keep in sync with [docs/WEB_FINDINGS.md](../../docs/WEB_FINDINGS.md) when the Server contract changes.
- webui/state/app-shell-context.tsx — global mode/ running/ sidebar-collapsed/ active-run state, split into stable-actions vs state slices to limit re-renders. ## 6. Validation gate before considering webui changes done ```
cd webui && npx tsc --noEmit && npm test -- --run && npm run lint
```
then make build from the repo root (delegates into webui). There is no
npm run type-check or bare npm test script — use the commands above
exactly. Contract-level backend/frontend agreement is checked by
contract-tests/ (pytest, requires a live Server — see
[contract-tests/tests](../../contract-tests/tests)), notably the
long_run mode round-trip lock test.
