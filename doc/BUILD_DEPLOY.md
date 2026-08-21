# Zion-Dashboard Build and Deployment

## Purpose and scope
Zion-Dashboard is the operator web console. The top-level Makefile delegates to the Next.js package in `webui/`; contract tests live in `contract-tests/`; Docker packaging is in `docker/`.

## 1. Prerequisites
- Node.js/npm compatible with the locked Next.js 16, React 19, TypeScript, and Vitest dependencies.
- A compatible Zion-Server HTTP/SSE endpoint for contract or live workflow checks.
- Docker for the image targets; Python >= 3.11 plus a virtual environment for contract tests.

## 2. Setup
Install the Node dependencies before invoking package targets.

## 3. Build and compile
```bash
make install
make build
```
`install` runs `npm install` in `webui`; `build` runs `npm run build`. The equivalent package commands are `cd webui && npm install && npm run build`. Set `NEXT_PUBLIC_PLATFORM_SERVER` at build/runtime when Server is not at its documented local URL.

## 4. Test and lint
```bash
make test
make lint
cd webui && npm run type-check
cd contract-tests && python -m pytest
```
The Makefile's `test` runs Vitest and `lint` runs Next ESLint. Contract tests use the `pyproject.toml` pytest markers (`smoke`, `runs`, `sse`, and `settings`) and require a live Server plus any documented credentials/configuration; they are not run by the top-level Makefile.

## 5. Packaging and artifacts
`webui/.next/` is the Next.js production build output. Build the container with:
```bash
make docker-build IMAGE=zion-dashboard TAG=latest
```
The nested Docker Makefile builds `docker/Dockerfile` with the repository as context. The image tag is configurable with `IMAGE` and `TAG`.

## 6. Deployment, install, and run
```bash
make dev
make docker-run PORT=3010
make docker-logs
make docker-shell
make docker-stop
```
`dev` starts Next development mode on the package's configured port; `docker-run` starts a detached container and publishes host `PORT` to container port 3010. The browser UI must be checked against Zion-Server's REST and SSE endpoints, including authentication, permissions, loading/error states, and live logs.

## 7. Cleanup
```bash
make clean
make docker-clean IMAGE=zion-dashboard TAG=latest
```
`clean` removes `webui/.next`; Docker cleanup stops/removes the container and image through `docker/Makefile`.

## 8. Hardware, cloud, and manual verification caveats
A JavaScript build does not verify browser behavior, API authentication, SSE reconnection, accessibility, responsive layouts, or destructive operations. Docker and contract commands are conditional on Docker, Python dependencies, a reachable Server, and suitable credentials. Keep API base URLs and secrets out of committed files.
