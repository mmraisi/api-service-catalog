# Makefile

# Variables
ENV_FILE=.env
COMPOSE=docker compose --env-file $(ENV_FILE)
DB_SERVICE=postgres
APP_SERVICE=app

# Start only the database
db:
	$(COMPOSE) up -d $(DB_SERVICE)


# Stop and remove both app and db containers
stop:
	$(COMPOSE) stop $(DB_SERVICE) $(APP_SERVICE)
	$(COMPOSE) rm -f $(DB_SERVICE) $(APP_SERVICE)

# Run Docker Compose (app + db) together with build
start:
	$(COMPOSE) up --build

# Clean volumes and all services
clean:
	$(COMPOSE) down -v --remove-orphans
