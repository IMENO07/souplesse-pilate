# UI / UX Design Philosophy

*Creating the "Move Beautifully" Digital Experience*

This document defines the visual and interactive design principles governing the Souplesse Pilates Studio web application. Every UI decision follows the brand identity of luxury fitness — clean, warm, and inviting.

---

## 1. Design System

### Color Palette

| Token | Value | Usage |
| :--- | :--- | :--- |
| Primary | Warm rose / blush tones | Buttons, accents, highlights |
| Background | Off-white / cream | Page backgrounds |
| Text Primary | Dark charcoal | Headings, body text |
| Text Secondary | Muted gray | Subtitles, metadata |
| Success | Soft green | Booking confirmations |
| Danger | Warm red | Errors, delete actions |
| Card Surface | White | Course cards, form backgrounds |

### Typography
- **Headings**: Elegant serif or modern sans-serif (loaded via Google Fonts)
- **Body Text**: Clean sans-serif for readability
- **Hierarchy**: Clear distinction between `h1` (page title), `h2` (section headers), `h3` (card titles)

### Spacing & Layout
- Consistent padding/margin scale (8px base grid)
- `max-width` containers for readable line lengths
- CSS Grid for course card layouts
- Flexbox for navigation, form rows, and dashboard panels

---

## 2. Page Breakdown

### Public Landing Page (`index.html`)

| Section | Purpose | Key Interactions |
| :--- | :--- | :--- |
| **Hero** | Full-width immersive studio image with CTA | "Book Now" button scrolls to booking |
| **Why Souplesse** | Brand value propositions | Static cards with icons |
| **Classes Grid** | Available courses from the API | "Réserver" button opens booking wizard |
| **Booking Wizard** | 3-step reservation flow | Calendar → Form → Confirmation |
| **Testimonials** | Client reviews carousel | Auto-rotation + swipe support |
| **Gallery** | Studio photography grid | Hover overlay with likes/captions |
| **FAQ** | Accordions with common questions | Click-to-expand |
| **Footer** | Contact info, social links, copyright | Static |

### Booking Wizard (3 Steps)
1. **Step 1 — Calendar**: Month calendar view + available time slots selection.
2. **Step 2 — Details**: Input fields for Nom, Prénom, Email. Summary shows selected class and price.
3. **Step 3 — Confirmation**: "Séance Réservée" success screen with animation.

### Login Page (`login.html`)
- Centered card layout with brand imagery
- Email + password fields
- "Connexion" submit button
- Error message display for invalid credentials

### Admin Dashboard (`admin.html`)
- **Sidebar navigation**: Toutes les Classes, Clients & Réservations, Réglages
- **Summary cards**: Total classes, total reservations, capacity stats
- **Course management**: Table with edit/delete actions, "Ajouter une Classe" form
- **Reservation management**: Client list with course association, delete capability

---

## 3. Interaction Principles

### Micro-Animations
- **Fade-up on scroll**: Course cards and sections animate into view via `IntersectionObserver`
- **Calendar transitions**: Smooth month navigation
- **Testimonial carousel**: Auto-rotating with cross-fade transitions
- **Step transitions**: Booking wizard steps slide with dot indicator updates

### Responsive Design
- Mobile-first approach
- Navigation collapses to hamburger menu on small screens
- Course grid adapts from 3 columns → 2 → 1
- Touch support for testimonial swipe

### Empty States
- When no courses are available, display a friendly message instead of a blank grid
- When no reservations exist, show "Aucune réservation" with a subtle illustration

---

## 4. Form Design

All forms follow a consistent pattern:

| Element | Style |
| :--- | :--- |
| Input fields | Full-width, rounded corners, subtle border |
| Labels | Small text above the input |
| Placeholders | Light gray hint text |
| Validation | Real-time inline error messages |
| Submit buttons | Primary color, full-width, hover effect |

### Booking Form Fields
| Field | ID | Type | Required |
| :--- | :--- | :--- | :--- |
| Nom (Last Name) | `fieldNom` | text | ✅ |
| Prénom (First Name) | `fieldPrenom` | text | ✅ |
| Email | `fieldEmail` | email | ✅ |

### Admin Course Form Fields
| Field | Type | Notes |
| :--- | :--- | :--- |
| Titre | text | Course display name |
| Coach (Prénom, Nom, Email) | text | Instructor details |
| Date & Heure | datetime-local | Split into `date` + `time` for API |
| Prix | number | In DA (Dinars Algériens) |
| Capacité | number | Maximum spots |
| Image URL | text/url | Optional course image |

---

## 5. CSS Architecture

### File Organization
- **`style.css`**: CSS custom properties (variables), resets, global typography, layout utilities, navigation, hero, footer
- **`classes.css`**: Course card styles, booking wizard, calendar, step indicators, testimonial carousel, gallery grid
- **`admin.css`**: Dashboard sidebar, summary cards, data tables, admin forms, modal overlays

### Key Design Rules
1. **No inline styles** in HTML — all styling through CSS classes.
2. **CSS Custom Properties** for theming (colors, spacing, font sizes) defined in `style.css`.
3. **BEM-like naming** for component classes (e.g., `.class-card`, `.class-card__title`, `.booking-wizard`).
4. **No CSS frameworks** — all styles are handwritten for full control.

---

## 6. Accessibility Considerations

- Semantic HTML5 elements (`<nav>`, `<main>`, `<section>`, `<footer>`)
- All interactive elements have focus states
- Image `alt` attributes for screen readers
- Sufficient color contrast ratios
- Keyboard navigation support for booking wizard and forms
