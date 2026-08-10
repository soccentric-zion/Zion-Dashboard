# WEB Findings (Phase 1)

Date: 2026-05-28
Scope reviewed:
- Zion-Server (authoritative Web API)
- Zion-Client (run lifecycle + stream behavior context)
- Zion-HAL (module inventory + mode/type context)

This document is based on source-of-truth code, not assumptions.

## 1) REST Endpoint Inventory (Server)

Authoritative route declarations are in `Zion-Server/src/rest_api/controllers/*.h` via `ADD_METHOD_TO(...)`.

### Health
- GET `/api/v1/health`
- GET `/api/v1/openapi.json`

Evidence:
- `Zion-Server/src/rest_api/controllers/HealthController.h:11`
- `Zion-Server/src/rest_api/controllers/HealthController.h:12`
- Response shape from implementation (`status`, `version`): `Zion-Server/src/rest_api/controllers/HealthController.cc`

### Auth
- POST `/api/v1/auth/login`
- POST `/api/v1/auth/logout`
- POST `/api/v1/auth/tokens`
- GET `/api/v1/auth/tokens`
- DELETE `/api/v1/auth/tokens/{id}`
- PATCH `/api/v1/auth/password`

Evidence:
- `Zion-Server/src/rest_api/controllers/AuthController.h:13-18`
- Request/response fields in `Zion-Server/src/rest_api/controllers/AuthController.cc`

### Target / System identity
- GET `/api/v1/target`
- POST `/api/v1/target`
- PUT `/api/v1/target`
- DELETE `/api/v1/target`
- POST `/api/v1/target/heartbeat`

Evidence:
- `Zion-Server/src/rest_api/controllers/TargetsController.h:13-17`
- Response DTO fields in `board_to_json`: `Zion-Server/src/rest_api/controllers/TargetsController.cc:10`

### Modules + analytics
- GET `/api/v1/modules`
- GET `/api/v1/modules/{id}`
- GET `/api/v1/modules/{id}/trend`
- GET `/api/v1/modules/{id}/distribution`
- GET `/api/v1/runs/{a}/compare/{b}`

Evidence:
- `Zion-Server/src/rest_api/controllers/ModulesController.h:16-20`
- Response DTO fields in `mod_to_json`: `Zion-Server/src/rest_api/controllers/ModulesController.cc:13`

### Runs (test orchestration + data)
- GET `/api/v1/runs`
- POST `/api/v1/runs`
- GET `/api/v1/runs/{id}`
- POST `/api/v1/runs/{id}/cancel`
- POST `/api/v1/runs/{id}/pause`
- POST `/api/v1/runs/{id}/resume`
- GET `/api/v1/runs/{id}/results`
- GET `/api/v1/runs/{id}/events` (SSE)
- DELETE `/api/v1/runs/{id}`
- POST `/api/v1/runs/{id}/baseline`
- POST `/api/v1/runs/{id}/rerun`
- GET `/api/v1/runs/{id}/export`
- GET `/api/v1/runs/{id}/report`

Evidence:
- `Zion-Server/src/rest_api/controllers/RunsController.h:13-25`
- DTO field shapes from `run_to_json` and `result_to_json`:
  - `Zion-Server/src/rest_api/controllers/RunsController.cc:20`
  - `Zion-Server/src/rest_api/controllers/RunsController.cc:48`

### Logs
- GET `/api/v1/runs/{run_id}/logs`
- GET `/api/v1/runs/{run_id}/logs/tail` (SSE)
- GET `/api/v1/logs`
- GET `/api/v1/logs/search`
- GET `/api/v1/logs/bookmarks`
- POST `/api/v1/logs/bookmarks`
- DELETE `/api/v1/logs/bookmarks/{id}`
- GET `/api/v1/logs/views`
- POST `/api/v1/logs/views`

Evidence:
- `Zion-Server/src/rest_api/controllers/LogsController.h:13-21`
- SSE events/DTO in `LogsController.cc:40`, `LogsController.cc:62`

### OTA
- GET `/api/v1/ota`
- GET `/api/v1/ota/{id}`
- POST `/api/v1/ota/upload`
- POST `/api/v1/ota/{id}/trigger`
- POST `/api/v1/ota/{id}/rollback`

Evidence:
- `Zion-Server/src/rest_api/controllers/OtaController.h:13-17`
- DTO in `ota_to_json`: `Zion-Server/src/rest_api/controllers/OtaController.cc:12`

### Configs
- GET `/api/v1/configs`
- POST `/api/v1/configs`
- GET `/api/v1/configs/{id}`
- PUT `/api/v1/configs/{id}`
- DELETE `/api/v1/configs/{id}`
- POST `/api/v1/configs/{id}/archive`

