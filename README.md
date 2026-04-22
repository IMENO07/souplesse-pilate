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

#### **One Launcher to Rule Them All**
We've unified all launch options into single scripts for each OS:
- **Windows**: Run `run.bat` (CMD) or `.\run.ps1` (PowerShell)
- **Linux/Mac**: Run `./run.sh`

These scripts will let you choose between:
1. **Docker Mode** (Full Stack: App + DB in Docker)
2. **Hybrid Mode** (DB in Docker, App runs Natively)
3. **Native Mode** (Use your local PostgreSQL)
4. **Portable Mode** (Windows only - Zero config)
5. **Cleanup** (Reset the environment)

#### **Quick Access**
- Application: [http://localhost:8080](http://localhost:8080) (8081 if in Full Docker mode)

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
