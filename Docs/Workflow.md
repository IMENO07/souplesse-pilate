# High-Level Architecture & Workflow Protocol

[🇬🇧 English](#-english) | [🇫🇷 Français](#-français)

---

<a name="-english"></a>
## 🇬🇧 English Guide

(Remaining content from English guide...)
...
...

---

<a name="-français"></a>
## 🇫🇷 Architecture de Haut Niveau & Protocole de Workflow

*Guide de Développement, de Mise à l'Échelle et de Déploiement*

Ce document dicte la manière dont la plateforme Souplesse Pilates est développée, mise à l'échelle, réparée et déployée. Il unifie les couches Backend, Frontend et UI/UX dans un flux opérationnel prévisible.

---

## 1. L'Architecture Macro

L'application est un **monolithe modernisé** comprenant une **Application à Page Unique (SPA) basée sur React** intégrée dans un service Spring Boot. Le frontend est servi sous forme de collections de bundles modulaires (`js/bundles/*.jsx`) traités via Babel dans le navigateur, assurant une séparation claire des préoccupations et une haute maintenabilité.

---

## 2. Workflow de Développement

### Configuration du Développement Local

Pour un guide complet sur la configuration de votre environnement, veuillez vous référer au [Guide de Développement](Development.md).

Démarrage rapide :
1. **Mode Docker** : Lancez `./docker-run.sh` (Linux/Mac) ou `docker-run.bat` (Windows).
2. **Mode Natif** : Lancez `./run.sh` (Linux/Mac) ou `run.bat` (Windows).

### Effectuer des Changements

| Type de Changement | Fichiers à éditer | Rebuild Nécessaire ? |
| :--- | :--- | :--- |
| Frontend HTML/CSS/JS | `src/main/resources/static/*` | Non (rafraîchir le navigateur) |
| Backend Java | `src/main/java/**` | Oui (redémarrer Spring Boot) |
| Schéma DB | Fichiers Entity `.java` | Oui (Hibernate auto-update via `ddl-auto=update`) |

---

## 3. Pipeline d'Implémentation de Fonctionnalités

L'ajout d'une nouvelle fonctionnalité nécessite de relier le frontend et le backend. Suivez la stratégie **API-First** :

1. **Entity** -> Créez `PromoCode.java` avec les annotations JPA.
2. **DTO** -> Créez `PromoCodeRequestDto` et `PromoCodeResponseDto`.
3. **Mapper** -> Créez l'interface `PromoCodeMapper` avec MapStruct.
4. **Service** -> Implémentez `PromoCodeService` avec la logique de validation.
5. **Controller** -> Exposez `POST /api/promo/validate` retournant `{ valid: true, newPrice: 1500 }`.
6. **Frontend** -> Ajoutez l'input promo au wizard de réservation dans `index.html`. Mettez à jour `main.js` pour appeler le nouvel endpoint.
7. **Security** -> Ajoutez le nouvel endpoint public dans `SecurityConfig.java` `.permitAll()`.

---

## 4. Protocole d'Intégration Tierce

Utilisez le **Pattern Adapter** pour tous les fournisseurs externes afin d'éviter un couplage fort.

### Intégration Email
- Définissez une interface générique `EmailSenderInterface.java`.
- Spring Boot émet un `ReservationCreatedEvent` de manière asynchrone.
- Un `NotificationWorker` indépendant écoute et appelle l'interface.

### Intégration de Paiement
1. Le frontend **ne stocke jamais** les données de carte bancaire.
2. La base de données **ne marque jamais** une réservation comme `PAYÉE` via un appel frontend. Uniquement via un Webhook Serveur-à-Serveur vérifié cryptographiquement.

---

## 5. Déploiement & Infrastructure

### Environnements

| Environnement | Base de Données | Frontend | Profil |
| :--- | :--- | :--- | :--- |
| **Local (Dev)** | PostgreSQL (Docker port 5432) | Inclus dans Spring Boot | `seed-running` |
| **Production** | PostgreSQL Dockerisé (volumes persistants) | Inclus dans Spring Boot | `seed-initial` |

### Démarrage Rapide (Production)
```bash
docker compose up --build
```

---

## 6. Protocole d'Équipe

- **Développeurs Frontend** : Éditez les fichiers dans `src/main/resources/static/`. Utilisez `api.js` pour tous les appels backend.
- **Développeurs Backend** : N'exposez que ce dont le frontend a besoin via des DTOs. Protégez les routes `/admin/**` avec `@PreAuthorize("hasRole('ADMIN')")`.
- **QA / Testeurs** : Utilisez le profil `seed-running` pour des données réalistes.
