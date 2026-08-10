# Zion Dashboard contract tests
#
# Browser-free Python tests encoding the Dashboard's REST/SSE contract with
# the Zion Server. Bring your own running Server (the `make up` stack works).
#
# Usage:
#   make setup                         # create uv venv + install deps
#   make test                          # run against default localhost:8080
#   ACADIA_SERVER_URL=http://... make test
#   make test-smoke                    # fast smoke tests only

SHELL        := /bin/bash
.SHELLFLAGS  := -eu -o pipefail -c
.DEFAULT_GOAL := test

UV           ?= uv
VENV         ?= .venv
STAMP_DIR    := $(VENV)/.stamps
INSTALL_STAMP := $(STAMP_DIR)/installed

ACADIA_SERVER_URL ?= http://localhost:8080

.PHONY: setup test test-smoke lint clean distclean

setup: $(INSTALL_STAMP) ## Create uv venv + install deps

$(VENV)/bin/python:
	@$(UV) venv $(VENV)

$(INSTALL_STAMP): $(VENV)/bin/python pyproject.toml
	@$(UV) pip install --python $(VENV)/bin/python pytest pytest-timeout pytest-cov ruff httpx sseclient-py
	@mkdir -p $(STAMP_DIR) && touch $(INSTALL_STAMP)

test: $(INSTALL_STAMP) ## Run all contract tests against the Server
	@ACADIA_SERVER_URL=$(ACADIA_SERVER_URL) \
	  $(VENV)/bin/python -m pytest tests -v --timeout=30

test-smoke: $(INSTALL_STAMP) ## Run only smoke tests (fast)
	@ACADIA_SERVER_URL=$(ACADIA_SERVER_URL) \
	  $(VENV)/bin/python -m pytest tests -v -m smoke --timeout=10

lint: $(INSTALL_STAMP) ## Lint test code
	@$(VENV)/bin/python -m ruff check tests

clean: ## Remove artefacts
	@rm -rf .pytest_cache .coverage htmlcov
	@find . -type d -name __pycache__ -exec rm -rf {} + 2>/dev/null || true

distclean: clean ## Remove venv too
	@rm -rf $(VENV)
