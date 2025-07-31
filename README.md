
## API Service Catalog

### Design Considerations

- **Modular Architecture with NestJS**  
  Leveraged NestJS's modular structure to keep the codebase clean, scalable, and maintainable. Each domain (`Service`, `Version`) has its own module, controller, service, and DTOs to ensure separation of concerns.

- **TypeORM with Postgres**  
  Chose TypeORM for its integration with NestJS and declarative entity definition. Postgres was selected for its reliability, rich feature set, and native support with TypeORM.

- **CRUD + Auth**  
  The API has full CRUD operations for both `services` and `versions` to demonstrate end-to-end design. Token-based authentication was also added to mirror a production setup.

- **Error Handling & Validation**  
  Implemented structured validation via `class-validator` and NestJS `ValidationPipe`. Errors return consistent HTTP codes and messages, helping clients understand what went wrong.

- **Swagger Documentation**  
  Integrated Swagger for auto-generated API docs, making it easy to understand and test endpoints without additional tooling.

- **Docker-First Development**  
  Used Docker and Docker Compose to ensure a consistent, reproducible local dev environment with Postgres.

---

### Assumptions

- Each **Service** can have **multiple Versions**, but each Version is unique per Service (`version_name + service` pair).
- Each **Service** has it's unique `service_name` and service names cannot be duplicated
- Only authenticated users can interact with the API (via bearer tokens).
- Data volume is modest, and the application is not expected to handle high concurrency at this stage.
- Consumers will primarily need the list of services with their versions (hence efficient list and search endpoints were prioritized).

---

### Trade-offs

- **No External Caching**  
  I chose not to introduce Redis or other caching layers for simplicity. In a production scenario with high read-load, caching service lists or paginated results would be a valuable addition.

- **Simplified Auth**  
  Authentication is mocked/stubbed or minimally implemented. In a real-world scenario, this would be backed by a proper identity provider and token lifecycle management.


## Running the App with Makefile

This project uses a Makefile to simplify common development tasks. Below are the available commands:

### Help

```bash
make help
```
Displays available commands.

### Setup

```bash
make install
```
Installs project dependencies.

### Start Services

```bash
make start
```
Builds and starts both the app and database using Docker Compose.

To start only the database:

```bash
make db
```

### Testing

```bash
make test-unit     # Runs unit tests with coverage
make test-e2e      # Runs end-to-end tests
make test-ci       # Runs all tests (unit + e2e)
```

### Cleanup

```bash
make stop          # Stops and removes containers
make clean         # Stops containers and removes volumes, node_modules, dist, and coverage
```


