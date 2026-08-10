---
description: Run the Dashboard test suites (webui + contract-tests)
allowed-tools: Bash(make test), Bash(make install)
--- !`make test` No node_modules → run make install first; that is provisioning, not a code
failure. contract-tests/ is Python and talks to a live Zion-Server — tests
skipped for an unreachable Server must be REPORTED as skipped, never counted as
passing evidence for a streaming/SSE criterion. That exact pattern closed a loop
falsely once; the auditor now looks for it.
