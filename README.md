# ✈️ GlobeTrotter — Java Full-Stack Trip Management App

A full-stack travel management web app built with **Spring Boot + React**, featuring JWT authentication, trip CRUD, and an **interactive flight seat arrangement system**.

---

## 🛠 Tech Stack

| Layer       | Technology                  |
|-------------|-----------------------------|
| Backend     | Java 17 + Spring Boot 3.2   |
| Database    | MySQL 8                     |
| Auth        | JWT (JSON Web Tokens)       |
| Frontend    | React 18 + Vite             |
| HTTP Client | Axios                       |
| Styling     | Plain CSS (no frameworks)   |

---

## 📁 Project Structure

```
GlobeTrotter/
├── backend/
│   ├── pom.xml                          # Maven dependencies
│   └── src/main/java/com/globetrotter/
│       ├── GlobeTrotterApplication.java # App entry point
│       ├── model/
│       │   ├── User.java                # User entity
│       │   ├── Trip.java                # Trip entity
│       │   ├── Flight.java              # Available flights
│       │   └── FlightBooking.java       # Seat bookings
│       ├── repository/
│       │   ├── UserRepository.java
│       │   ├── TripRepository.java      # With search queries
│       │   ├── FlightRepository.java
│       │   └── FlightBookingRepository.java
│       ├── controller/
│       │   ├── AuthController.java      # POST /api/auth/register|login
│       │   ├── TripController.java      # CRUD /api/trips
│       │   ├── FlightController.java    # Search, seat map, booking
│       │   └── UserController.java      # Profile
│       ├── security/
│       │   ├── JwtUtil.java             # Token create/validate
│       │   ├── JwtAuthFilter.java       # Per-request token check
│       │   └── SecurityConfig.java      # Route permissions, CORS
│       └── service/
│           └── DataSeeder.java          # Seeds sample flights on startup
│
└── frontend/
    ├── index.html
    ├── vite.config.js
    └── src/
        ├── main.jsx
        ├── App.jsx                      # Router + protected routes
        ├── App.css                      # Global styles
        ├── AuthContext.jsx              # Global login state
        ├── services/
        │   └── api.js                   # All API calls (axios)
        ├── components/
        │   ├── Navbar/
        │   ├── TripCard/                # Trip summary card
        │   └── SeatMap/                 # ✈️ Aircraft seat grid
        └── pages/
            ├── Login.jsx
            ├── Register.jsx
            ├── MyTrips.jsx              # Dashboard
            ├── CreateTrip.jsx
            ├── TripDetail.jsx           # View + edit + bookings
            ├── FlightSearch.jsx         # Search → SeatMap → Book
            └── Profile.jsx
```

---

## 🚀 Quick Start

### Prerequisites
- Java 17+
- Maven 3.8+
- MySQL 8 running locally
- Node.js 18+

---

### 1️⃣ Database Setup

Create the database (Spring will create the tables automatically):

```sql
CREATE DATABASE globetrotter;
```

---

### 2️⃣ Backend Setup

```bash
cd backend
```

Edit `src/main/resources/application.properties`:
```properties
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD
```

Run the backend:
```bash
mvn spring-boot:run
```

✅ Backend starts at **http://localhost:8080**  
✅ Sample flights are **auto-seeded** on first startup

---

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

✅ Frontend starts at **http://localhost:5173**

---

## 🔌 API Endpoints

### Auth (Public)
```
POST /api/auth/register    { name, email, password }
POST /api/auth/login       { email, password }
```

### Trips (Requires JWT)
```
GET    /api/trips                   Get all (optional ?search=&status=)
GET    /api/trips/:id               Get one trip
POST   /api/trips                   Create trip
PUT    /api/trips/:id               Update trip
DELETE /api/trips/:id               Delete trip
```

### Flights
```
GET  /api/flights/search?from=&to=          Search flights (public)
GET  /api/flights/:id/seats                 Get seat map for a flight
POST /api/flights/book-seat                 Book a seat
GET  /api/flights/bookings/trip/:tripId     Get bookings for a trip
DEL  /api/flights/bookings/:id             Cancel a booking
```

### Users (Requires JWT)
```
GET /api/users/profile     Get profile + stats
PUT /api/users/profile     Update profile
```

---

## 🪑 Flight Seat Arrangement

The seat map is fully dynamic:

| Rows  | Class    | Color  |
|-------|----------|--------|
| 1–3   | First    | Pink   |
| 4–8   | Business | Yellow |
| 9–30  | Economy  | Blue   |

- 6 seats per row: **A B C | aisle | D E F**
- Booked seats are **greyed out** and unclickable
- Selected seat is highlighted in **blue**
- Filter by class (First / Business / Economy)
- Real-time booking updates seat map

---

## 🏷️ Trip Status Flow

```
PLANNING → CONFIRMED → ONGOING → COMPLETED
                    ↘ CANCELLED
```

---

## 🔐 Authentication Flow

1. User registers → password BCrypt hashed → JWT token returned
2. React stores token in `localStorage`
3. Every API request sends `Authorization: Bearer <token>`
4. Backend `JwtAuthFilter` validates token on each request
5. Token expires after 24 hours

---

## 💡 Key Design Decisions (Easy to Understand)

- **No complex service layer** — logic stays in controllers for clarity
- **Inner DTO classes** — request/response models defined right next to the endpoint that uses them
- **Spring Data JPA** — no raw SQL; method names auto-generate queries
- **Lombok `@Data`** — auto-generates getters/setters so entities stay clean
- **DataSeeder** — real data ready to use from the first run, no manual DB inserts needed
- **Vite proxy** — frontend calls `/api/...`, Vite routes it to `localhost:8080`, no CORS hassle in dev

---

## 👩‍💻 Team

| Member    | Role             |
|-----------|------------------|
| Member 1  | Backend (Java)   |
| Member 2  | Backend (Java)   |
| Member 3  | Frontend (React) |
| Member 4  | Frontend (React) |
