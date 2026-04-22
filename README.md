# 🕊️ Souplesse — Pilates Studio Management

**Souplesse** est une plateforme studio de Pilates haut de gamme, conçue pour offrir une expérience de réservation fluide aux clients et un tableau de bord analytique puissant pour les gestionnaires.

![Preview of Souplesse](https://images.unsplash.com/photo-1518611012118-696072aa579a?w=1600&q=80)

## 💎 Points Forts

- **Expérience Utilisateur Premium** : Interface fluide avec états de chargement **Skeleton**, animations délicates et navigation par HashRouter.
- **Portail Manager** : Dashboard complet avec statistiques en temps réel, logs d'activité système et gestion CRUD avancée des classes.
- **Sécurité de Grade Bancaire** : Authentification stateless via **Spring Security 6** et jetons **JWT** (durée 24h).
- **SEO & Social Ready** : Gestion dynamique des métadonnées Open Graph et Twitter Cards pour un partage social optimisé.
- **Zéro Dépendance Node.js** : Le frontend est une SPA React moderne servie directement par le moteur statique de Spring Boot.

## 🛠️ Stack Technique

- **Backend** : Java 21, Spring Boot 4.0.5, Spring Security, Hibernate 7.
- **Frontend** : React 18 (CDN), Zustand (State), Zod (Validation), Recharts.
- **Base de Données** : PostgreSQL (Neon / Docker).
- **Infrastucture** : Docker & Docker Compose.

## 🚀 Démarrage Rapide

### 🐳 Via Docker (Windows & Ubuntu) - Recommandé
C'est la méthode la plus simple qui configure la base de données et l'application automatiquement.

**Sur Ubuntu/Linux :**
```bash
chmod +x docker-run.sh
./docker-run.sh
```

**Sur Windows :**
Double-cliquez sur `docker-run.bat` ou lancez-le dans un terminal.

*L'application sera disponible sur [http://localhost:8081](http://localhost:8081).*

> 💡 **Seeding** : Pour lancer avec les données de test (mock data), passez `seed-running` en argument :  
> `./docker-run.sh seed-running` ou `docker-run.bat seed-running`

---

### 💻 Développement Local (Natif)
Si vous souhaitez lancer l'application nativement (nécessite Java 21) :

1. **Configurer l'environnement :**
   Copiez `.env.example` vers `.env` et ajustez les variables si nécessaire.

2. **Lancer la base de données (Docker) :**
   ```bash
   docker compose up -d db
   ```

3. **Lancer l'application :**
   - **Ubuntu/Linux :** `./run.sh`
   - **Windows :** `run.bat`

*L'application sera disponible sur [http://localhost:8080](http://localhost:8080).*

## 🔐 Credentials Par Défaut

- **Espace Admin** : `/index.html#/login`
- **Email** : `admin@fitbook.com`

- **Frontend Integré** : Tous les JS, CSS et HTML du client (et dashboard admin) se trouvent dans `/src/main/resources/static/`. Les requêtes API dans `api.js` utilisent des chemins relatifs (ex: `fetch('/courses')`) sans soucis de CORS.
- **Configuration** : `src/main/resources/application.yaml`
- **Filtre Sécurité** : `security/JwtFilter.java` protège `POST /admin/*` tout en laissant `POST /reservations` ou `GET /courses` publics.
- **Seeding** : `config/seed/RunningSeeder.java` télécharge et implémente des illustrations et des mock classes si le profil "seed-running" est activé.
