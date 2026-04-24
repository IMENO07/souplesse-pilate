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

---

### 👶 Non-Technical Beginner's Guide

If you are not a developer and just want to run the platform, follow these simple steps:

#### **For Windows Users 🪟**
1. **Download & Extract**: Download the project folder and extract it to your computer.
2. **Double-Click**: Look for a file named `run.bat` and double-click it.
3. **Choose Mode**: A black window (terminal) will open. Press the `1` key on your keyboard and then press **Enter**.
4. **Wait**: It will take a minute to set everything up. When it's ready, it will tell you.
5. **Open Website**: Open your browser and go to: [http://localhost:8080](http://localhost:8080)

#### **For Linux Users 🐧**
1. **Open Terminal**: Right-click inside the project folder and select "Open in Terminal".
2. **Run Script**: Type `./run.sh` and press **Enter**.
3. **Choose Mode**: You will see options. Type `1` and press **Enter**.
4. **Open Website**: Go to: [http://localhost:8080](http://localhost:8080)

---

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

---

### 👶 Guide Simplifié (Non-Technique)

Si vous n'êtes pas un développeur et que vous souhaitez simplement lancer la plateforme, suivez ces étapes simples :

#### **Pour les Utilisateurs Windows 🪟**
1. **Téléchargement** : Téléchargez le dossier du projet et extrayez-le sur votre ordinateur.
2. **Double-clic** : Cherchez le fichier nommé `run.bat` et double-cliquez dessus.
3. **Choisir le Mode** : Une fenêtre noire s'ouvre. Appuyez sur la touche `1` de votre clavier, puis sur **Entrée**.
4. **Attente** : Le système se configure (cela peut prendre une minute).
5. **Ouvrir le Site** : Ouvrez votre navigateur et allez sur : [http://localhost:8080](http://localhost:8080)

#### **Pour les Utilisateurs Linux 🐧**
1. **Ouvrir le Terminal** : Faites un clic droit dans le dossier du projet et sélectionnez "Ouvrir dans un terminal".
2. **Lancer le Script** : Tapez `./run.sh` et appuyez sur **Entrée**.
3. **Choisir le Mode** : Tapez `1` et appuyez sur **Entrée**.
4. **Ouvrir le Site** : Allez sur : [http://localhost:8080](http://localhost:8080)

---

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
