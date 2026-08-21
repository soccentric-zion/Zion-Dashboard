# Zion-Dashboard

## Project Summary

The audit and contract fixtures are inputs to verification, not substitutes for exercising the UI.

The package should be assessed against the API contract and its own runtime configuration together. A successful JavaScript build alone cannot establish that permissions, loading states, streaming updates, or destructive actions behave correctly in an operator browser.

Zion-Dashboard is the operator-console repository for the Zion fleet-management system. The tree contains a `webui` package, contract tests, Docker support, documentation, and repository tooling. Existing documentation points to `webui/README.md`, original requirements in `docs/req.md`, a verified server REST/SSE inventory in `docs/WEB_FINDINGS.md`, and an independent audit in `docs/AUDIT.md`. Those references establish the intended boundary: a Next.js web UI consuming Zion-Server HTTP and server-sent-event APIs, rather than implementing the device daemon or server. The repository layout supports that boundary, but the top-level evidence does not justify claiming a complete operator workflow. The web package, package-lock, contract-test directory, Docker files, and documentation are real project surfaces; individual screens, authentication, live logs, OTA controls, error states, and deployment readiness must be checked in package source and by running package commands. Contract tests are relevant because the API inventory documents endpoints, not proof that every UI action is wired end to end. This README separates documented intent from implementation status and leaves manual verification blank by design. Start with `webui/README.md`, inspect `package.json`, then run package build/test commands and contract tests against a compatible Zion-Server endpoint.

## Feature Status

| # | Name / Description | Implemented? | Test Coverage? | Manual Test |
|---:|---|---|---|---|
| 1 | Next.js operator web application package | Implemented | Package tests/build need to be run | [ ] Manual verification required |
| 2 | Package lock and dependency management | Implemented | Lockfile consistency not verified | [ ] Manual verification required |
| 3 | Zion-Server REST API integration | Partial | Contract-test directory and API inventory present | [ ] Manual verification required |
| 4 | Server-sent-event integration | Partial | API inventory documents SSE; UI unknown | [ ] Manual verification required |
| 5 | Operator authentication/session flow | Unknown | Coverage not established | [ ] Manual verification required |
| 6 | Device/fleet overview | Unknown | Source-level screen review required | [ ] Manual verification required |
| 7 | Runs, results, logs, and live tails | Partial | Contract scope unknown | [ ] Manual verification required |
| 8 | OTA and device-operation controls | Unknown | Requirements/docs only at top level | [ ] Manual verification required |
| 9 | Docker development/packaging support | Implemented | Container build not verified | [ ] Manual verification required |
| 10 | Web UI audit and requirements documentation | Implemented | Documentation, not executable coverage | [ ] Manual verification required |

## Tests and Commands

```bash
cd webui
npm install
npm test
npm run build
```

Run the repository contract-test command after inspecting its local README/config. Exact scripts are not invented because the top-level README does not state them.

## Limitations

The top-level scan cannot establish which screens are complete or whether the dashboard works against a live server. Browser, accessibility, responsive-layout, authentication, SSE reconnection, and production deployment checks remain manual.
# Zion-Dashboard TODO: add a description for Zion-Dashboard. ## Documentation - [webui/README.md](webui/README.md) — Web UI package (Next.js operator console).
- [docs/req.md](docs/req.md) — original design/build prompt for the Web UI.
- [docs/WEB_FINDINGS.md](docs/WEB_FINDINGS.md) — verified Server REST/SSE API inventory.
- [docs/AUDIT.md](docs/AUDIT.md) — independent verification audit of this repo.
- [.claude/skills/dashboard-architecture/SKILL.md](.claude/skills/dashboard-architecture/SKILL.md) — architecture, frontend/backend communication, and UI conventions for coding agents.
