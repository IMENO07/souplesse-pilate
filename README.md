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
4. **Portable Mode** (Automatic zero-config setup)
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

#### **Un Lanceur Unique pour Tout**
Nous avons unifié toutes les options de lancement dans des scripts simples par OS :
- **Windows** : Lancez `run.bat` (CMD) ou `.\run.ps1` (PowerShell)
- **Linux/Mac** : Lancez `./run.sh`

Ces scripts vous permettent de choisir entre :
1. **Mode Docker** (Stack complète : App + DB dans Docker)
2. **Mode Hybride** (DB dans Docker, App lancée nativement)
3. **Mode Natif** (Utilise votre PostgreSQL local)
4. **Mode Portable** (Configuration automatique zéro-friction)
5. **Nettoyage** (Réinitialise l'environnement)

#### **Accès Rapide**
- Application : [http://localhost:8080](http://localhost:8080) (8081 en mode Full Docker)

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

## 🗄️ Database Connection
Connect via pgAdmin/DBeaver:
- **Port**: `5434` (Docker) / `5432` (Native)
- **User/Pass**: `pilates_user` / `pilates_pass`
- **DB Name**: `souplesse_pilates`