Evidence:
- `Zion-Server/src/rest_api/controllers/ConfigsController.h:13-18`
- DTO in `cfg_to_json`: `Zion-Server/src/rest_api/controllers/ConfigsController.cc:10`

### Templates
- GET `/api/v1/templates`
- POST `/api/v1/templates`
- GET `/api/v1/templates/{id}`
- PUT `/api/v1/templates/{id}`
- DELETE `/api/v1/templates/{id}`
- POST `/api/v1/templates/{id}/archive`
- POST `/api/v1/templates/{id}/instantiate`

Evidence:
- `Zion-Server/src/rest_api/controllers/TemplatesController.h:13-19`
- DTO in `template_to_json`: `Zion-Server/src/rest_api/controllers/TemplatesController.cc:9`

### Schedules
- GET `/api/v1/schedules`
- POST `/api/v1/schedules`
- GET `/api/v1/schedules/{id}`
- PUT `/api/v1/schedules/{id}`
- DELETE `/api/v1/schedules/{id}`
- POST `/api/v1/schedules/{id}/disable`
- POST `/api/v1/schedules/{id}/enable`

Evidence:
- `Zion-Server/src/rest_api/controllers/SchedulesController.h:13-19`
- DTO in `schedule_to_json`: `Zion-Server/src/rest_api/controllers/SchedulesController.cc:8`

### Alerts
- GET `/api/v1/alerts`
- POST `/api/v1/alerts`
- GET `/api/v1/alerts/{id}`
- PUT `/api/v1/alerts/{id}`
- DELETE `/api/v1/alerts/{id}`

Evidence:
- `Zion-Server/src/rest_api/controllers/AlertsController.h:21-25`

### Notifications
- GET `/api/v1/notifications`
- POST `/api/v1/notifications/{id}/read`
- POST `/api/v1/notifications/read-all`
- GET `/api/v1/notifications/count`

Evidence:
- `Zion-Server/src/rest_api/controllers/NotificationsController.h:13-16`

### Settings
- GET `/api/v1/settings/retention`
- PUT `/api/v1/settings/retention`

Evidence:
- `Zion-Server/src/rest_api/controllers/SettingsController.h:13-14`

### Backup
- POST `/api/v1/backup`

Evidence:
- `Zion-Server/src/rest_api/controllers/BackupController.h:12`

---

## 2) SSE Inventory (Server)

### Run event stream
- Endpoint: GET `/api/v1/runs/{id}/events`
- Content-Type: `text/event-stream`
- Event types:
  - `state` (initial): `{ "type":"state", "run_id":"...", "status":"..." }`
  - `result` (streamed per result): payload is full `result_to_json(...)`
- Keepalive: `: keepalive` every ~20s when idle

Evidence:
- `Zion-Server/src/rest_api/controllers/RunsController.cc:258`
- `Zion-Server/src/rest_api/controllers/RunsController.cc:265`
- `Zion-Server/src/rest_api/controllers/RunsController.cc:285`
- `Zion-Server/src/rest_api/controllers/RunsController.cc:320`

### Log tail stream
- Endpoint: GET `/api/v1/runs/{run_id}/logs/tail`
- Content-Type: `text/event-stream`
- Event types:
  - `connected`: `{ "status":"connected" }`
  - `log`: serialized log entry (`id`, `run_id`, `source`, `level`/`severity`, `message`, `timestamp`)
- Keepalive: `: keepalive` every ~20s when idle

Evidence:
- `Zion-Server/src/rest_api/controllers/LogsController.cc:62`
- `Zion-Server/src/rest_api/controllers/LogsController.cc:71`
- `Zion-Server/src/rest_api/controllers/LogsController.cc:84`
- `Zion-Server/src/rest_api/controllers/LogsController.cc:118`

---

## 3) Key Request/Response Shapes for Web UI

## 3.1 Run DTO (`run_to_json`)
Fields:
- `id`, `name`, `description`, `mode`, `status`, `baseline_flag`, `notes`, `error_message`
- `created_at`, `created_by`, `started_at`, `ended_at`
- `tags` (JSON object; empty object fallback)

Evidence: `Zion-Server/src/rest_api/controllers/RunsController.cc:20`

## 3.2 Result DTO (`result_to_json`)
Fields:
- Identity/context: `id`, `run_id`, `module_id`, `module_version`, `test_id`, `name`, `mode`
- Timing: `sequence`, `timestamp`, `duration_ns`
- Verdict: `status`, `severity`, `error_message`
- Typed maps: `reason`, `metrics`, `monitoring`, `event`
- Nested: `subtests` (recursive same shape)
- Raw packed payload: `payload_type_url`, `payload_b64`

Evidence: `Zion-Server/src/rest_api/controllers/RunsController.cc:48`

