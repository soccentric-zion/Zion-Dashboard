# Agent Prompt — Generate the IV&V Web UI **You are an expert frontend engineer specializing in Next.js, TypeScript, and design-led desktop web applications.** Your task is to build the operator console for the SiliconCentric IV&V platform — a single-page Next.js application. You have direct filesystem access to the real HAL, Client, and Server repositories. Do not invent APIs, data shapes, peripheral types, or RPC names — **discover them from the actual code.** Where this prompt and the real code disagree, the real code wins; flag the disagreement in your notes. --- ## 0. Context The IV&V platform validates SiliconCentric embedded hardware across six platforms. Its four components: - **HAL** — platform-dependent C++ codebase (drivers + user-space services) executing hardware-level tests. Reached by Client via a C++ HAL API.
- **Client** — application running on the target; talks to HAL southbound and to Server northbound (gRPC + protobuf).
- **Server** — C++ app on x86; orchestrates tests, persists evidence, exposes a REST API + SSE streams to the Web UI.
- **Web** — this product. Next.js operator console. Talks to Server only. **The Web UI's job:** let an engineer configure, run, and watch tests on a single connected target. It is **not** a multi-tenant tool, not a dashboard for many devices at once, not an audit/analytics tool. One server, one target, one test at a time. --- ## 1. Repositories you have access to The user will provide paths. Confirm them before starting: - **HAL** — Zion-HAL
- **Client** — Zion-Client
- **Server** — Zion-Server You read all three but you only build *against* Server's API. HAL and Client are read for context — to understand what peripherals exist, what data they produce, what test modes mean, what units and semantics belong on which fields. --- ## 2. Phase 1 — Review before writing anything **Do not generate UI code yet.** First, read the repos and produce a written findings report. ### 2.1 Server API (the thing you actually integrate with)
- Find every REST endpoint Server exposes. List path, method, request shape, response shape.
- Find every SSE stream and document what events flow over each.
- Identify: how the UI discovers peripherals, how it starts/stops tests in each mode, how it fetches one-shot history, how it fetches previous monitoring/long-running runs and their captured data, how it streams live samples and events, how it sends OTA images, how it queries connection/system status.
- Map every UI screen described in this prompt to the Server endpoints it'll consume. ### 2.2 Server data shapes
- For every response and SSE payload involved in the UI, document the exact field names, types, and units.
- These become the TypeScript types in the UI. No guessing. ### 2.3 Client (read for context)
- Confirm Server↔Client protocol and the test-mode lifecycle (configure → start → stream/result → stop). The UI mirrors this state machine on the screen. ### 2.4 HAL (read for context)
- Enumerate peripheral types and the meaning/units of their sample fields. The UI uses these for axis labels, table columns, tooltips, and docs. ### 2.5 Deliver `WEB_FINDINGS.md`
- Complete REST + SSE inventory.
- Peripheral and sample-field inventory with units.
- Test-mode lifecycle.
- Open questions and prompt-vs-reality discrepancies. **Stop here. Wait for user confirmation before Phase 2.** --- ## 3. Product specification (binding — built from extensive design discussion) ### 3.1 Scope and constraints
- **Single page app.** Next.js (App Router), TypeScript, Tailwind. One workspace, no marketing pages.
- **One test at a time.** No concurrent tests across modules. No background runs while navigating.
- **Honest UI.** If the server isn't reachable, show "Offline" — no fake spinners, no fake "reconnecting" theater, no stale data presented as live.
- **Data-dense desktop application.** This is not a mobile-first app. Design for ≥1280px primarily. ### 3.2 Visual direction — iOS-inspired desktop
- **Style references:** Linear, Things 3 for Mac, macOS Sequoia System Settings. iOS visual vocabulary at desktop information density.
- **Rounded surfaces** — cards 12–14px radius, pill buttons, rounded inputs.
- **Soft elevation** — subtle shadows, faint borders. Not Material-heavy, not flat.
- **Frosted/blurred top bar and sidebar** — content scrolls under them with backdrop blur (~14px) + saturation.
- **Spacious but dense** — generous padding around groups, tight inside data tables and charts. Never cramped, never bloated.
- **System font feel** — Inter as the web font.
- **iOS segmented control** for the mode switcher in the top bar — pill-shaped, with a sliding active indicator behind the buttons.
- **iOS switches** (toggles) for boolean settings, not checkboxes.
- **iOS Settings-style grouped rows** on the Settings → General page — rounded sections, chevrons on rows, hairline separators.
- **Color signals (light + dark):** - Primary action: blue - Go/ healthy/ Start: green - Stop/ error/ fatal: red - Warn: orange/amber - Neutral: grays
- **Light AND dark mode** — follow OS by default, manual override in Settings. Both must be polished — genuine dark (near-black surfaces with subtle elevation), not gray. Every chart, table, indicator, and color signal must work in both.
- **Subtle motion** — gentle springs on transitions, scale-on-press on buttons, no harsh animations. ### 3.3 Overall layout
A four-region chrome wraps every page: ```
┌─────────────────────────────────────────────────────────────────────┐
│ TOP BAR (frosted) │
│ [logo] [Mode segmented control] [Start ● Running · 0:32] │
│ [○ Online]
├──────────┬──────────────────────────────────────────────────────────┤
│ SIDEBAR │ │
│ (frosted)│ │
│ │ │
│ TOP │ MAIN CONTENT AREA │
│ modules │ (the active page) │
│ │ │
│ ─────────│ │
│ BOTTOM │ │
│ settings│ │
│ │ │
└──────────┴──────────────────────────────────────────────────────────┘
``` ### 3.4 Top bar (binding)
- **Left:** brand/logo + a thin separator + the **Mode segmented control** with four pills: `One-shot | Monitoring | Event | Long-run`. Active pill is highlighted with a sliding pill background.
- **Right:** single toggling **Start/Stop button** + live status. Idle = "Start" (green). Running = "Stop" (red) with a small pulsing indicator dot and an elapsed-time counter (e.g., `Stop ● Running · 00:32`). Far right corner: **connection indicator** (`● Online` or `● Offline` in muted gray). Offline never animates. There is no "Reconnecting…" state.
- **Lockout rules while a test is running:** - Mode switcher is disabled. - Sidebar navigation is disabled. - The active module's config controls are disabled. - Only Stop is interactive. ### 3.5 Sidebar (binding)
- **Two regions, top and bottom, visually separated.**
- **Top region — Modules.** Modules grouped by category (Compute/ Storage/ Network/ Sensors/ Buses/ System — exact group set is server-driven, taken from the Server API). Each group is a collapsible header. Each module row has an **SVG icon + text label**. Active module is highlighted.
- **Bottom region — Settings.** A single "Settings" entry with an SVG icon + label.
- **Collapsible sidebar** — full width by default; toggle button collapses to **icons-only** (no text, no hover-flyout). Width persists across reloads. ### 3.6 Module pages (binding)
When the user clicks a module in the sidebar, that module's dedicated page opens. Layout, top to bottom: **Module header strip**
- Module name (large)
- Status line (e.g., `Idle · Last run 14:32 · Passed`/ `Running in Monitoring · 1 kHz · 00:18`)
- Key metadata strip: peripheral ID, firmware version, capability set — always visible **Body — two-column layout** ```
┌──────────────────┬───────────────────────────────────────────┐
│ CONFIG (left) │ LIVE/ RESULTS (right, wider) │
│ ~340px wide │ │
│ │ - Live chart while running (mon/longrun) │
│ 4 sections: │ - Current-run result block │
│ - One-shot ← │ (mode-appropriate; see 3.7) │
│ - Monitoring │ - Current-run data table │
│ - Event │ │
│ - Long-running │ │
│ │ │
│ Only one section│ │
│ is enabled, │ │
│ matching the │ │
│ global mode in │ │
│ the top bar. │ │
│ Others are │ │
│ visibly grayed. │ │
└──────────────────┴───────────────────────────────────────────┘ PREVIOUS RUNS (below the fold) - List of past runs for this module - Click a row to load it into a historical chart - For mon/longrun, the chart switches from live rolling-window to full-history pan/zoom on load
``` ### 3.7 Mode-specific result presentation (binding)
Each mode has a different result shape in the right column: - **One-shot** — big pass/fail hero (large ✓ or ✗ with color) showing the **most recent** run's result, timestamp, duration, returned value. Below it, a **history table** of previous one-shot runs (server-persisted; loaded on page mount; appended in real time as new runs complete). Columns: timestamp, result, value, duration. Sortable, latest at top.
- **Monitoring** — **live rolling-window chart** (fixed 60-second window; older data scrolls off the left; right edge anchored to "now") for the current run. **Data table** below the chart showing every sample row with all returned fields plus environmental data when present. On stop or page return, the chart and data are persisted server-side and surface in the Previous Runs list below.
- **Event-based** — **scrolling table only**, newest at top. Columns: timestamp, event type, severity (color-coded), payload (expandable). No timeline visualization, no severity lanes, no chart.
- **Long-running** — same treatment as monitoring (live rolling-window chart + data table + persistence + Previous Runs). ### 3.8 Configuration UI (binding)
- The left config column shows **all four mode-config sections at once**, but **only the section matching the current global mode is enabled**. The other three are visually grayed and not interactive. This makes the relationship explicit: the user always sees what config exists, but can only change the active one.
- Field shapes come from the Server API — discovered in Phase 1, typed in TypeScript, rendered with sensible component choices (iOS switches for booleans, number steppers for integers, dropdowns for enums, etc.).
- Config controls are also disabled while a test is running (the lockout rules in 3.4). ### 3.9 Previous Runs (binding)
- Server-persisted across sessions.
- Same module page; lives **below** the two-column body.
- Row click loads the run into the right column as a **historical view** (chart in full-history pan/zoom mode for time-series modes; static table for one-shot/event).
- Distinct visual treatment between "you're viewing live" and "you're viewing a past run" (e.g., a clear "Reviewing run from 14:32" banner above the chart with a "Return to live" button).
- Listing supports infinite scroll or pagination — match the Server API's listing capabilities. ### 3.10 Logs page (binding)
- A **dedicated page** reached from the sidebar (top region, listed alongside or just below the modules — exact placement is your call but it must be a sidebar entry, not a drawer).
- Streams syslog, kernel log, and any other system-level log streams Server exposes.
- **Live tail by default** — newest at bottom (terminal-style) or newest at top — pick newest-at-bottom with auto-scroll, with a "Pause auto-scroll" toggle.
- Filter bar: by source (syslog/kernel/etc), by severity, by free-text search.
- Color coding by severity.
- The data is captured server-side continuously; the UI subscribes to live tail when on the page and unsubscribes when navigating away. ### 3.11 Settings (binding)
- Settings is **its own area** reached from the sidebar bottom region.
- Settings has **its own sub-navigation** at the top of the settings area — a horizontal tab strip with three tabs: - **General** (scrollable) - **OTA — Host** - **OTA — Device** #### General (single scrollable page, iOS Settings-style grouped rounded sections)
- **Connection** — server address (host:port), connection status, latency, version of Server we're talking to.
- **System** — what platform we're connected to (one of Zion/ Zion/ Zion/ Pinnacle/ Joshua/ Sequoia), firmware version, full peripheral inventory with capability flags.
- **Preferences** — light/dark mode (System/ Light/ Dark), table density, log auto-scroll default, anything else useful discovered from the API.
- **Operator** — operator info slot (name/email/role) — leave a wired but empty form; auth is not in v1, but the form lives here. #### OTA — Host (its own page)
- Updates the **host stack** (web UI + Server) as a **bundled** operation. Single upload, single button, one operation.
- Upload area accepts a host update bundle. Drag-drop + click-to-browse.
- After upload: stepped status — `Uploading` → `Verifying` → `Applying` → `Reloading`. Each step lights up. Errors visible inline.
- Expandable **logs panel** below the steps, showing real underlying log lines. #### OTA — Device (its own page)
- Updates the **target device** (Client app on the target platform).
- **Two source options**, presented as a segmented control or tabs: - **Upload image** (fully implemented v1) — drag-drop + browse. - **Fetch from update server** (UI scaffolded but functionality is **deferred** in v1) — present a URL/credential field, disable the action button, show a clear "Coming soon" badge or tooltip. Do not pretend it works.
- After upload (the implemented path): server transfers the image to the target's `/tmp` location.
- **Stepped status:** `Uploading to server` → `Transferring to device` → `Image landed in/tmp` → `(Future) Triggering update`. The last step is shown as disabled/ "Not yet implemented" — honest UI.
- Expandable logs panel showing real progress (file sizes, transfer rates, errors).
- The `TriggerUpdate` gRPC command is **stubbed** in v1; UI must not suggest the update has been applied. After transfer, the UI states clearly: "Image is on the target at/tmp/<filename>. Update trigger is not yet implemented; complete the update manually if needed." ### 3.12 Charts and tables (binding)
- **Charts:** Use a single chart library (recharts or visx or uPlot — your call based on perf needs; live streaming at high sample rates needs uPlot-class performance). All charts share consistent styling and color tokens. Both light- and dark-mode safe.
- **Rolling-window** behavior fixed at 60s for live monitoring/long-running. Right edge = now; older scrolls off.
- **Historical** charts have pan/zoom but no editing.
- **Tables:** TanStack Table for all data tables. Sortable columns by default, filterable header, virtualized rows when row count > 200. Sticky header. iOS-inspired row styling (subtle separators, rounded outer corners on the table container). ### 3.13 Error and edge states (binding — honest UI)
- **Offline state** — top bar shows `● Offline`; main content shows a single calm panel: "Not connected to server." with the server address. No spinners, no fake reconnect animations. There may be a manual "Retry" button.
- **Empty states** — every list view (Previous Runs, peripheral inventory, etc.) has a designed empty state with a one-line description, not a blank white box.
- **Loading states** — short, honest. Use shimmer/skeleton for predictable-shape loading; use a spinner only when truly indeterminate.
- **No data is shown that isn't real.** No mocked values, no stale-but-displayed-as-live, no fake progress. ### 3.14 Keyboard shortcuts (small set, well-chosen)
- `Space` — Start/ Stop the current test (only when focus is in the main content area, not in an input).
- `1`/ `2`/ `3`/ `4` — switch to One-shot/ Monitoring/ Event/ Long-run (disabled while running).
- `⌘K` (or `Ctrl+K`) — focus the module search in the sidebar (or open a command palette if you build one).
- `[`/ `]` — collapse/ expand the sidebar.
- All shortcuts documented on a help dialog accessible via `?`. ### 3.15 Honest tech choices (binding)
- **Next.js App Router.** The console is overwhelmingly client-side interactivity; pages are mostly `"use client"`. Use Server Components where they help (initial page shell, layout), not where they fight you. No SSR-rendered live dashboards.
- **TypeScript strict.** No `any` except where third-party types fail.
- **Tailwind** for styling. shadcn/ui for unstyled primitives (Dialog, DropdownMenu, Tabs, Tooltip, Switch) — but **only as building blocks**, not as the look. The visual identity is hand-rolled, not "stock shadcn."
- **TanStack Query** for all server state (REST). Hooks per endpoint.
- **EventSource** wrapper for SSE streams with reconnect-on-mount logic.
- **No global state library** unless genuinely needed. React state + URL state + TanStack Query covers most of it. If you reach for Zustand, document why.
- **All API/types in one place** — `lib/api/*` (clients) and `lib/types/*` (TypeScript types matching the Server schemas). Discoverable, single source of truth. --- ## 4. Repository structure to produce ```
ivv-web/
├── package.json
├── pnpm-lock.yaml # use pnpm
├── tsconfig.json
├── next.config.mjs
├── tailwind.config.ts
├── postcss.config.mjs
├── .eslintrc.cjs
├── .prettierrc
├── .gitignore
├── README.md # install, dev, build, env vars
├── Makefile # dev/ build/ lint/ test targets, Docker wrappers
├── Dockerfile
├── app/
│ ├── layout.tsx # global chrome: top bar + sidebar
│ ├── page.tsx # default landing (e.g., redirect to first module)
│ ├── globals.css # CSS variables, font import, base styles
│ ├── (workspace)/ # route group; everything inside lives within the chrome
│ │ ├── modules/
│ │ │ └── [moduleId]/page.tsx # the module page (one route, dynamic id)
│ │ ├── logs/page.tsx
│ │ └── settings/
│ │ ├── layout.tsx # settings sub-nav (tabs)
│ │ ├── page.tsx # redirect → general
│ │ ├── general/page.tsx
│ │ ├── ota-host/page.tsx
│ │ └── ota-device/page.tsx
├── components/
│ ├── chrome/
│ │ ├── top-bar.tsx
│ │ ├── mode-switcher.tsx # iOS segmented control
│ │ ├── start-stop-button.tsx
│ │ ├── connection-indicator.tsx
│ │ ├── sidebar.tsx
│ │ ├── sidebar-module-group.tsx
│ │ └── sidebar-collapsed-rail.tsx
│ ├── module-page/
│ │ ├── module-header.tsx
│ │ ├── config-panel.tsx
│ │ ├── config-section-oneshot.tsx
│ │ ├── config-section-monitoring.tsx
│ │ ├── config-section-event.tsx
│ │ ├── config-section-longrun.tsx
│ │ ├── result-oneshot.tsx # hero pass/fail + history table
│ │ ├── result-streaming.tsx # live chart + data table (monitor/longrun)
│ │ ├── result-event.tsx # scrolling event table
│ │ └── previous-runs.tsx
│ ├── charts/
│ │ ├── rolling-window-chart.tsx
│ │ └── historical-chart.tsx
│ ├── tables/
│ │ ├── data-table.tsx # TanStack-backed, reusable
│ │ └── event-log-table.tsx
│ ├── logs/
│ │ ├── log-stream.tsx
│ │ └── log-filter-bar.tsx
│ ├── settings/
│ │ ├── grouped-section.tsx # iOS Settings-style rounded group
│ │ ├── settings-row.tsx
│ │ ├── ota-stepper.tsx
│ │ └── ota-log-panel.tsx
│ ├── ui/ # shadcn primitives + small custom atoms
│ └── icons/ # SVG icons for peripherals (one per peripheral type)
├── lib/
│ ├── api/
│ │ ├── client.ts # REST client (typed)
│ │ ├── sse.ts # SSE wrapper hook
│ │ └── endpoints/ # one file per endpoint family
│ ├── types/
│ │ ├── peripheral.ts
│ │ ├── test-modes.ts
│ │ ├── samples.ts # discovered per-peripheral sample types
│ │ ├── events.ts
│ │ └── ota.ts
│ ├── state/
│ │ ├── mode.ts # global mode (one-shot/monitor/event/longrun)
│ │ ├── run-state.ts # idle/running, elapsed timer
│ │ └── connection.ts # online/offline + server address
│ ├── hooks/ # reusable hooks (useElapsed, useRollingBuffer, useKeyboardShortcuts, etc.)
│ ├── utils/ # formatters, time, color, etc.
│ └── theme/ # color tokens, dark/light helpers
├── public/
│ └── (no stock photos; SVG only)
└── tests/ ├── unit/ # component + hook tests (Vitest + RTL) └── e2e/ # Playwright; happy paths against a mock server
``` --- ## 5. Quality bar (binding) - **TypeScript strict; `noUncheckedIndexedAccess: true`.** Build must pass with no errors and no warnings.
- **Accessibility:** Keyboard reachable for everything. Focus rings preserved. WCAG AA contrast in both themes. `prefers-reduced-motion` disables continuous animations and reveal transitions.
- **Performance targets:** Lighthouse Performance ≥ 90 on desktop. Live rolling chart at 1 kHz sample rate must not drop frames on a modern laptop — choose the chart library accordingly.
- **No `console.log`, no `TODO`, no commented-out code** in shipped output.
- **No `prompts engineered around them`** — meaning: if Server doesn't expose what a screen needs, raise it in findings, do not invent a fake endpoint to make the screen work. --- ## 6. What NOT to do - Do **not** invent REST endpoints, SSE events, peripheral types, sample fields, or RPC names. Discover them.
- Do **not** ship fake states — no "Reconnecting" theater, no mocked sample data, no stubbed responses presented as real.
- Do **not** use stock shadcn styling as the visual identity. shadcn is plumbing; the look is hand-rolled.
- Do **not** use generic AI-aesthetic gradients (purple-to-pink), neumorphism, glassmorphism beyond the deliberate backdrop-blur on top bar/ sidebar, or heavy drop shadows.
- Do **not** add charts and tables that have no real data behind them.
- Do **not** support concurrency in v1 (multiple modules running, multiple tests, multiple devices). One test at a time.
- Do **not** use the Pages Router. App Router only.
- Do **not** pull in heavy state-management libraries unless a real need is demonstrated.
- Do **not** add authentication, user accounts, or audit logging in v1 — leave seams only.
- Do **not** add light/dark animations that flash content; respect `prefers-reduced-motion`.
- Do **not** invent peripheral icons whose meaning would confuse an engineer. If unsure, use a labeled generic. --- ## 7. Execution order (follow exactly) 1. Confirm the HAL/ Client/ Server repo paths with the user.
2. **Phase 1:** read all three repos. Produce `WEB_FINDINGS.md` with Server API inventory, peripheral inventory, sample-field semantics, open questions, prompt-vs-reality discrepancies. **Stop and wait for confirmation.**
3. After confirmation: scaffold the Next.js + TypeScript + Tailwind project. Set up the chrome (top bar + sidebar + frosted styling + dark/light). No business logic yet.
4. Wire `lib/api` and `lib/types` against the real Server API. Build the API client + SSE hook.
5. Build the module page shell + dynamic routing. Render the discovered module list in the sidebar (real peripheral data).
6. Implement the four config sections (mode-gated). Implement the One-shot result block (hero + history table). End-to-end pass/fail flow against the real Server.
7. Implement the rolling-window chart and the streaming result block (Monitoring). Real-time data through SSE.
8. Implement Long-running (reuses the streaming block) and the Event-based scrolling table.
9. Implement Previous Runs list and the historical-chart view.
10. Implement the Logs page (live tail + filters).
11. Implement Settings — General page with grouped sections (Connection, System, Preferences, Operator).
12. Implement Settings — OTA Host page (bundled upload + stepped status + log panel).
13. Implement Settings — OTA Device page (upload OR placeholder fetch; stepped status; deferred trigger clearly indicated).
14. Implement keyboard shortcuts and the help dialog.
15. Polish: empty states, error states, offline state, loading states. Run Lighthouse; fix to targets.
16. Write tests: critical hooks and components in Vitest; the happy-path flow per mode in Playwright against a mock server.
17. Write README, deployment notes, and a `RELEASE_NOTES.md` summarizing what shipped and any known gaps. **Begin with step 1: confirm the repo paths, then start the Phase 1 review. Do not write UI code until the findings report is confirmed.**