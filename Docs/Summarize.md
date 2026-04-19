# Souplesse Pilates — Product Summary

This document serves as a high-level overview of the **Souplesse Pilates** platform. It explains what the software does, who it is built for, and the core value it provides.

---

## What Is It?

Souplesse Pilates is a **studio management web application** for Pilates studios. It allows studio owners to publish their class schedules online, accept real-time reservations from clients, and manage their entire operation from a secure dashboard — all from a single, self-hosted application.

---

## Who Is It For?

### Studio Owners / Managers
- Publish and manage class schedules (Pilates, Yoga, Stretching, Cardio).
- Monitor class capacity and filling rates in real-time.
- View, add, and remove client reservations.
- Full CRUD control over courses from the admin dashboard.

### Clients / Visitors
- Browse available classes with rich visual cards.
- Book a spot in a class through a guided 3-step wizard (select date/time → enter details → confirm).
- Receive immediate on-screen confirmation of their booking.

---

## How It Works

The application is a **monolithic full-stack web app** powered by:
- **Backend**: Java 21 + Spring Boot 4.0.5 + PostgreSQL
- **Frontend**: Vanilla HTML5, CSS3, ES6 JavaScript (no frameworks)
- **Security**: Stateless JWT authentication for the admin dashboard
- **Deployment**: Docker Compose (single command startup)

The entire UI is embedded within the backend — there is no separate frontend server. A single `docker compose up --build` starts everything.

---

## Core Features

| Feature | Public | Admin |
| :--- | :---: | :---: |
| Browse available courses | ✅ | ✅ |
| Book a class (3-step wizard) | ✅ | — |
| View all reservations | — | ✅ |
| Create / Edit / Delete courses | — | ✅ |
| Manage client reservations | — | ✅ |
| Capacity monitoring | — | ✅ |
| JWT-secured dashboard | — | ✅ |

---

## Key Pages

| URL | Page | Access |
| :--- | :--- | :--- |
| `/` or `/index.html` | Public landing page with classes and booking | Public |
| `/login.html` | Admin authentication | Public |
| `/admin.html` | Admin dashboard | JWT Required |

---

## Default Admin Credentials

| Field | Value |
| :--- | :--- |
| Email | `admin@fitbook.com` |
| Password | `admin123` |

These are automatically created on first startup via the `SeedService` interface.