## 3.3 Module DTO (`mod_to_json`)
Fields:
- `id`, `name`, `description`, `version`, `category`, `result_type_url`, `config_type_url`

Evidence: `Zion-Server/src/rest_api/controllers/ModulesController.cc:13`

## 3.4 Target/board DTO (`board_to_json`)
Fields:
- `id`, `name`, `hostname`, `model`, `status`, `first_seen`, `last_seen`
- `os_version`, `hal_version`, `client_version`

Evidence: `Zion-Server/src/rest_api/controllers/TargetsController.cc:10`

## 3.5 OTA DTO (`ota_to_json`)
Fields:
- `id`, `status`, `progress`
- `artifact_path`, `artifact_hash`
- `from_version`, `to_version`
- `created_at`, `ended_at`

Evidence: `Zion-Server/src/rest_api/controllers/OtaController.cc:12`

## 3.6 Log DTO (`log_entry_to_json`)
Fields:
- `id`, `run_id`, `source`, `level`, `severity`, `message`, `timestamp`

Evidence: `Zion-Server/src/rest_api/controllers/LogsController.cc:40`

## 3.7 Query parameters already implemented

Run list:
- `/api/v1/runs?status=&mode=&limit=&offset=`

Run results:
- `/api/v1/runs/{id}/results?module_id=&test_id=&since=&until=&status=&severity=&limit=&offset=`

Module analytics:
- `/api/v1/modules/{id}/trend?test_id=&field=&from=&to=`
- `/api/v1/modules/{id}/distribution?test_id=&field=&run_ids=a,b,c`

Logs:
- `/api/v1/runs/{run_id}/logs?q=&level=&limit=&offset=`
- `/api/v1/logs?source=&level=&run_id=&query=&after=&limit=&offset=`
- `/api/v1/logs/search?q=&run_id=&limit=`

Evidence:
- `Zion-Server/src/rest_api/controllers/RunsController.cc:135,204`
- `Zion-Server/src/rest_api/controllers/ModulesController.cc:49,80`
- `Zion-Server/src/rest_api/controllers/LogsController.cc:14,124,144`

---

## 4) Client Lifecycle (Configure -> Start -> Stream -> Stop)

Lifecycle behavior (Zion-Client):
- Server sends `ConfigureRun` over bidi stream.
- Client stores config and acks.
- Server sends `StartRun`.
- Client sets run state `RUNNING`, executes mode handler.
- Client emits periodic `TestResultBatch` messages with `state` and `terminal` flag.
- Stop/pause/resume commands handled by orchestrator.
- Completion sets `COMPLETED` terminal state and final batch.

Evidence:
- `Zion-Client/src/run/RunOrchestrator.cc:32` (`on_configure`)
- `Zion-Client/src/run/RunOrchestrator.cc:48` (`on_start`)
- `Zion-Client/src/run/RunOrchestrator.cc:81` (`on_pause`)
- `Zion-Client/src/run/RunOrchestrator.cc:87` (`on_resume`)
- `Zion-Client/src/run/RunOrchestrator.cc:93` (`on_stop`)
- Mode dispatch: `run_single_shot`, `run_long_term`, `run_monitoring`, `run_event_based`
  - `Zion-Client/src/run/RunOrchestrator.cc:125-128`
- Batch state wiring:
  - `Zion-Client/src/run/RunOrchestrator.cc:159,163,164`

Protocol enums/messages:
- Run states: `CONFIGURED`, `RUNNING`, `PAUSED`, `COMPLETED`, `FAILED`, `CANCELLED`
  - `Zion-HAL/protos/client_service.proto:23`
- Execution modes: `SINGLE_SHOT`, `LONG_TERM`, `MONITORING`, `EVENT_BASED`
  - `Zion-HAL/protos/common.proto:25`

---

## 5) HAL Peripheral Inventory and Units Context

## 5.1 Module inventory source
The canonical module inventory for UI discovery/types is:
- `Zion-HAL/protos/registry/modules.yaml`

This file provides:
- `id`
- `category`
- proto package/type mapping (`proto_package`, `config_type`, `result_type`)
- for newer entries: `config_type_url`, `result_type_url`

Evidence:
- `Zion-HAL/protos/registry/modules.yaml:18+`
- Categories/ids lines captured throughout the file (compute, sensors, connectivity, power, storage, etc.)

## 5.2 Categories currently present
Observed categories include:
- `compute`, `storage`, `connectivity`, `sensors`, `io`, `system`, `timing`, `power`, `safety`, `security`, `peripherals`, `debug`

Evidence: `Zion-HAL/protos/registry/modules.yaml`

## 5.3 About sample-field units
Important: module proto `Result` messages mostly wrap `repeated hal.common.TestResult` and do not pin fixed per-module scalar fields in proto.

