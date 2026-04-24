# 🛠️ Development Guide — Souplesse Pilates

[🇬🇧 English](#-english) | [🇫🇷 Français](#-français)

---

<a name="-english"></a>
## 🇬🇧 English Guide

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

- **Docker Mode**: Runs everything in Docker. Port **8081**.
- **Hybrid Mode**: Runs DB in Docker (**Dynamic Port**), App natively. Port **8080**.
- **Native Mode**: Uses your local PostgreSQL. Port **8080**.
- **Cleanup**: Resets everything.

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
| `run.sh` / `.bat` | Universal runner (Native / Docker / Hybrid). |
| `docker-run.sh` / `.bat` | Isolated Docker environment using port 8081. |
| `clean.sh` / `.bat` | Resets the project (stops containers, clears volumes, stays safe for .env). |
| `setup-db.sh` / `.bat` | Helper to set up local PostgreSQL. |

---

## 🐳 Docker & Container Management

The platform uses Docker Compose to orchestrate the application and its PostgreSQL database.

### Core Commands
- **Start Everything**: `run.bat` (Option 1) or `./run.sh` (Option 1).
  - Internally calls: `docker compose -f docker-compose.local.yml up --build -d`
- **View Logs**:
  ```bash
  docker compose -f docker-compose.local.yml logs -f
  ```
- **Stop Everything**:
  ```bash
  docker compose -f docker-compose.local.yml down
  ```
- **Stop and Wipe Data**:
  ```bash
  docker compose -f docker-compose.local.yml down -v
  ```

### Container Structure
- **app**: The Spring Boot Java application (mapped to port **8081**).
- **db**: PostgreSQL 15 database (mapped to port **5434**).

---

## 🐘 Database Management

### Connection Details
To connect to the database using an external tool (pgAdmin, DBeaver, IntelliJ), use these settings:

| Setting | Value |
| :--- | :--- |
| **Host** | `localhost` |
| **Port** | `Dynamic` (Hybrid) or `5434` (Docker) or `5432` (Native) |
| **Database** | `souplesse_pilates` |
| **User** | `pilates_user` |
| **Password** | `pilates_pass` |

### Environment Variables (Spring Boot)
The application looks for these variables in your `.env` file:
- `SPRING_DATASOURCE_URL`: JDBC URL (e.g., `jdbc:postgresql://localhost:5434/souplesse_pilates`)
- `SPRING_DATASOURCE_USERNAME`: DB Username
- `SPRING_DATASOURCE_PASSWORD`: DB Password

---

## 🧪 Data Seeding & Profiles

The application can automatically populate your database with sample data.

### Seeding Profiles
- **`seed-running`**: Full clean wipe and re-seed with demo data (Instructors, Courses, Testimonials). **Highly recommended for testing.**
- **`seed-initial`**: Only creates the default admin account. Useful for starting fresh.
- **`prod`**: No seeding. Standard production-ready mode.

### How to Seed
1. Open `.env`
2. Change `SPRING_PROFILES_ACTIVE=seed-running`
3. Restart the application.

> [!IMPORTANT]
> The `seed-running` profile will **DELETE all existing data** in the database on startup to ensure a consistent test state.

---

## 🛠️ Deep Troubleshooting

### Port Conflicts
If you see an error like `Bind for 0.0.0.0:8080 failed: port is already allocated`:
1. Check if another instance of the app is running.
2. If you are running Docker, use ports **8081** and **5434** (which the launchers handle automatically).
3. If still blocked, use the **Cleanup** option in the launcher to kill stray processes.

### Database Connection Refused
- **Docker**: Ensure the `db` container is running (`docker ps`).
- **Native**: Ensure your local PostgreSQL service is started.
- **Portable**: Ensure you have write permissions in the directory so the `.db` folder can be created.

### Environment Variable Issues
Always ensure your `.env` file exists in the root. If the launcher created it for you, verify the values match your local setup.

---

<a name="-français"></a>
## 🇫🇷 Guide de Développement

Ce guide fournit tout ce dont vous avez besoin pour faire fonctionner la plateforme Souplesse Pilates sur votre machine locale pour le développement.

---

## 📋 Prérequis

Avant de commencer, assurez-vous d'avoir installé les éléments suivants :

- **Git** : [Télécharger Git](https://git-scm.com/)
- **Java 21** : Nous recommandons [OpenJDK](https://openjdk.org/).
- **Docker & Docker Compose** : (Optionnel mais recommandé) [Docker Desktop](https://www.docker.com/products/docker-desktop).

---

## 🚀 Démarrage Rapide

### 1. Cloner le Dépôt
```bash
git clone https://github.com/samibentaiba/souplesse-pilate.git
cd souplesse-pilate
```

### 2. Configurer l'Environnement
L'application créera automatiquement un fichier `.env` à partir de `.env.example` lors du premier lancement s'il est manquant.

### 3. Lancer l'Application
Utilisez le lanceur unifié pour votre OS :
- **Windows** : `run.bat`
- **Linux/Mac** : `./run.sh`

- **Mode Docker** : Lance tout dans Docker. Port **8081**.
- **Mode Hybride** : Base dans Docker (**Port Dynamique**), App en natif. Port **8080**.
- **Mode Natif** : Utilise votre PostgreSQL local. Port **8080**.
- **Nettoyage** : Réinitialisation complète.

---

## 🐳 Docker & Gestion des Conteneurs

La plateforme utilise Docker Compose pour orchestrer l'application et sa base de données PostgreSQL.

### Commandes Clés
- **Tout démarrer** : `run.bat` (Option 1) ou `./run.sh` (Option 1).
- **Voir les Logs** :
  ```bash
  docker compose -f docker-compose.local.yml logs -f
  ```
- **Tout arrêter** :
  ```bash
  docker compose -f docker-compose.local.yml down
  ```
- **Arrêter et supprimer les données** :
  ```bash
  docker compose -f docker-compose.local.yml down -v
  ```

### Structure des Conteneurs
- **app** : L'application Java Spring Boot (mappée sur le port **8081**).
- **db** : Base de données PostgreSQL 15 (mappée sur le port **5434**).

---

## 🐘 Gestion de la Base de Données

### Détails de Connexion
Pour vous connecter à la base de données via un outil externe (pgAdmin, DBeaver), utilisez ces paramètres :

| Paramètre | Valeur |
| :--- | :--- |
| **Hôte** | `localhost` |
| **Port** | `Dynamique` (Hybride) ou `5434` (Docker) ou `5432` (Natif) |
| **Base de données** | `souplesse_pilates` |
| **Utilisateur** | `pilates_user` |
| **Mot de passe** | `pilates_pass` |

---

## 🧪 Seeding de Données & Profils

### Profils de Seeding
- **`seed-running`** : Réinitialisation complète et peuplement avec des données de démo. **Recommandé pour les tests.**
- **`seed-initial`** : Crée uniquement le compte admin par défaut.
- **`prod`** : Aucun seeding. Mode prêt pour la production.

### Comment Seeder
1. Ouvrez `.env`
2. Changez `SPRING_PROFILES_ACTIVE=seed-running`
3. Redémarrez l'application.

> [!IMPORTANT]
> Le profil `seed-running` **SUPPRIMERA toutes les données existantes** au démarrage.

---

## 🛠️ Dépannage Profond

### Conflits de Ports
Si vous voyez l'erreur `port is already allocated` :
1. Vérifiez si une autre instance de l'application est lancée.
2. Utilisez l'option **Cleanup** du lanceur pour tuer les processus orphelins.

---

## 📚 Documentation Connexe
- [Architecture & Workflow](Workflow.md)
- [DevOps & Profiles](DevOps.md)
- [Front-end Architecture](Front_end.md)
- [Back-end Architecture](Back_end.md)
