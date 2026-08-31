# ──────────────────────────────────────────────────────────────────────────────
# Zion Dashboard — top-level Makefile
#
# Targets:
#   dev          start the Next.js dev server (hot-reload, port 3010)
#   build        build in Docker (alias for docker-build)
#   test         run Vitest unit tests
#   lint         run Next.js ESLint
#   docker-build build the Docker image
#   docker-run   run the container (production, port 3010)
#   docker-stop  stop and remove the container
#   docker-logs  tail container logs
#   clean        remove .next build artefacts
# ──────────────────────────────────────────────────────────────────────────────

.DEFAULT_GOAL := help

WEBUI    := webui
PORT     ?= 3010
IMAGE    ?= zion-dashboard
TAG      ?= latest

.PHONY: dev build test lint install \
        docker-build docker-run docker-stop docker-logs docker-shell docker-clean \
        clean

# ── Local dev ─────────────────────────────────────────────────────────────────

install: ## install npm dependencies
	cd $(WEBUI) && npm install

dev: ## start Next.js development server
	cd $(WEBUI) && npm run dev

build: docker-build ## Build in Docker (fleet standard)

test: ## run Vitest unit tests
	cd $(WEBUI) && npm test

lint: ## run ESLint
	cd $(WEBUI) && npm run lint

clean: ## remove build artefacts
	rm -rf $(WEBUI)/.next

# ── Docker ────────────────────────────────────────────────────────────────────

docker-build: ## build the Docker image
	$(MAKE) -C docker build IMAGE=$(IMAGE) TAG=$(TAG)

docker-run: ## run the container (detached)
	$(MAKE) -C docker run IMAGE=$(IMAGE) TAG=$(TAG) PORT=$(PORT)

docker-stop: ## stop and remove the container
	$(MAKE) -C docker stop IMAGE=$(IMAGE)

docker-logs: ## tail container logs
	$(MAKE) -C docker logs IMAGE=$(IMAGE)

docker-shell: ## open a shell inside the running container
	$(MAKE) -C docker shell IMAGE=$(IMAGE)

docker-clean: ## remove the image
	$(MAKE) -C docker clean IMAGE=$(IMAGE) TAG=$(TAG)

# ── Fleet-standard aliases ────────────────────────────────────────────────────
# Same verbs mean the same thing in every repo; these forward to this
# repo's own targets rather than duplicating their recipes.
.PHONY: run
run: dev ## Alias for dev

# ── Help ──────────────────────────────────────────────────────────────────────
# Targets are self-documenting: text after `## ` on a target line is picked up
# by `make help` automatically, so the listing can never drift from the rules.
.PHONY: help
help: ## Show this help
	@printf '\n  \033[1m%s\033[0m\n' 'Zion-Dashboard'
	@printf '  Usage: make <target> [VAR=value ...]\n'
	@printf '\n'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z0-9_.\/-]+:.*?## / { printf "    \033[36m%-24s\033[0m %s\n", $$1, $$2 }' $(MAKEFILE_LIST)
	@printf '\n'
