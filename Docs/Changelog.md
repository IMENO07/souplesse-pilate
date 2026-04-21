# Souplesse Pilates — Changelog

This document chronicles the major changes executed across the Souplesse Pilates codebase.

---

## [2026-04-21] Modernization & Responsiveness Overhaul

### Frontend Modernization (React SPA)
- **SPA Conversion**: Transitioned from separate `admin.html` and `login.html` files to a single-entry React SPA in `index.html`.
- **Modular Bundles**: Restructured the frontend into JSX bundles (`js/bundles/*.jsx`) transformed in-browser via Babel for high maintainability.
- **Client-Side Routing**: Implemented `ReactRouterDOM` with `HashRouter` for seamless page transitions.
- **State Management**: Introduced a unified state management system using a Zustand-compatible store in `lib.js`.
- **Design System**: Established a shared UI library (`ui.jsx`) with design tokens in `ui.css`.

### Mobile Responsiveness & UX
- **Admin Sidebar**: Implemented a stateful mobile sidebar toggle with a floating hamburger button and frosted glass overlay.
- **Responsive Grids**: Optimized `CoursesGrid`, `GalleryGrid`, and `PricingGrid` to stack vertically (1 column) on mobile devices (< 600px).
- **Touch Optimization**: Verified and enforced 44px minimum touch targets and 16px font sizes to prevent iOS auto-zoom.
- **Micro-Animations**: Added slide transitions for the mobile menu and administrative overlays.

### DevOps & Infrastructure
- **Hosting Strategy**: Documented deployment to **Render** and connection to **Neon PostgreSQL**.
- **Seeding Improvements**: Enhanced `RunningSeeder` with realistic images and complex associations for demo environments.
- **Documentation Sweep**: Comprehensive update of `Back_end.md`, `Front_end.md`, `UI_UX.md`, and `DevOps.md`.

---

## [2026-04-19] Full-Stack Monolithic Integration

### Architecture Migration
- **Monolithic Deployment**: Embedded the entire frontend (HTML/CSS/JS) directly into `src/main/resources/static/`, served by Spring Boot's embedded Tomcat. Eliminated the need for a separate frontend server.
- **Relative API Paths**: Updated `api.js` to use `API_BASE = ''` instead of hardcoded `localhost:8080`, removing all CORS complications.

### Backend Changes
- **Security Configuration** (`SecurityConfig.java`):
  - Added `@EnableWebSecurity` and `@EnableMethodSecurity`.
  - Defined explicit public routes for static files (`/`, `/index.html`, `/login.html`, `/admin.html`, `/css/**`, `/js/**`).
  - Fixed invalid wildcard Ant matchers (`/**.html` → explicit file paths).
  - Disabled HTTP Basic and form login in favor of stateless JWT.
- **JWT Filter** (`JwtFilter.java`):
  - Updated to gracefully handle invalid/expired tokens on public routes (allows filter chain to continue instead of rejecting the request).
- **Database Seeding** (`RunningSeeder.java`):
  - Added `courseRepository.deleteAll()` before seeding to ensure clean state.
  - Fixed `URL` instantiation to use `URI.toURL()` instead of the deprecated `new URL()` constructor.
  - Populated with realistic Pilates class data matching the original UI mock data.

### Frontend Changes
- **API Client** (`api.js`):
  - Created unified async fetch wrapper with automatic JWT injection.
  - Added global `401 Unauthorized` interceptor: clears stale token from `localStorage` and redirects to `/login.html`.
  - Handles `204 No Content` responses from delete operations.
- **Data Modules** (`courses.js`):
  - Rewrote `CoursesDB` and `ClientsDB` as async bridges to backend REST endpoints.
  - `CoursesDB.getAll()` auto-detects page context (`/courses` for public, `/admin/courses` for admin).
  - Added field mapping layer (`coach`, `dateTime`, `image` computed properties).
- **Homepage Logic** (`main.js`):
  - Replaced all synchronous `localStorage` mock data with async `CoursesDB.getAll()` calls.
  - Fixed booking payload to correctly reference form variables (`prenom`, `nom`, `email`).
  - Removed broken `ClientsDB.getByCourse()` duplicate check that caused silent failures.
- **Admin Dashboard** (`admin.js`):
  - Refactored all CRUD operations to use JWT-authenticated API calls via `api.js`.
  - Mapped frontend form fields to backend DTO shapes (date/time splitting, type enforcement).

---

## [2026-04-18] Admin Dashboard Bug Fixes

### Backend
- Diagnosed and resolved mutation failures (edit/delete courses) in the admin dashboard.
- Fixed API endpoint mapping between frontend JS and backend controllers.

---

## [2026-04-17] Initial Docker & Database Setup

### Infrastructure
- Configured `docker-compose.yml` with PostgreSQL 15 and Spring Boot application.
- Established database seeding architecture with three distinct profiles:
  - `seed-initial`: Admin user creation only.
  - `seed-running`: Realistic class data for development.
  - `seed-testing`: Bulk test data for QA.
- Implemented `SeedService` interface with shared `createAdminIfNotExists()` method.

### Security
- Implemented stateless JWT authentication using JJWT 0.12.6.
- Created `JwtFilter` for token extraction and validation.
- Configured `SecurityFilterChain` with role-based access control (`ROLE_ADMIN` for `/admin/**` routes).

### Core API
- Built RESTful controllers for courses, reservations, and authentication.
- Implemented MapStruct mappers for entity ↔ DTO transformation.
- Added booking lifecycle with capacity checking and duplicate prevention.
