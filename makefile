# Makefile

# Variables
ENV_FILE=.env
COMPOSE=docker compose --env-file $(ENV_FILE)
DB_SERVICE=postgres
APP_SERVICE=app


db: ## Start only the database
	@$(COMPOSE) up -d $(DB_SERVICE)


install: ## install all dependencies
	@npm install

start: # Run Docker Compose (app + db) together with build
	@$(COMPOSE) up --build


stop: ## stop & remove all running containers
	@$(COMPOSE) down -v --remove-orphans


clean: stop ## remove running containers, volumes, node_modules, test artifacts
	@$(COMPOSE) rm --force -v
	@rm -rf node_modules coverage dist


test-unit: ## Run unit tests
	@$(COMPOSE) run --rm $(APP_SERVICE) npm run test:coverage


test-e2e: db ## Run e2e (integration) tests
	@$(COMPOSE) run --rm $(APP_SERVICE) npm run test:e2e

test-ci: db ## Run all tests (unit + e2e)
	@$(COMPOSE) run --rm $(APP_SERVICE) npm run test:ci


help: ## display this help
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

.DEFAULT_GOAL := help
.PHONY: build test help