Typed sample content is primarily carried in:
- `TestOutput.reason` (`map<string,string>`)
- `TestOutput.metrics`, `monitoring`, `event` (`map<string,TypedValue>`)

Evidence:
- `Zion-HAL/protos/common.proto:87-98`

So the Web should treat metric keys as dynamic/typed maps, not hardcoded static columns, unless it introduces module-specific renderers.

Representative unit semantics seen in HAL implementation text and checks:
- Temperature in `°C`
- Frequency in `kHz` / `MHz`
- Duration/latency in `ns`, `us`
- Power in `mW`, expected board-level W references

Evidence examples:
- `Zion-HAL/src/thermal_management_lib/thermal_management_lib.cpp`
- `Zion-HAL/src/cpu_lib/cpu_lib.cpp`
- `Zion-HAL/src/power_management_lib/power_management_lib.cpp`

---

## 6) Screen -> Endpoint Mapping (from current server reality)

## 6.1 Top bar connection + status
- Health/version: `GET /api/v1/health`
- Connected target identity/version: `GET /api/v1/target`

## 6.2 Sidebar modules
- Module list + category + type urls: `GET /api/v1/modules`

## 6.3 Module page: run control + live stream + history
- Create run: `POST /api/v1/runs`
- Stop/pause/resume: `POST /api/v1/runs/{id}/cancel|pause|resume`
- Poll run details: `GET /api/v1/runs/{id}`
- Historical/initial results: `GET /api/v1/runs/{id}/results`
- Live stream while running: `GET /api/v1/runs/{id}/events` (SSE)
- Compare/trend/distribution (historical analytics):
  - `GET /api/v1/modules/{id}/trend`
  - `GET /api/v1/modules/{id}/distribution`
  - `GET /api/v1/runs/{a}/compare/{b}`

## 6.4 Logs page
- Historical/filtered list:
  - `GET /api/v1/logs`
  - `GET /api/v1/logs/search`
  - `GET /api/v1/runs/{run_id}/logs`
- Live tail:
  - `GET /api/v1/runs/{run_id}/logs/tail` (SSE)

## 6.5 Settings -> General
- Retention preferences: `GET/PUT /api/v1/settings/retention`
- Server version/health: `GET /api/v1/health`
- Target platform versions: `GET /api/v1/target`

## 6.6 OTA pages
- List prior/active upgrades: `GET /api/v1/ota`
- Upload artifact: `POST /api/v1/ota/upload` (multipart)
- Trigger: `POST /api/v1/ota/{id}/trigger`
- Rollback: `POST /api/v1/ota/{id}/rollback`

---

## 7) Discrepancies: Prompt vs Current Code

1. Missing module heatmap endpoint in actual routes.
- Prompt expects `/api/v1/modules/{id}/heatmap`.
- Not present in `ModulesController.h`.

2. Prompt references one-shot/history APIs such as `/api/v1/results` and `/api/v1/results/{id}`.
- Current server exposes run-scoped results via `/api/v1/runs/{id}/results`.

3. OpenAPI document is partly out-of-sync with route declarations.
- Example in OpenAPI template mentions `/target` with `PUT` as register, while headers expose both POST and PUT on `/api/v1/target`.
- Treat controller headers + implementations as canonical for integration.

4. Alerts controller is partially stubbed.
- `list` currently returns empty rules, `get` returns not found placeholder.

5. OTA flow granularity in prompt (fine-grained phase states and transfer-to-device semantics) is broader than currently explicit REST shape (`status`, `progress`, metadata).
- Additional event/log endpoints may be needed for full stepped UX.

---

## 8) Open Questions to Resolve Before Phase 2 UI Build

1. Authentication mode for Web v1: session cookie, API token, or disabled auth in local deployments?
2. Run creation payload currently minimal (`config_id`, `mode`); where does per-module mode-specific config editing map in REST?
3. How should one module be selected for a run when `POST /runs` only references config + mode in current controller?
4. Should logs page tail all logs or only run-bound streams? (tail endpoint is run-scoped path.)
5. OTA host vs device distinction in prompt: current OTA controller appears unified; confirm whether two backend paths exist/planned.
6. For dynamic typed maps (`metrics`, `monitoring`, `event`), should UI define per-module field dictionaries or render generic key/value tables first?

---

## 9) Implementation Readiness Notes

- Enough API surface exists to start a real, no-mock UI shell wired to:
  - health/target/modules/runs/results/events/logs/ota/settings-retention.
- To satisfy the full UX spec exactly, backend clarifications/extensions are likely needed for:
  - heatmap endpoint,
  - richer one-shot/history cross-run APIs,
  - OTA step-level progress semantics,
  - stable per-module field dictionaries for charts.

This concludes Phase 1 findings.