# Souplesse Pilates — Product Summary

This document serves as a high-level overview of the **Souplesse Pilates** platform. It is written to clearly explain what the software does, who it is built for, and the core value it provides, entirely free of technical jargon.

---

## 1. The Core Product
Souplesse Pilates is a digital booking and studio management platform. It operates as a modern, unified hub where clients can seamlessly discover and reserve workout classes, while empowering studio owners with the administrative tools needed to effortlessly run their business operations behind the scenes.

## 2. Key Features
*   **Smart Class Scheduling:** The platform automatically manages the passage of time. Past classes vanish from the public view, while upcoming classes are beautifully organized so clients always see exactly what is happening next.
*   **Automatic Overbooking Prevention:** The moment a class reaches its maximum physical capacity, the system instantly stops accepting reservations, protecting the studio from overcrowded sessions without requiring manual oversight.
*   **Centralized Studio Management:** A secure, digital command center where studio owners can instantly publish new classes to the calendar and track exactly who is attending.
*   **Beautiful Desktop & Mobile Experience:** A calm, premium interface designed exclusively around the "Move Beautifully" aesthetic, ensuring clients feel a sense of luxury before they even step foot in the studio.

## 3. The Three Core Pages
The platform is built elegantly across three main destinations:
1.  **The Public Studio Page:** This is the public face of the business. Clients browse here to see the schedule, read class descriptions, and book their spots.
2.  **The Secure Entry Gate:** A hidden login page accessible only to authorized staff. Staff must use their email and secure passwords here to prove their identity.
3.  **The Management Portal:** A private tracking dashboard. Once logged in, this is where instructors and owners oversee class capacities, view the names of clients attending, and create new scheduling events.

## 4. Who Is This Built For?

| Target Audience | Their Goal | How They Access It |
| :--- | :--- | :--- |
| **Studio Clients** | To find balance, view upcoming schedules, and reserve their spot in an exercise class. | They simply visit the public website. No account creation required, making booking instantly frictionless. |
| **Studio Staff & Owners** | To run the business, control the calendar, and track attendance. | Requires highly secured, private credentials assigned by the studio owner. |

## 5. What Information Does the System Manage?
The platform safely tracks three core pillars of the business:
*   **Staff Profiles:** The names, emails, and security clearance roles of the instructors running the platform.
*   **Class Schedules:** Prices, dates, times, types of workouts (Yoga, Pilates), and the maximum number of people allowed in a room.
*   **Client Reservations:** The names and emails of the clients who have claimed a spot on the calendar for a specific class.

---

## 6. Client Experience Flow

The following diagram demonstrates exactly how a typical client interacts with the platform from start to finish.

```mermaid
sequenceDiagram
    participant Client
    participant Website
    participant Business Engine

    %% Client Booking Flow
    Client->>Website: Visits the Souplesse homepage
    Website->>Business Engine: Requests the upcoming schedule
    Business Engine-->>Website: Delivers the active classes
    Website-->>Client: Displays beautiful class cards
    
    Client->>Website: Clicks "Réserver" & Enters Name/Email
    Website->>Business Engine: Submits the reservation request
    Business Engine-->>Website: Approves the booking and holds the spot
    Website-->>Client: Displays a success message thanking them
```

## 7. Staff Management Flow

This flow tracks how an authorized instructor operates within the system.

```mermaid
sequenceDiagram
    participant Staff Member
    participant Login Gate
    participant Dashboard Portal
    participant Business Engine

    %% Admin Workflow
    Staff Member->>Dashboard Portal: Attempts to view the private tracking site
    Dashboard Portal->>Login Gate: Reroutes them (Must prove identity first)
    
    Staff Member->>Login Gate: Enters authorized email and password
    Login Gate->>Business Engine: Verifies the security credentials
    Business Engine-->>Login Gate: Hands over the secure "Keys"
    Login Gate-->>Dashboard Portal: Unlocks the private portal
    
    Dashboard Portal->>Business Engine: Requests the list of all clients who booked today
    Business Engine-->>Dashboard Portal: Delivers the private attendance lists
    Dashboard Portal-->>Staff Member: Displays all reservations for the day
```

---

## 8. Site Map

This diagram illustrates the simple layout of the entire product. Notice how the public is completely separated from the private operations center.

```mermaid
graph TD
    %% Public Side
    Home["Home Page (Public Studio Site)"]
    Home --> Browse["Browse Upcoming Classes"]
    Browse --> Book["Submit Reservation Data"]
    
    %% Hidden Connection
    Home -.->|Hidden Link for Staff| Gate["Secure Entry Gate"]

    %% Private Admin Side
    subgraph Private Operations Center
        Gate --> Dashboard["The Management Portal"]
        Dashboard --> Add["Add New Classes to Calendar"]
        Dashboard --> View["View & Count Client Attendance"]
    end
```
