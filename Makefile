DOCKER_COMPOSE ?= docker compose
SERVICE ?= front
PNPM_IN_DOCKER = $(DOCKER_COMPOSE) run --rm $(SERVICE) pnpm
# Stack completa de dev (front + Service + Postgres).
COMPOSE_DEV = $(DOCKER_COMPOSE) -f docker-compose-dev.yml
PNPM_VERSION ?= 9.0.0

.PHONY: help setup dev up down build start lint test ci-test prettier update-snapshot pnpm

help:
	@echo "Available targets:"
	@echo "  make setup            # ativa pnpm (corepack), instala deps e cria .env"
	@echo "  make dev              # sobe a stack completa (front + Service + Postgres) em foreground"
	@echo "  make up               # sobe a stack completa em background"
	@echo "  make down             # derruba a stack de dev"
	@echo "  make build            # executes the build script"
	@echo "  make start            # executes the start script"
	@echo "  make lint             # executes the lint script"
	@echo "  make test             # executes the test script"
	@echo "  make ci-test          # executes the ci:test script"
	@echo "  make prettier         # executes the prettier script"
	@echo "  make update-snapshot  # executes the update-snapshot script"
	@echo "  make pnpm SCRIPT=<script> [ARGS=\"...\"]"

# Prepara o ambiente local (host, sem Docker): pnpm via corepack + deps + .env.
setup:
	corepack enable
	corepack prepare pnpm@$(PNPM_VERSION) --activate
	pnpm install --frozen-lockfile
	@test -f .env || cp .env.example .env
	@echo ">>> ambiente pronto. Ajuste .env se precisar e rode 'make dev' (stack completa) ou 'pnpm dev'."

# Sobe front + Service (imagem publicada) + Postgres num comando.
dev:
	$(COMPOSE_DEV) up

up:
	$(COMPOSE_DEV) up -d

down:
	$(COMPOSE_DEV) down

build:
	$(PNPM_IN_DOCKER) build

start:
	$(PNPM_IN_DOCKER) start

lint:
	$(PNPM_IN_DOCKER) lint

test:
	$(PNPM_IN_DOCKER) test

ci-test:
	$(PNPM_IN_DOCKER) run ci:test

prettier:
	$(PNPM_IN_DOCKER) prettier

update-snapshot:
	$(PNPM_IN_DOCKER) update-snapshot

pnpm:
	@if [ -z "$(SCRIPT)" ]; then \
		echo "Uso: make pnpm SCRIPT=<script-do-package-json> [ARGS=\"...\"]"; \
		exit 1; \
	fi
	$(PNPM_IN_DOCKER) run $(SCRIPT) $(ARGS)
