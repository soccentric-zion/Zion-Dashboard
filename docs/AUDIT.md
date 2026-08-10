# Zion-Dashboard — Audit
*Independent verification. 2026-05-30. Every claim backed by quoted command output.*

## Verdict
- Health: **YELLOW** — webui type-checks clean (Next 16 / React 19 / TS 5), platform name is parameterized, REST/SSE client code matches the Server's contract, and contract-tests exist with the explicit `long_run` round-trip lock test. Two ESLint errors remain in a peripheral `app/(workspace)/ai-llm/page.tsx` (AI assistant page) — not on the IV&V flow but failing CI hygiene. Contract tests cannot be run here without a live Server; verified live in Stage 4.
- Top 3 findings:
  1. **Branch `develop`, commit `4868a50`** — confirmed real branch, no `lib/simulation/` directory; the prior baseline's "simulation/demo branch" concern is closed.
  2. **Platform name is configurable** via `NEXT_PUBLIC_PLATFORM_NAME` (`webui/lib/platform.ts:15-16`, `webui/app/layout.tsx:16`) with `"Zion"` as the default literal. No hard-coded `"Polaris"` anywhere. Two `"Zion"` literals exist as **defaults**, not as identifiers — passes the platform-rename invariant.
  3. **`long_run` round-trip contract test exists** (`contract-tests/tests/test_02_runs.py:test_mode_round_trip_long_run`). Plus monitoring/event/single_shot round-trip tests. Live-runnable only with a Server up — deferred to Stage 4.

## Build
TypeScript type-check (`next build` is slow and unnecessary for verification):

```
$ cd webui && npx tsc --noEmit ; echo EXIT:$?
EXIT:0
```

ESLint:
```
$ cd webui && npx eslint .
…
  389:9   error  Error: Calling setState synchronously within an effect can trigger cascading renders
  507:25  error  Error: This value cannot be modified
✖ 2 problems (2 errors, 0 warnings)
```

Both errors are inside `app/(workspace)/ai-llm/page.tsx` — an LLM chat helper page, tangential to the IV&V data flow.

Verdict: **EXISTS · TYPE-CHECKS · LINT-FAILING (2 errors, scoped)**. `next build` not exercised here.

## Tests (contract suite)

Static structure:
```
contract-tests/
  pyproject.toml
  Makefile
  tests/
    conftest.py
    test_01_smoke.py
    test_02_runs.py
    test_03_settings.py
```

Key contract test (`tests/test_02_runs.py:34-44`):
```python
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
```

Plus parallel round-trip tests for `monitoring`, `event`, and `single_shot`. The `VALID_MODES` tuple at the top is `("single_shot", "long_run", "monitoring", "event")` — exactly the canonical strings produced by Server's `normalize_mode()`.

Live execution: deferred — see `AUDIT_SUMMARY.md` Stage 4 results.

## Repo-specific findings

### Branch / simulation check
```
$ git rev-parse --abbrev-ref HEAD
develop
$ git log --oneline -1
4868a50 (HEAD -> develop, origin/develop) Add CI workflow and contract test suite with platform-aware configurations
$ find webui -name "simulation" -type d
(empty)
```
No simulation subsystem; this is the real branch.

### Platform name
```
$ grep -rnE 'PLATFORM_NAME' webui/lib webui/app
webui/lib/platform.ts:15:export const PLATFORM_NAME =
webui/lib/platform.ts:16:    process.env.NEXT_PUBLIC_PLATFORM_NAME ?? "Zion";
webui/app/layout.tsx:16:const PLATFORM_NAME = process.env.NEXT_PUBLIC_PLATFORM_NAME ?? "Zion";
webui/app/layout.tsx:19:  title: `${PLATFORM_NAME} IV&V Console`,
```
`"Zion"` appears as a default literal, not as an identifier. **No `"Polaris"`** anywhere. Verdict: **CONFIRMED parameterized**.

