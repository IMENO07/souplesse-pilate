# Development Operations — Souplesse Pilates

This document outlines the development lifecycle, environment management, and hosting strategy for the Souplesse Pilates platform.

---

## 1. Environment Profiles

The application uses Spring Boot Profiles to manage different operational modes.

| Profile | Purpose | Data Strategy |
| :--- | :--- | :--- |
| `dev` | Local development. | Enabled by default. |
| `seed-initial` | Clean production start. | Wiped DB + Admin account creation. |
| `seed-running` | Interactive testing / Demo. | Full interactive sample data populated. |
| `seed-testing` | Unit/Integration testing. | Minimal, predictable dataset for automated tests. |
| `prod` | Live environment. | Persists production data in Neon PG. |

### Activation Command
```bash
# To run locally with full sample data
./mvnw spring-boot:run -Dspring-boot.run.profiles=seed-running
```

---

## 2. Database Seeding

Seeding is handled via the `SeedService` interface and its implementations (`InitialSeeder`, `RunningSeeder`).

- **Logic**: Seeders run on application startup if the corresponding profile is active.
- **FK Safety**: `RunningSeeder` deletes data in reverse-dependency order (Reservations → Courses → Users) to ensure integrity.
- **Admin Recovery**: If the admin account is missing, the `SeedService` automatically recreates the default admin:
    - **Email**: `admin@souplesse.dz`
    - **Password**: `admin123`

---

## 3. Hosting & Infrastructure

The platform is deployed using a modern cloud-native stack:

- **Application Server**: **Render** (Web Service). 
  - Deployments are triggered via GitHub hooks.
  - The Spring Boot monolith is packaged as a JAR and serves both the API and the embedded React SPA.
- **Database**: **Neon PostgreSQL** (Serverless).
  - Provides a high-availability, autoscaling PostgreSQL 15 environment.
  - Connected via the standard Spring Boot JDBC URL.

### Data Persistence
Instead of local Docker volumes, production persistence is managed by **Neon's** distributed storage layer, ensuring data is never lost across server redeploys.

### Deployment Commands
```bash
# Build and start the entire stack
docker compose up --build -d

# View live logs
docker compose logs -f app
```

---

## 4. Frontend-Backend Linking

The platform follows a **Modernized Monolith** architecture:
- **Embedded Static Resources**: The UI is served from `src/main/resources/static`.
- **API Wrapper**: A unified `lib.js` contains the `api` object which handles JWT injection, 401 redirection, and global toast notifications.
- **Hash Routing**: Uses `ReactRouterDOM` with `HashRouter` (via the `#` symbol) to allow the Spring Boot server to serve a single `index.html` while the frontend handles sub-pages.
- **Stateless Auth**: Communicates with the backend using a Bearer JWT stored in `localStorage`.

---

## 5. Dev-Ops Workflow

1. **Local Dev**: Frontend changes are immediate (refresh browser). Backend changes require `./mvnw spring-boot:run`.
2. **Data Export/Import**: Admin panel allows exporting/importing system data via XLSX files for manual backups or migrations.
3. **Logs**: Production logs are routed to `docker compose` logs and optionally to a `crash.log` file in the root directory.
