# 🕊️ Souplesse — Pilates Studio Management

**Souplesse** is a premium Pilates studio platform designed for a seamless booking experience and powerful analytics.

[🇫🇷 Français](#-guide-de-démarrage-rapide) | [🇬🇧 English](#-quick-start-guide)

---

## 🇬🇧 Quick Start Guide

### 📋 Prerequisites
- **Git**
- **Java 21**
- **Docker Desktop** (Optional, recommended)

### 🚀 Launch Methods

#### **Method 1: Docker (Easiest)**
Isolates the DB and app. No local PG installation required.
- **Windows**: Run `docker-run.bat`.
- **Linux/Mac**: Run `./docker-run.sh`.
- **Access**: App at [http://localhost:8081](http://localhost:8081) | DB at port `5434`.

#### **Method 2: Native Dev (Java + Local PG)**
Best for core development with immediate feedback.
- **Setup**: Create DB `souplesse_pilates`. Configure `.env`.
- **Run**:
    - **Windows**: Run `run.bat` → Option 2.
    - **Linux/Mac**: Run `./run.sh`.
- **Access**: App at [http://localhost:8080](http://localhost:8080).

#### **Method 3: Zero-Config (Portable Mode)**
- **Windows Only**: Run `run.bat` → Option 3. Automatically downloads JDK and runs portable PostgreSQL.

---

## 🇫🇷 Guide de Démarrage Rapide

### 📋 Prérequis
- **Git**
- **Java 21**
- **Docker Desktop** (Optionnel, recommandé)

### 🚀 Méthodes de Lancement

#### **Méthode 1 : Docker (Le plus simple)**
Isole la DB et l'app. Pas d'installation locale nécessaire.
- **Windows** : Lancez `docker-run.bat`.
- **Linux/Mac** : Lancez `./docker-run.sh`.
- **Accès** : App sur [http://localhost:8081](http://localhost:8081) | DB sur le port `5434`.

#### **Méthode 2 : Développement Natif**
- **Setup** : Créez la DB `souplesse_pilates`. Configurez `.env`.
- **Lancement** :
    - **Windows** : Lancez `run.bat` → Option 2.
    - **Linux/Mac** : Lancez `./run.sh`.
- **Accès** : App sur [http://localhost:8080](http://localhost:8080).

---

## 📖 Documentation
- [Detailed Development Guide](Docs/Development.md)
- [Architecture & Workflow](Docs/Workflow.md)
- [API & Back-end](Docs/Back_end.md)

## 🏗️ Tech Stack
- **Frontend**: React SPA (CDN-based), CSS3, Material Design.
- **Backend**: Java 21, Spring Boot, Hibernate 7.
- **Database**: PostgreSQL.
- **Infrastructure**: Docker, Render.

## 🔐 Default Credentials
- **Admin**: `admin@souplesse.dz` / `admin123`