### REST/SSE contract surface
The webui talks to `/api/v1/runs`, `/api/v1/runs/{id}/events`, `/api/v1/runs/{id}/results`, `/api/v1/modules`, `/api/v1/modules/{id}` (and trend/distribution variants), `/api/v1/health`, `/api/v1/configs`, `/api/v1/alerts`, `/api/v1/notifications`, `/api/v1/auth/*`, `/api/v1/logs/*`. Every one has a matching `ADD_METHOD_TO` declaration on the Server side (verified in `Zion-Server/AUDIT.md`).

**Caveat (from repo memory):** the original spec mentioned `/modules/{id}/heatmap`, but the Server only declares `/modules/{id}/trend`, `/modules/{id}/distribution`, and `/runs/{a}/compare/{b}` (`Zion-Server/src/rest_api/controllers/ModulesController.h:18-20`). If the Dashboard expects a heatmap endpoint, it will 404. Manual grep:

```
$ grep -rn "heatmap" webui
(no matches)
```

So neither side ships heatmap — the spec gap is consistent across both.

### Mode strings used by the UI
`webui/lib/modules/hal-derived-catalog.ts` carries `"long_run"` etc. as the canonical strings that match the Server's `normalize_mode()` outputs. No bare `"long_term"` mode strings appear in the webui — the `LONG_TERM` ↔ `long_run` translation is fully one-sided (UI only knows `long_run`).

## Code health
- Branch `develop`, latest commit `4868a50`. Working tree has stray `__pycache__` `.pyc` files staged under `contract-tests/tests/__pycache__/` — they are auto-generated; harmless but should be `.gitignore`d.
- `app/(workspace)/ai-llm/page.tsx` — 2 ESLint errors (`react-hooks/set-state-in-effect`, `react-hooks/immutability`). Likely an LLM-scaffolded page; out-of-scope for IV&V flow but blocking lint CI.

## Claims vs reality (Dashboard slice)

| Claim | Verdict | Evidence |
|---|---|---|
| Audit ran on real (non-simulation) branch | **CONFIRMED** | `develop` branch; no `lib/simulation/` directory. |
| Platform name parameterized; no hard-coded "Polaris" | **CONFIRMED** | `NEXT_PUBLIC_PLATFORM_NAME` env var; `"Zion"` only as default. |
| TypeScript type-check clean | **CONFIRMED** | `npx tsc --noEmit` exit 0. |
| ESLint clean | **FALSE** | 2 errors in `app/(workspace)/ai-llm/page.tsx`. |
| Contract tests exist | **CONFIRMED** | `contract-tests/tests/test_0{1,2,3}_*.py`. |
| `long_run` round-trip test exists | **CONFIRMED** | `test_02_runs.py:test_mode_round_trip_long_run`. |
| Contract tests pass against live Server | **UNVERIFIABLE-HERE without `make up`** — see Stage 4. | — |
| `next build` succeeds | **NOT VERIFIED** | TS check passes; full build not executed in this audit. |

## Unverifiable-here
- Live `pytest` run of contract tests (needs running Server — Stage 4).
- Full `next build` performance / bundle output.

## Evidence appendix

```
$ git rev-parse --abbrev-ref HEAD
develop
$ git status --short
A  contract-tests/tests/__pycache__/conftest.cpython-313-pytest-9.0.3.pyc
A  contract-tests/tests/__pycache__/test_01_smoke.cpython-313-pytest-9.0.3.pyc
A  contract-tests/tests/__pycache__/test_02_runs.cpython-313-pytest-9.0.3.pyc
A  contract-tests/tests/__pycache__/test_03_settings.cpython-313-pytest-9.0.3.pyc

$ cd webui && npx tsc --noEmit ; echo EXIT:$?
EXIT:0

$ cd webui && npx eslint . 2>&1 | tail -3
✖ 2 problems (2 errors, 0 warnings)
```
