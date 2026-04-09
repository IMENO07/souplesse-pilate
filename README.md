# Souplesse Pilates - Guide de lancement

Ce projet est une application Spring Boot avec PostgreSQL.

## 1. Prerequis

- Java 17
- Docker Desktop (avec Docker Compose)
- Postman (pour tester l'API)

## 2. Lancement recommande (Docker)

Depuis la racine du projet:

```bash
docker compose up --build
```

Services demarres:

- Application: http://localhost:8080
- PostgreSQL: localhost:5432

Configuration Docker actuelle:

- Base: souplesse_pilates
- Utilisateur DB: pilates_user
- Mot de passe DB: pilates_pass

Arret des services:

```bash
docker compose down
```

Arret + suppression des volumes (reinitialiser la base):

```bash
docker compose down -v
```

## 3. Lancement local (sans Docker pour l'app)

Option A: lancer uniquement la base PostgreSQL avec Docker, puis l'app en local.

1) Lancer la base:

```bash
docker compose up -d db
```

2) Lancer l'application Spring Boot:

Windows PowerShell:

```powershell
./mvnw spring-boot:run
```

## 4. Test du login admin avec Postman

Un admin est cree automatiquement au demarrage si absent.

Identifiants admin par defaut:

- Email: admin@fitbook.com
- Mot de passe: admin123

Requete Postman:

- Methode: POST
- URL: http://localhost:8080/auth/login
- Headers:
  - Content-Type: application/json
- Body (raw JSON):

```json
{
  "email": "admin@fitbook.com",
  "password": "admin123"
}
```

Reponse attendue en cas de succes:

```text
<jwt-token>
```

Le token doit ensuite etre envoye dans l'en-tete `Authorization` sous la forme `Bearer <jwt-token>`.

## 5. Fichiers utiles

- Configuration Spring: src/main/resources/application.yaml
- Orchestration Docker: docker-compose.yml
- Image applicative: Dockerfile
- Seed admin + password encoder: src/main/java/souplesse_pilates/studio/souplesse_pilates/config/PasswordConfig.java
- Endpoint login: src/main/java/souplesse_pilates/studio/souplesse_pilates/controllers/AdminAuthController.java
