# Souplesse Pilates — Changelog

[🇬🇧 English](#-english) | [🇫🇷 Français](#-français)

---

<a name="-english"></a>
## 🇬🇧 English Changelog

(Remaining content from English guide...)
...
...

---

<a name="-français"></a>
## 🇫🇷 Journal des Modifications (Changelog)

Ce document répertorie les changements majeurs effectués sur le code source de Souplesse Pilates.

---

## [2026-04-21] Modernisation & Refonte de la Réactivité

### Modernisation Frontend (SPA React)
- **Conversion SPA** : Passage de fichiers HTML séparés à une SPA React unique dans `index.html`.
- **Bundles Modulaires** : Restructuration en bundles JSX transformés dans le navigateur via Babel.
- **Routage Client** : Implémentation de `ReactRouterDOM` avec `HashRouter`.
- **Gestion d'État** : Introduction d'un store compatible Zustand dans `lib.js`.

### Réactivité Mobile & UX
- **Sidebar Admin** : Implémentation d'un menu latéral mobile toggle avec effet de flou.
- **Grilles Réactives** : Optimisation des grilles de cours et de tarifs pour mobile.
- **Optimisation Tactile** : Cibles tactiles de 44px min et polices de 16px.

### DevOps & Infrastructure
- **Hébergement** : Documentation du déploiement sur **Render** et **Neon PostgreSQL**.
- **Améliorations du Seeding** : Images réalistes et associations complexes pour les démos.

---

## [2026-04-19] Intégration Monolithique Full-Stack

### Migration d'Architecture
- **Déploiement Monolithique** : Frontend intégré dans `src/main/resources/static/`, servi par Spring Boot.
- **Chemins API Relatifs** : Utilisation de `API_BASE = ''` pour éliminer les problèmes de CORS.

### Changements Backend
- **Configuration Sécurité** : Filtrage JWT stateless et routes publiques explicites.
- **Seeding DB** : Nettoyage automatique avant seeding et correction de l'instanciation des URLs.

---

## [2026-04-18] Corrections Dashboard Admin
- Résolution des échecs de mutation (édition/suppression) dans le tableau de bord.
- Correction du mapping des endpoints API.

---

## [2026-04-17] Configuration Initiale Docker & Base de Données
- Configuration de `docker-compose.yml` avec PostgreSQL 15.
- Architecture de seeding à trois profils (`initial`, `running`, `testing`).
- Authentification JWT sans état avec `JJWT`.
- APIs REST pour les cours, réservations et authentification.
