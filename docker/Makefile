# ──────────────────────────────────────────────────────────────────────────────
# docker/Makefile
#
# Build and run the Zion Dashboard container.
# Run from the repo root:   make -f docker/Makefile <target>
# Or from docker/:          make <target>
#
# Variables (override on CLI, e.g. make build TAG=v1.2.3)
# ──────────────────────────────────────────────────────────────────────────────
IMAGE    ?= zion-dashboard
TAG      ?= latest
PORT     ?= 3010
CONTEXT  ?= ..                   # build context = repo root
DOCKERFILE ?= $(CURDIR)/Dockerfile

.PHONY: build run stop logs shell clean

## build — build the Docker image
build:
	docker build \
		--file $(DOCKERFILE) \
		--tag $(IMAGE):$(TAG) \
		$(CONTEXT)

## run — run the container in detached mode
run:
	docker run -d \
		--name $(IMAGE) \
		--publish $(PORT):3010 \
		--restart unless-stopped \
		$(IMAGE):$(TAG)
	@echo "Dashboard running at http://localhost:$(PORT)"

## stop — stop and remove the container
stop:
	docker stop $(IMAGE) 2>/dev/null || true
	docker rm   $(IMAGE) 2>/dev/null || true

## logs — tail container logs
logs:
	docker logs -f $(IMAGE)

## shell — open a shell inside the running container
shell:
	docker exec -it $(IMAGE) sh

## clean — remove the image
clean: stop
	docker rmi $(IMAGE):$(TAG) 2>/dev/null || true
