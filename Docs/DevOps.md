# Development Operations — Souplesse Pilates

[🇬🇧 English](#-english) | [🇫🇷 Français](#-français)

---

<a name="-english"></a>
## 🇬🇧 English Guide

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

---

<a name="-français"></a>
## 🇫🇷 Opérations de Développement (DevOps)

Ce document décrit le cycle de vie du développement, la gestion de l'environnement et la stratégie d'hébergement de la plateforme Souplesse Pilates.

---

## 1. Profils d'Environnement

L'application utilise les Profils Spring Boot pour gérer différents modes opérationnels.

| Profil | Objectif | Stratégie de Données |
| :--- | :--- | :--- |
| `dev` | Développement local. | Activé par défaut. |
| `seed-initial` | Démarrage propre en production. | Effacement DB + Création compte Admin. |
| `seed-running` | Tests interactifs / Démo. | Données d'exemple interactives complètes. |
| `seed-testing` | Tests unitaires / intégration. | Jeu de données minimal pour tests automatisés. |
| `prod` | Environnement live. | Persistance des données de production dans Neon PG. |

### Commande d'Activation
```bash
# Pour lancer localement avec les données d'exemple
./mvnw spring-boot:run -Dspring-boot.run.profiles=seed-running
```

---

## 2. Seeding de la Base de Données

Le seeding est géré via l'interface `SeedService` et ses implémentations (`InitialSeeder`, `RunningSeeder`).

- **Logique** : Les seeders s'exécutent au démarrage si le profil correspondant est actif.
- **Sécurité FK** : `RunningSeeder` supprime les données dans l'ordre inverse des dépendances pour garantir l'intégrité.
- **Récupération Admin** : Si le compte admin est manquant, le `SeedService` recrée automatiquement l'admin par défaut :
    - **Email** : `admin@souplesse.dz`
    - **Mot de passe** : `admin123`

---

## 3. Hébergement & Infrastructure

La plateforme est déployée à l'aide d'une stack cloud-native moderne :

- **Serveur d'Application** : **Render** (Web Service).
  - Les déploiements sont déclenchés via les hooks GitHub.
  - Le monolithe Spring Boot est packagé en JAR et sert à la fois l'API et la SPA React intégrée.
- **Base de Données** : **Neon PostgreSQL** (Serverless).
  - Fournit un environnement PostgreSQL 15 hautement disponible.

### Persistance des Données
Au lieu de volumes Docker locaux, la persistance en production est gérée par la couche de stockage distribuée de **Neon**, garantissant qu'aucune donnée n'est perdue lors des redéploiements.

---

## 4. Liaison Frontend-Backend

La plateforme suit une architecture de **Monolithe Modernisé** :
- **Ressources Statiques Intégrées** : L'interface utilisateur est servie depuis `src/main/resources/static`.
- **Wrapper API** : Un fichier `lib.js` unifié contient l'objet `api` qui gère l'injection JWT et les redirections.
- **Hash Routing** : Utilise `HashRouter` (via le symbole `#`) pour permettre au serveur de servir un seul `index.html` pendant que le frontend gère les sous-pages.

---

## 5. Workflow Dev-Ops

1. **Dev Local** : Les changements frontend sont immédiats (rafraîchir le navigateur). Les changements backend nécessitent `./mvnw spring-boot:run`.
2. **Export/Import de Données** : Le panneau d'administration permet d'exporter/importer des données via des fichiers XLSX pour les sauvegardes manuelles.
3. **Logs** : Les logs de production sont routés vers `docker compose` et optionnellement vers un fichier `crash.log`.
