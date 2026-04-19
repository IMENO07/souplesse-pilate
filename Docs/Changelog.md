# Souplesse Pilates Extensive Changelog

This document chronicles the macro and micro changes executed across the Souplesse Pilates codebase to resolve Docker dependencies, establish robust database seeding architecture, secure local development layers, and architect a top-tier project documentation foundation.

---

## [Phase 1] - Infrastructure: Decoupling from Docker & Establishing Local H2

### Executive Summary
The primary goal of this phase was to allow frontend engineers and backend developers to boot the Spring Boot application instantly without requiring `sudo` privileges to spin up a PostgreSQL Docker container. 

### Granular Technical Changes
*   **`pom.xml` Dependency Adjustments:**
    *   *Action*: The `com.h2database` dependency was hardcoded to `<scope>test</scope>`. This prevented the application from actually running H2 in a standard execution state.
    *   *Fix*: Removed the `<scope>` tag entirely, allowing the H2 driver to load into the `runtime` class path.
*   **Property File Expansion (`application-dev.yaml` / `application-prod.yaml`):**
    *   *Action*: Replaced the monolith `application.yaml` configurations.
    *   *Data Source Configuration*: Explicitly routed JDBC connections to `jdbc:h2:mem:souplesse_pilates` with `sa` user credentials.
    *   *JPA Overrides*: Enforced `spring.jpa.hibernate.ddl-auto=create-drop` perfectly simulating a fresh schema boot while relying on `org.hibernate.dialect.H2Dialect` to generate H2-friendly ANSI SQL.
    *   *H2 Web Console*: Enabled `spring.h2.console.enabled=true` mapped to `/h2-console`, granting raw SQL oversight to developers debugging the DB.

---

## [Phase 2] - The Spring Security & JWT Routing Overhaul

### Executive Summary
With H2 enabled, the existing Spring Security configuration violently rejected access to the H2 console due to stateless `JWT` filtering rules and rigid Frame Option policies. This phase untangled the local security chains.

### Granular Technical Changes
*   **`SecurityConfig.java` Rewriting:**
    *   *The X-Frame-Options Problem*: Spring Security by default blocks `<iframe>` execution natively to prevent Clickjacking. The H2 Console is built entirely from frames.
    *   *The Fix*: Added `.headers(headers -> headers.frameOptions(frameOptions -> frameOptions.disable()))` to the `SecurityFilterChain`.
    *   *Routing Exclusions*: Appended `"/h2-console/**"` to the `authorizeHttpRequests().requestMatchers(...).permitAll()` array.
*   **`JwtFilter.java` Refactoring:**
    *   *The Broken Filter Chain*: Merely permitting the route in `SecurityConfig` was insufficient. The Custom `OncePerRequestFilter` (`JwtFilter`) was universally intercepting the H2 `/login.do` API requests, finding a `null` authorization header, and hurling an `Exception` before the router could even permit the path.
    *   *The Bypass Injection*: Injected an explicit bypass rule at the absolute top of the `doFilterInternal` method:
      ```java
      if (request.getServletPath().startsWith("/h2-console")) {
          filterChain.doFilter(request, response);
          return;
      }
      ```

---

## [Phase 3] - Modularizing Database Startup Seeding Vectors

### Executive Summary
The application originally utilized a hard-coded `CommandLineRunner` embedded inside `PasswordConfig.java` to inject a naked `ADMIN` user. This was destructive and inflexible. We rebuilt this into an elegant, Profile-Driven Interface architecture.

### Granular Technical Changes
*   **Deprecation**: Removed the raw `initAdmin` method from `PasswordConfig.java` to divorce security hashing setups from raw data manipulation.
*   **Interface Implementation (`SeedService.java`)**: Created a generic contract demanding a `seedDatabase()` execution method across all environments.
*   **Profile 1: `InitialSeeder.java` (`@Profile("seed-initial")`)**:
    *   *Execution*: Spawns only one record: The Studio Admin (`admin@fitbook.com`).
    *   *UX Trigger*: Forces the frontend into a graceful "Empty State" ("Aucune classe disponible") to prove the UI doesn't crash on null arrays.
