# UI / UX Design Philosophy

[🇬🇧 English](#-english) | [🇫🇷 Français](#-français)

---

<a name="-english"></a>
## 🇬🇧 English Guide

This document defines the visual and interactive design principles governing the Souplesse Pilates platform. Every UI decision follows the brand identity of luxury fitness — clean, warm, and inviting.

---

## 1. Unified UI System

The platform has transition from ad-hoc styling to a **Shared UI System** defined in `ui.css` and `ui.jsx`.

### Design Tokens
We use CSS Custom Properties as the source of truth for the brand identity:
- **`--gold`**: Luxury accents and primary actions.
- **`--deep`**: Rich charcoal for high-contrast text.
- **`--glass`**: Frosted white backgrounds with blur effect for a premium feel.

---

## 2. SPA Interaction Flow

The UI is built as a **Single Page Application** to ensure seamless transitions.

### Public Navigation
- **Hero**: Immersive studio imagery with floating centered titles.
- **Grids**: Dynamic grids that stack vertically on mobile.
- **Mobile Menu**: A slide-down glassmorphism overlay.

### Manager Portal (Admin)
- **Fluid Layout**: The dashboard uses a collapsible sidebar strategy.
- **Mobile Toggle**: A dedicated hamburger button on tablet/mobile.

---

## 3. Micro-Animations & Feedback

- **State Transitions**: Smooth slides for the booking wizard and mobile menu.
- **Feedback Loop**: Global toast notifications for successful bookings and errors.

---

## 4. Responsive Design Protocol

We follow a **mobile-first** development protocol:
- **Mobile (< 600px)**: 1-column grids, maximized touch targets.
- **Tablet (600px - 1024px)**: 2-column grids, collapsible admin sidebar.
- **Desktop (1024px+)**: 3+ column grids, fixed sidebar.

---

<a name="-français"></a>
## 🇫🇷 Philosophie du Design UI / UX

*Créer l'Expérience Digitale "Bouger en Beauté"*

Ce document définit les principes de design visuel et interactif régissant la plateforme Souplesse Pilates. Chaque décision UI suit l'identité de marque du fitness de luxe — propre, chaleureuse et accueillante.

---

## 1. Système UI Unifié

La plateforme est passée d'un style ad-hoc à un **Système UI Partagé** défini dans `ui.css` et `ui.jsx`.

### Design Tokens
Nous utilisons des propriétés CSS personnalisées comme source de vérité :
- **`--gold`** : Accents de luxe et actions primaires.
- **`--deep`** : Anthracite riche pour un texte à haut contraste.
- **`--glass`** : Fonds blancs givrés avec effet de flou pour une sensation premium.

---

## 2. Flux d'Interaction SPA

L'interface est construite comme une **Application à Page Unique** pour garantir des transitions fluides.

### Navigation Publique
- **Hero** : Imagerie de studio immersive avec des titres centrés flottants.
- **Grilles** : Grilles dynamiques qui s'empilent verticalement sur mobile.
- **Menu Mobile** : Un calque en verre (glassmorphism) déroulant.

### Portail Manager (Admin)
- **Layout Fluide** : Le tableau de bord utilise une stratégie de barre latérale rétractable.
- **Bouton Mobile** : Un bouton hamburger dédié sur tablette/mobile pour basculer la barre latérale.

---

## 3. Micro-Animations & Feedback

- **Transitions d'État** : Glissements fluides pour l'assistant de réservation et le menu mobile.
- **Boucle de Rétroaction** : Notifications globales (toasts) pour les réservations réussies et les erreurs.

---

## 4. Protocole de Design Réactif

Nous suivons un protocole de développement **mobile-first** :
- **Mobile (< 600px)** : Grilles à 1 colonne, cibles tactiles maximisées.
- **Tablette (600px - 1024px)** : Grilles à 2 colonnes, barre latérale admin rétractable.
- **Desktop (1024px+)** : Grilles à 3+ colonnes, barre latérale fixe.
