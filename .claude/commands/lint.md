---
description: Lint the Next.js frontend
allowed-tools: Bash(make lint), Bash(make install), Bash(./.claude/validate.sh:*)
---

!`./.claude/validate.sh quick`

The gate wraps lint plus manifest/lockfile checks. 77 means no node_modules —
make install, then re-run. Never report a 77 as a pass.
