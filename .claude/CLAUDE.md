# Zion-Dashboard

Standalone dashboard UI. Next.js app-router frontend, a separate pytest contract-test suite, and
docker packaging. Not the on-device UI.

## How you work here

* Commands: `.claude/commands/` — test, lint, validate.
* Write: frontend under `webui/`, contract tests under `contract-tests/` (Python, own Makefile), packaging under `docker/`.
* Test: run `make install` first. Without `node_modules` the gate reports `77` rather than a false failure.

## How you validate

* Gate: `./.claude/validate.sh quick` (seconds) or `full` (adds build + tests). Run it before you claim done.
* Exit codes: `0` pass, `1`-`76` fail, `77` a check never ran. **77 is not a pass.**
* The gate and everything under `.claude/lib`, `hooks`, `commands`, `settings.json` is human-owned. Run it, never edit it.

## Do

* Run `make install` before lint, build or test. Everything needs `node_modules`.
* Keep a lockfile beside each of the two package manifests (`package.json` and `webui/package.json`). The gate requires both — a drifted lockfile is how a build that works locally fails in CI against a different dependency tree.
* Say why in the commit message if you make a contract test conditional. Tests made conditional on a reachable Server are the pattern the Loop Engine's auditor looks at hardest.

## Don't

* **Don't conflate this with Zion-Configuration's on-device dashboard.** Both exist and they are different things: Configuration's UI ships onto the Jetson inside the OS image, this one is a standalone app.
* **Don't assume a Server change is safe for this repo.** It reads from Zion-Server over HTTP/SSE, so a Server-side change can break it without touching a line here. That is what `contract-tests/` is for.

<!-- BEGIN loop-engine -->
## Do's and Don'ts (maintained by the Loop Engine)

Appended by the Loop Engine on loop close; curated by a human when approving a loop out of in-review/. Nothing outside this fence is engine-writable.

<!-- END loop-engine -->
