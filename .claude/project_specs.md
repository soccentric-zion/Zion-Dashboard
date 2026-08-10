# Zion-Dashboard — specs Remote: `git@github.com:SiliconCentric/Zion-Dashboard.git`
Stack: node. A standalone dashboard UI leaf. Runs anywhere; not part of the on-device image. ## Layout * `webui/` — Next.js app-router frontend. Has its own `package.json`, separate from the root one.
* `contract-tests/` — pytest suite with its own Makefile. Python, not JS.
* `docker/` — packaging. ## Coupling * **Not proto-coupled to Zion-HAL.** Reads from Zion-Server over HTTP/SSE.
* That HTTP/SSE surface is the whole dependency, and it is not compile-checked — which is why `contract-tests/` exists, and why a Server-side change can break this repo without touching its code.
* **Distinct from Zion-Configuration's on-device dashboard.** Configuration's UI ships onto the Zynq UltraScale+ inside the OS image. This one does not.
