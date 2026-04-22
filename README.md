# 🕊️ Souplesse — Pilates Studio Management

**Souplesse** est une plateforme studio de Pilates haut de gamme, conçue pour offrir une expérience de réservation fluide aux clients et un tableau de bord analytique puissant pour les gestionnaires.

---

## 🚀 Guide du Contributeur (Windows)

Si vous venez de cloner le projet sur un nouveau PC, voici les deux méthodes principales pour lancer l'application. **PostgreSQL est obligatoire.**

### 🛠️ Prérequis Communs
- **Git**
- **Java 21** (ou utilisez le setup automatique via `run.bat`)

---

### 🐳 Méthode 1 : Tout via Docker (Recommandé)
C'est la méthode la plus simple si vous avez Docker Desktop. Elle isole la base de données et l'application.

1.  **Lancer le script :**
    Double-cliquez sur `docker-run.bat`.
2.  **Accès :**
    - Application : [http://localhost:8081](http://localhost:8081)
    - Base de données : Connectez votre pgAdmin au port `5434`.

---

### 💻 Méthode 2 : Développement Natif (Java + pgAdmin Local)
Utilisez cette méthode pour contribuer au code avec un retour immédiat (Hot Reload).

1.  **Configurer PostgreSQL / pgAdmin :**
    - Créez une base de données `souplesse_pilates`.
    - Créez un utilisateur `pilates_user` avec le mot de passe `pilates_pass` (ou modifiez le fichier `.env`).
2.  **Lancer l'Application :**
    - Lancez **`run.bat`** et choisissez l'option **Native Mode**.
    - Ou utilisez votre IDE (IntelliJ/Eclipse) en pointant vers `SouplesseApplication.java`.
3.  **Accès :**
    - Application : [http://localhost:8080](http://localhost:8080)

---

### 🌟 Méthode 3 : Mode "Zéro-Config" (Portable PostgreSQL)
Si vous n'avez pas encore installé PostgreSQL sur votre PC :

1.  Lancez **`run.bat`**.
2.  Choisissez **Option 3 (Portable Mode)**.
3.  Le script s'occupe de tout :
    - Téléchargement d'un **JDK 21 portable**.
    - Création et lancement d'un **PostgreSQL portable** dans le dossier `.db` (Port 5433).

---

## 🏗️ Structure du Projet

- **Frontend** : `/src/main/resources/static/` (React SPA)
- **Backend** : Java 21, Spring Boot 4.0.5, Hibernate 7
- **Scripts :**
    - `run.bat` : Lanceur universel (Docker / Native / Portable).
    - `clean.bat` : Réinitialise complètement le projet (stoppe tout et efface les données).
    - `docker-run.bat` : Lanceur Docker complet.
- **Database** : **PostgreSQL uniquement** (Docker / Local / Portable)

## 🔐 Identifiants par défaut
- **Admin** : `admin@fitbook.com` / (Mot de passe dans `.env`)
