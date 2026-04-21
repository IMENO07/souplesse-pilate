# Comprehensive Frontend Architecture Manual

*Souplesse Pilates Studio User Interface*

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

### Modifying Domain Logic
1. Update the appropriate store or Zod schema in `js/bundles/lib.js`.
2. Update the domain-specific section in `home-sections.jsx` or `admin-sections.jsx`.

### Testing Changes
- **Hot Reload**: Refresh the browser to see CSS/HTML/JS changes instantly.
- **Mocking**: Use the `seed-running` profile on the backend to provide a rich dataset for UI testing.
