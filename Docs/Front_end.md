# Comprehensive Frontend Architecture Manual

[🇬🇧 English](#-english) | [🇫🇷 Français](#-français)

---

<a name="-english"></a>
## 🇬🇧 English Guide

This document serves as the source of truth for the Souplesse Pilates frontend. It explains the modernized React architecture, the modular bundle system, the state management strategy, and the unified UI library.

---

## 1. Architectural Philosophy

The frontend is a **Modernized React Single Page Application (SPA)** that runs entirely through a single entry point (`index.html`). It utilizes a **CDN-based tech stack** for rapid development and deployment:
- **React 18**: Used for component-based UI rendering.
- **Babel Standalone**: Performs in-browser JSX transformation, allowing modular development without a build step.
- **HashRouting**: Uses `ReactRouterDOM` with `createHashRouter` to manage navigation internally without requiring server-side route configuration.

---

## 2. Directory Structure & File Map

```
src/main/resources/static/
├── index.html              # The ONLY application entry point
├── favicon.png             # Site favicon
├── css/
│   ├── style.css           # Global design system & typography
│   ├── ui.css              # Library component styles (buttons, inputs, etc.)
│   ├── classes.css         # Grid layouts & specific section styles
│   ├── admin.css           # Manager Portal specific layouts
│   └── login.css           # Auth page styling
└── js/
    ├── app.jsx             # SPA Entry Point & Route Definitions
    └── bundles/
        ├── lib.js          # Shared Logic: api wrapper, stores, utils, zod schemas
        ├── ui.jsx          # Primitive Components: Button, Input, Modal, etc.
        ├── components.jsx  # Reusable UI Patterns: Sidebar, Navbar, etc.
        ├── home-sections.jsx # Public site domain sections
        ├── admin-sections.jsx # Manager Portal domain sections
        └── pages.jsx       # Route-level page components
```

---

## 3. Core Technologies & Linking

### State Management (`js/bundles/lib.js`)
The application uses a **Zustand-compatible `create` function** for global state.
- **`useAuthStore`**: Manages JWT, user profile, and authentication status.
- **`useCourseStore`**: Handles course data fetching, filtering, and caching.
- **`useNotificationStore`**: Global toast system.

### API Communication (`js/bundles/lib.js`)
A unified `api` wrapper handles all REST communication:
- **JWT Injection**: Automatically adds Bearer tokens to sensitive requests.
- **Interceptors**: Handles global error states (401 redirection, 500 toasts).
- **Zod Validation**: Uses `zod` for client-side schema validation before submission.

---

## 4. UI System (`js/bundles/ui.jsx`)

The system follows a **Design Token** approach defined in `style.css` and implemented via primitive components in `ui.jsx`.

| Component | Purpose |
| :--- | :--- |
| `Button` | Themed buttons (primary, secondary, ghost). |
| `Input` | Validated form inputs with error states. |
| `Modal` / `Dialog` | Responsive overlay system for bookings and edits. |
| `Skeleton` | Loading states for data-heavy views. |

---

## 5. Navigation & Routing (`js/app.jsx`)

All navigation is managed by the **HashRouter**.

| Route | Component | Access |
| :--- | :--- | :--- |
| `#/` | `HomePage` | Public |
| `#/about` | `AboutPage` | Public |
| `#/pricing` | `PricingPage` | Public |
| `#/login` | `LoginPage` | Public |
| `#/admin/*` | `AdminLayout` | **Protected (JWT)** |

---

## 6. Development Guidelines

### Adding a New Component
1. Define the UI in `js/bundles/components.jsx` using standardized `ui.jsx` primitives.
2. Use design tokens (e.g., `var(--gold)`, `var(--deep)`) for styling.
3. Ensure responsiveness across mobile (375px) and tablet (768px).

---

<a name="-français"></a>
## 🇫🇷 Manuel Complet de l'Architecture Frontend

*Interface Utilisateur du Studio Souplesse Pilates*

Ce document sert de source unique de vérité pour le frontend de Souplesse Pilates. Il explique l'architecture React modernisée, le système de bundles modulaires, la stratégie de gestion d'état et la bibliothèque UI unifiée.

---

## 1. Philosophie Architecturale

Le frontend est une **Application à Page Unique (SPA) React modernisée** qui s'exécute entièrement via un seul point d'entrée (`index.html`). Il utilise une **stack technologique via CDN** pour un développement rapide :
- **React 18** : Utilisé pour le rendu de l'interface basé sur des composants.
- **Babel Standalone** : Effectue la transformation JSX directement dans le navigateur, permettant un développement modulaire sans étape de build.
- **HashRouting** : Utilise `ReactRouterDOM` avec `createHashRouter` pour gérer la navigation en interne sans configuration serveur supplémentaire.

---

## 2. Structure des Dossiers & Carte des Fichiers

```
src/main/resources/static/
├── index.html              # Point d'entrée UNIQUE de l'application
├── css/
│   ├── style.css           # Système de design global & typographie
│   ├── ui.css              # Styles de la bibliothèque de composants
│   └── ...
└── js/
    ├── app.jsx             # Point d'entrée SPA & Définition des routes
    └── bundles/
        ├── lib.js          # Logique partagée : wrapper api, stores, utils, schémas zod
        ├── ui.jsx          # Composants Primitifs : Button, Input, Modal, etc.
        ├── components.jsx  # Patrons UI réutilisables : Sidebar, Navbar, etc.
        └── ...
```

---

## 3. Technologies Clés & Liens

### Gestion d'État (`js/bundles/lib.js`)
L'application utilise une fonction `create` **compatible avec Zustand** pour l'état global.
- **`useAuthStore`** : Gère le JWT, le profil utilisateur et le statut d'authentification.
- **`useCourseStore`** : Gère la récupération, le filtrage et le cache des données de cours.
- **`useNotificationStore`** : Système global de notifications (toasts).

### Communication API (`js/bundles/lib.js`)
Un wrapper `api` unifié gère toutes les communications REST :
- **Injection JWT** : Ajoute automatiquement les tokens Bearer aux requêtes sensibles.
- **Intercepteurs** : Gère les erreurs globales (redirection 401, toasts 500).
- **Validation Zod** : Utilise `zod` pour la validation de schéma côté client avant soumission.

---

## 4. Système UI (`js/bundles/ui.jsx`)

Le système suit une approche par **Design Tokens** définis dans `style.css` et implémentés via des composants primitifs dans `ui.jsx`.

| Composant | Objectif |
| :--- | :--- |
| `Button` | Boutons thématiques (primary, secondary, ghost). |
| `Input` | Champs de formulaire validés avec gestion d'erreurs. |
| `Modal` / `Dialog` | Système de calques réactifs pour les réservations et éditions. |

---

## 5. Navigation & Routage (`js/app.jsx`)

Toute la navigation est gérée par le **HashRouter**.

| Route | Composant | Accès |
| :--- | :--- | :--- |
| `#/` | `HomePage` | Public |
| `#/login` | `LoginPage` | Public |
| `#/admin/*` | `AdminLayout` | **Protégé (JWT)** |

---

## 6. Directives de Développement

### Ajouter un Nouveau Composant
1. Définissez l'interface dans `js/bundles/components.jsx` en utilisant les primitives standard de `ui.jsx`.
2. Utilisez les design tokens (ex: `var(--gold)`, `var(--deep)`) pour le style.
3. Assurez-vous de la réactivité sur mobile (375px) et tablette (768px).