*   **Profile 2: `RunningSeeder.java` (`@Profile("seed-running")`)**:
    *   *Execution*: Spawns the Admin, 2 core Instructors (Sara & Marc), and precisely 4 classes staggered in the immediate future.
    *   *Bug Fix Included*: Discovered a critical crash where the `CourseType` Enum (e.g., `CourseType.PILATES`) was being incorrectly typed by external scripts. Replaced hard-coded string failures with strict type-safety.
*   **Profile 3: `TestingSeeder.java` (`@Profile("seed-testing")`)**:
    *   *Execution*: A massive data-dump built to break weak logic. Spawns 5 Instructors, 15 staggered classes ranging from Deep Past to Distant Future, and 10 reservations maxing out specific class capacities.
    *   *UX Trigger*: Proves the `booking.js` script correctly identifies and hides classes where `capacity === reservedSpots`.

---

## [Phase 4] - Documentation & Aesthetic Rendering Refactoring

### Executive Summary
Establishing comprehensive technical documentation is paramount. We built an entire `/Docs` ecosystem from scratch and fixed syntax crashes internally.

### Granular Technical Changes
*   **The Quad-File Ecosystem**: Generated four massive Markdown manuals:
    1.  `Back_end.md`: Server infrastructure, Security, DB schemas.
    2.  `Front_end.md`: Vanilla DOM integration, Fetch protocol syncing.
    3.  `UI_UX.md`: Deep psychology of the 'Move Beautifully' aesthetic, handling async state responses (Loading/Error/Success).
    4.  `Workflow.md`: Architecural laws, API-first deployment sequences, mitigating vendor-lockin via generic Adapter methodologies.
*   **Mermaid Engine Diagram Fixes**:
    *   *The ER Diagram Crash*: The Mermaid rendering engine completely rejected the `Back_end.md` ER graph due to an unsupported internal constraint `UK` (Unique Key) appended to the Email field. We safely purged unsupported tags yielding a perfect visual flowchart.
    *   *The Graph Layout Collapse*: In `UI_UX.md` and `Front_end.md`, the `graph TD` flowcharts collapsed into aggressively wide, unreadable horizontal lines because their nodes were unlinked elements floating in unconnected subgraphs. We rebuilt the Mermaid code manually injecting `---` connection strings and applying rigid `["String Literals"]` to nodes containing special formatting symbols preventing any further parsing failures.

---

## [Phase 5] - Restoring Production PostgreSQL Environment

### Executive Summary
Following the `H2` development validations, the application was forcefully migrated back to rely strictly on the `docker-compose` PostgreSQL container for production readiness. Native environmental conflicts required aggressive operational triage.

### Granular Technical Changes
*   **Port 5432 TCP Collision Detection:**
    *   *Bug*: Local host machine natively ran an invisible Postgres service, completely blocking `docker-compose` from binding port `5432`.
    *   *Fix*: Modified `docker-compose.yml` to shift the exposed volume to `5433:5432`. Correspondingly updated `application.yaml` dynamically pointing Hibernate to `jdbc:postgresql://localhost:5433/...`.
*   **`ContainerConfig` Composition Parsing Crash:**
    *   *Bug*: The user's system runs legacy `docker-compose v1.29.2`. This ancient Python utility strictly crashes with `KeyError: 'ContainerConfig'` when parsing modern `postgres:16-alpine` Docker manifests.
    *   *Fix*: Immediately downgraded the target image inside `docker-compose.yml` to the stabilized `postgres:14-alpine` which gracefully parses within v1.x compositions, avoiding the need for the user to force system-level binary upgrades to Docker V2.
*   **Corrupted Container Annihilation:**
    *   *Bug*: Docker continuously attempted to merge the newly downloaded version 14 image onto the ghost remains of the failed version 16 container, causing a perpetual parsing crash.
    *   *Fix*: Evicting `docker-compose`'s control, we bypassed down to the core engine enforcing `sudo docker rm -f 8ab765a8896b_souplesse-postgres` to annihilate the corrupted state, allowing a clean DB boot via Postgres 14 connected dynamically on port 5433.
