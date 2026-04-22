# 🛠️ Development Guide — Souplesse Pilates

This guide provides everything you need to get the Souplesse Pilates platform running on your local machine for development.

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Git**: [Download Git](https://git-scm.com/)
- **Java 21**: We recommend using [Amazon Corretto](https://aws.amazon.com/corretto/) or [OpenJDK](https://openjdk.org/).
- **Docker & Docker Compose**: (Optional but recommended) [Docker Desktop](https://www.docker.com/products/docker-desktop).

---

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/samibentaiba/souplesse-pilate.git
cd souplesse-pilate
```

### 2. Configure Environment
The application will automatically create a `.env` file from `.env.example` on first run if it's missing.

### 3. Run the Application
Use the unified launcher for your OS:
- **Windows**: `run.bat`
- **Linux/Mac**: `./run.sh`

The launcher provides several modes:
- **Docker Mode**: Runs everything in Docker. Port **8081**.
- **Hybrid Mode**: Runs DB in Docker, App natively. Port **8080**.
- **Native Mode**: Uses your local PostgreSQL. Port **8080**.
- **Portable Mode**: (Windows) Zero-config mode. Port **8080**.

#### **Method B: Native Development**
Best for fast development with hot-reload (IDE). Requires a local PostgreSQL.
1. Ensure PostgreSQL is running and you've created a database named `souplesse_pilates`.
2. Update `.env` with your DB credentials.
3. Run the launcher and select **Native Mode**.

---

## 🐳 Docker Setup Details

The project includes two Docker Compose files:

- **`docker-compose.yml`**: Uses standard ports (`8080` for app, `5432` for DB).
- **`docker-compose.local.yml`**: Uses alternative ports (`8081` for app, `5434` for DB) to avoid conflicts with other local services. This is used by the `docker-run` scripts.

To run manually with alternative ports:
```bash
docker compose -f docker-compose.local.yml up --build
```

---

## 🧪 Data Seeding

To start with a pre-populated database (useful for testing UI/UX):

- **Enable Seed Profile**: In your `.env` file, set `SPRING_PROFILES_ACTIVE=seed-running`.
- **Manual Command**:
  ```bash
  ./mvnw spring-boot:run -Dspring-boot.run.profiles=seed-running
  ```

---

## 🎨 Frontend Development

The frontend is a React SPA located in `src/main/resources/static/`.

- **No separate npm install/run needed**: The app uses a CDN/Browser-based React setup for simplicity in this monolith architecture.
- **Hot Reload**: Changes to `.jsx`, `.css`, or `.html` files in the `static` directory are immediate. Just refresh your browser.

---

## 🛠️ Useful Scripts

| Script | Purpose |
| :--- | :--- |
| `run.sh` / `.bat` | Universal runner (Native / Docker / Portable). |
| `docker-run.sh` / `.bat` | Isolated Docker environment using port 8081. |
| `clean.bat` | **Windows only**: Completely resets the project (stoppe containers, clears volumes). |
| `setup-db.bat` | **Windows only**: Helper to set up local PostgreSQL. |

---

## ❓ Troubleshooting

### Port 8080 or 5432 is already in use
Use the **Docker Method** (`docker-run.sh/bat`), which maps the application to **8081** and the database to **5434**.

### "Permission Denied" on `.sh` scripts
Run the following to make scripts executable:
```bash
chmod +x *.sh mvnw
```

### Changes in Java code not reflecting
You must restart the Spring Boot application after modifying `.java` files.

---

## 📚 Related Documentation
- [Architecture & Workflow](Workflow.md)
- [DevOps & Profiles](DevOps.md)
- [Front-end Architecture](Front_end.md)
- [Back-end Architecture](Back_end.md)
