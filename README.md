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

#### **Detailed Mode Guide**

When you run the launcher, you will see several options. Choose the one that fits your situation:

| Mode | Best For... | What it does |
| :--- | :--- | :--- |
| **1. Docker Mode** | **Quick Start** (Recommended) | Runs both the website and the database inside Docker. No local setup needed. |
| **2. Hybrid Mode** | **Frontend/Backend Dev** | Runs only the Database in Docker. The App runs on your machine for faster coding. |
| **3. Native Mode** | **Custom Database** | Uses your own local PostgreSQL installation. Requires manual setup. |
| **4. Portable Mode** | **Zero-Config** | Automatically downloads and runs a standalone database. |
| **5. Cleanup** | **Fixing Issues** | Stops all processes and clears stray data. Use this if the app won't start. |

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

#### **Guide Détaillé des Modes**

Lorsque vous lancez le script, plusieurs options s'offrent à vous :

| Mode | Recommandé pour... | Ce qu'il fait |
| :--- | :--- | :--- |
| **1. Mode Docker** | **Démarrage Rapide** | Lance le site et la base de données dans Docker. Aucune configuration locale requise. |
| **2. Mode Hybride** | **Développement Actif** | Lance uniquement la base de données dans Docker. L'application tourne sur votre machine. |
| **3. Mode Natif** | **Base de Données Locale** | Utilise votre propre installation PostgreSQL locale. |
| **4. Mode Portable** | **Zéro Configuration** | Télécharge et lance automatiquement une base de données autonome. |
| **5. Nettoyage** | **Résoudre les Problèmes** | Arrête tous les processus et vide les données résiduelles. |

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
