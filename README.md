# Souplesse Pilates - Studio Management App

Application full-stack Spring Boot intégrant un site web client (HTML/CSS/JS) et un tableau de bord administrateur sécurisé. Les données sont persistées sur PostgreSQL avec une authentification JWT.

## ✨ Fonctionnalités
- **Vue Client (`/` ou `/index.html`)** : Navigation fluide pour découvrir le studio, voir les classes disponibles et réserver une séance.
- **Vue Administrateur (`/login.html` puis `/admin.html`)** : Espace sécurisé permettant de :
  - Créer, modifier et supprimer des classes.
  - Gérer les réservations clients (suivi du remplissage des classes).
- **Backend Robuste** : Géré par Spring Boot + Spring Security 6 (JWT Filter).
- **UI Integrée** : Aucun serveur frontend (comme Node.js) n'est nécessaire ; le frontend est servi de manière relative depuis `src/main/resources/static/`.

---

## 🛠 1. Prérequis
- **Java 17**
- **Docker Desktop** (avec Docker Compose)

---

## 🚀 2. Lancement rapide (via Docker)

Depuis la racine du projet :

```bash
docker compose up --build
```
*Cette commande va builder le backend Java et démarrer PostgreSQL en parallèle.*

**Accès à l'application** :
- **Site web public** : [http://localhost:8080](http://localhost:8080)
- **Base de données PostgreSQL** : `localhost:5432`

**Arrêt des services** :
```bash
docker compose down
```

*(Pour tout réinitialiser et purger la BDD : `docker compose down -v`)*

---

## 💻 3. Lancement local (Développement)

Si vous voulez lancer la base de données via Docker et démarrer le serveur Spring Boot localement (pour du live reload/débogage) :

1) Démarrez uniquement la DB :
```bash
docker compose up -d db
```

2) Lancez l'application avec le profil de "seeding" pour pré-remplir la base avec des fausses données :
```bash
./mvnw spring-boot:run -Dspring-boot.run.profiles=seed-running
```

---

## 🔑 4. Authentification Admin

Un administrateur par défaut est systématiquement créé au démarrage de l'application.

- **Email** : `admin@fitbook.com`
- **Mot de passe** : `admin123`

1. Rendez-vous sur `http://localhost:8080/login.html`.
2. Connectez-vous avec les identifiants ci-dessus.
3. Le site stockera votre jeton JWT de manière sécurisée et vous redirigera vers `http://localhost:8080/admin.html`.

*(Si le token expire, les appels API renverront une erreur `401 Unauthorized` et l'interface vous redirigera automatiquement vers la page de connexion).*

---

## 📁 5. Architecture & Fichiers Clés

- **Frontend Integré** : Tous les JS, CSS et HTML du client (et dashboard admin) se trouvent dans `/src/main/resources/static/`. Les requêtes API dans `api.js` utilisent des chemins relatifs (ex: `fetch('/courses')`) sans soucis de CORS.
- **Configuration** : `src/main/resources/application.yaml`
- **Filtre Sécurité** : `security/JwtFilter.java` protège `POST /admin/*` tout en laissant `POST /reservations` ou `GET /courses` publics.
- **Seeding** : `config/seed/RunningSeeder.java` télécharge et implémente des illustrations et des mock classes si le profil "seed-running" est activé.
