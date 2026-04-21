# UI / UX Design Philosophy

*Creating the "Move Beautifully" Digital Experience*

This document defines the visual and interactive design principles governing the Souplesse Pilates platform. Every UI decision follows the brand identity of luxury fitness — clean, warm, and inviting.

---

## 1. Unified UI System

The platform has transition from ad-hoc styling to a **Shared UI System** defined in `ui.css` and `ui.jsx`.

### Design Tokens
We use CSS Custom Properties as the source of truth for the brand identity:
- **`--gold`**: Luxury accents and primary actions.
- **`--deep`**: Rich charcoal for high-contrast text.
- **`--ocean`**: Muted teal for secondary brand elements.
- **`--glass`**: Frosted white backgrounds with `backdrop-filter: blur(10px)` for a premium feel.

### Component Primitives
- **Buttons**: Consistently sized (min-height 44px for touch) with smooth hover transitions.
- **Inputs**: 16px minimum font size on mobile to prevent automatic browser zooming (iOS).
- **Dialogs**: Responsive modals that adapt to 92% width on mobile screens.

---

## 2. SPA Interaction Flow

The UI is built as a **Single Page Application** to ensure seamless transitions without full page reloads.

### Public Navigation
- **Hero**: Immersive high-resolution studio imagery with floating centered titles.
- **Grids**: Dynamic `Courses Grid` and `Gallery Grid` that stack vertically (1 column) on devices < 600px.
- **Mobile Menu**: A slide-down glassmorphism overlay containing unified site navigation.

### Manager Portal (Admin)
- **Fluid Layout**: The dashboard uses a collapsible sidebar strategy.
- **Mobile Toggle**: A dedicated hamburger button appears on tablet/mobile to toggle the sidebar.
- **Overlay Focus**: Opening the sidebar triggers a backdrop overlay to focus interaction and provide a clear exit path.

---

## 3. Micro-Animations & Feedback

- **State Transitions**: Smooth slides for the booking wizard and mobile menu.
- **Feedback Loop**: Global toast notifications for successful bookings, login errors, and system updates.
- **Skeleton States**: Placeholder UI that mirrors the layout during data fetching to reduce perceived latency.

---

## 4. Responsive Design Protocol

We follow a **mobile-first** development protocol with specific breakpoints:
- **Mobile (< 600px)**: 1-column grids, maximized touch targets, enlarged fonts.
- **Tablet (600px - 1024px)**: 2-column grids, collapsible admin sidebar.
- **Desktop (1024px+)**: 3+ column grids, fixed sidebar, full-width layouts.

---

## 5. Accessibility & Performance

- **Semantic HTML**: Proper use of `<nav>`, `<aside>`, `<main>` for screen reader clarity.
- **Font Optimization**: Specialized loading of *Cormorant Garamond* and *Jost* to prevent layout shifts.
- **Asset Management**: Use of high-quality web-optimized images via standard `<img>` tags for SEO-friendly rendering.
