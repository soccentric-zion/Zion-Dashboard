# ──────────────────────────────────────────────────────────────────────────────
# Zion Dashboard — top-level Makefile
#
# Targets:
# dev start the Next.js dev server (hot-reload, port 3010)
# build build the Next.js production bundle
# test run Vitest unit tests
# lint run Next.js ESLint
# docker-build build the Docker image
# docker-run run the container (production, port 3010)
# docker-stop stop and remove the container
# docker-logs tail container logs
# clean remove .next build artefacts
# ────────────────────────────────────────────────────────────────────────────── WEBUI := webui
PORT ?= 3010
IMAGE ?= zion-dashboard
TAG ?= latest .PHONY: dev build test lint install \ docker-build docker-run docker-stop docker-logs docker-shell docker-clean \ clean # ── Local dev ───────────────────────────────────────────────────────────────── ## install — install npm dependencies
install: cd $(WEBUI) && npm install ## dev — start Next.js development server
dev: cd $(WEBUI) && npm run dev ## build — build the Next.js production bundle
build: cd $(WEBUI) && npm run build ## test — run Vitest unit tests
test: cd $(WEBUI) && npm test ## lint — run ESLint
lint: cd $(WEBUI) && npm run lint ## clean — remove build artefacts
clean: rm -rf $(WEBUI)/.next # ── Docker ──────────────────────────────────────────────────────────────────── ## docker-build — build the Docker image
docker-build: $(MAKE) -f docker/Makefile build IMAGE=$(IMAGE) TAG=$(TAG) ## docker-run — run the container (detached)
docker-run: $(MAKE) -f docker/Makefile run IMAGE=$(IMAGE) TAG=$(TAG) PORT=$(PORT) ## docker-stop — stop and remove the container
docker-stop: $(MAKE) -f docker/Makefile stop IMAGE=$(IMAGE) ## docker-logs — tail container logs
docker-logs: $(MAKE) -f docker/Makefile logs IMAGE=$(IMAGE) ## docker-shell — open a shell inside the running container
docker-shell: $(MAKE) -f docker/Makefile shell IMAGE=$(IMAGE) ## docker-clean — remove the image
docker-clean: $(MAKE) -f docker/Makefile clean IMAGE=$(IMAGE) TAG=$(TAG)
