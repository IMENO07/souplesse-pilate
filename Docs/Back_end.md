# Comprehensive Backend Architecture Manual

[🇬🇧 English](#-english) | [🇫🇷 Français](#-français)

---

<a name="-english"></a>
## 🇬🇧 English Guide

This document serves as the exhaustive reference for the Spring Boot backend architecture. It outlines how the server provides a robust API for the modernized SPA, manages security, and handles data persistence.

---

## 1. Core Technological Foundation

The backend uses a standard Spring Boot stack optimized for stability and developer productivity.

| Technology | Role |
| :--- | :--- |
| **Java 21** | Core runtime using modern language features. |
| **Spring Boot 4.x** | Core framework for REST controllers, Security, and DI. |
| **Spring Data JPA** | Hibernate ORM for PostgreSQL interaction. |
| **Neon PostgreSQL** | Serverless production database (managed). |
| **JJWT** | Stateless JWT authentication system. |
| **MapStruct** | Automated Entity ↔ DTO mapping. |

---

## 2. Integrated Monolith Architecture

The backend serves both as the **API Provider** and the **Static Assets Host**.

- **Routing Logic**: All public URLs are served via a single `index.html`. The backend lets the React `HashRouter` manage deep links.
- **REST Logic**: Backend controllers exclusively exchange JSON with the frontend.

---

## 3. Advanced Seeding Strategy

The application uses sophisticated seeders enabled via Spring Profiles.

| Profile | Strategy | Result |
| :--- | :--- | :--- |
| `seed-initial` | Minimalist | Creates only the default admin. |
| `seed-running` | Interactive | Populates courses, instructors, and dummy reservations for demos. |

---

## 4. API & Resource Mapping

### Reservation Engine Logic
1. **Course Lookup**: Verifies the course exists and is not `FULL`.
2. **Duplicate Guard**: Checks for existing `(email, course_id)` pairs.
3. **Transactionality**: Performed in a single `@Transactional` block.
4. **Notifications**: Asynchronous `EmailService` sends confirmation emails.

---

## 5. Security & Lifecycle

- **Statelessness**: No server-side sessions. All state is contained in the JWT.
- **Role Hierarchy**: 
    - `ROLE_ADMIN`: Full CRUD on courses, reservations, and instructors.

---

## 6. Critical Operational Rules

1. **Entity Changes**: Any change to `@Entity` classes must be reflected in the corresponding `Dto` and `Mapper`.
2. **Migration Path**: Schema is managed via Hibernate's `ddl-auto=update` for rapid iteration.

---

<a name="-français"></a>
## 🇫🇷 Manuel Complet de l'Architecture Backend

*Service Backend du Studio Souplesse Pilates*

Ce document sert de référence exhaustive pour l'architecture backend Spring Boot. Il décrit comment le serveur fournit une API robuste pour la SPA modernisée, gère la sécurité et la persistance des données.

---

## 1. Fondations Technologiques

Le backend utilise une stack Spring Boot standard optimisée pour la stabilité et la productivité.

| Technologie | Rôle |
| :--- | :--- |
| **Java 21** | Langage de programmation et runtime. |
| **Spring Boot 4.x** | Framework pour les contrôleurs REST, la sécurité et l'injection de dépendances. |
| **Spring Data JPA** | Hibernate ORM pour l'interaction avec PostgreSQL. |
| **Neon PostgreSQL** | Base de données de production managée (Serverless). |
| **JJWT** | Système d'authentification JWT sans état. |
| **MapStruct** | Mapping automatique entre Entities et DTOs. |

---

## 2. Architecture de Monolithe Intégré

Le backend sert à la fois d'**API** et d'**Hébergeur de Ressources Statiques**.

- **Logique de Routage** : Toutes les URLs publiques sont servies via un unique `index.html`. Le backend laisse le `HashRouter` de React gérer les liens profonds.
- **Logique REST** : Les contrôleurs backend échangent exclusivement du JSON avec le frontend.

---

## 3. Stratégie de Seeding Avancée

L'application utilise des seeders sophistiqués activés via les Profils Spring pour gérer les environnements de test.

| Profil | Stratégie | Résultat |
| :--- | :--- | :--- |
| `seed-initial` | Minimaliste | Crée uniquement l'admin par défaut. |
| `seed-running` | Interactif | Remplit les cours, instructeurs et réservations factices pour les démos. |

---

## 4. API & Mapping des Ressources

### Logique du Moteur de Réservation
1. **Vérification du Cours** : Vérifie que le cours existe et n'est pas `FULL`.
2. **Évite les Doublons** : Vérifie l'existence d'une paire `(email, course_id)` pour éviter les doubles réservations.
3. **Transactionnalité** : La création de la réservation et la décrémentation de la capacité s'effectuent dans un seul bloc `@Transactional`.
4. **Notifications** : Un `EmailService` asynchrone envoie un email de confirmation après validation.

---

## 5. Sécurité & Cycle de Vie

- **Statelessness** : Pas de sessions côté serveur. Tout l'état est contenu dans le JWT.
- **Hiérarchie des Rôles** : 
    - `ROLE_ADMIN` : CRUD complet sur les cours, réservations et instructeurs.

---

## 6. Règles Opérationnelles Critiques

1. **Changements Entity** : Tout changement dans une classe `@Entity` doit être répercuté dans le `Dto` et le `Mapper` correspondant.
2. **Migration** : Le schéma est géré via `ddl-auto=update` d'Hibernate pour une itération rapide.
