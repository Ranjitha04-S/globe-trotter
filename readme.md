# 🌍 GlobeTrotter — Smart Trip Management App
 
> Plan, organize, and manage your trips — all in one place.
 
![React](https://img.shields.io/badge/React-Vite-61DAFB?style=flat&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat&logo=nodedotjs)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?style=flat&logo=mongodb)
![Hackathon](https://img.shields.io/badge/Odoo-Hackathon-714B67?style=flat)
 
---
 
## 🎥 Demo
 
> 📽️ [Watch Demo Video](https://drive.google.com/file/d/1NfGifa8GVctGAehlwY8HAZlU1SAauawq/view?usp=sharing)
 
---
 
## 💡 About the Project
 
GlobeTrotter is a full-stack trip management web application that allows users to create, organize, and track their travel plans with ease. Built as part of the **Odoo Hackathon**, it features a clean dashboard, smart status tracking, and a complete profile system — all backed by a secure REST API.
 
---
 
## ✨ Features
 
- 🗺️ **Trip Dashboard** — View all trips in a clean card layout with status badges
- ➕ **Create & Manage Trips** — Add destination, dates, budget, stops, travelers & images
- 🔍 **Search & Filter** — Find trips by name, destination, or status
- 📁 **Tab Navigation** — Switch between Upcoming, Past, and Draft trips
- 👤 **User Profile** — View stats, edit profile info, and see all trips in one place
- 🏷️ **Smart Status Badges** — Auto-calculates: Planning, Confirmed, X Days Left, Completed
- 🔒 **Authentication** — Secure login/register with JWT token-based auth
- 🖼️ **Image Upload** — Attach up to 10 images per trip
 
---
 
## 🛠 Tech Stack
 
| Layer | Technology |
|---|---|
| Frontend | React + Vite |
| Backend | Node.js + Express |
| Database | MongoDB + Mongoose |
| Auth | JWT (JSON Web Tokens) |
| File Upload | Multer |
| Styling | CSS Modules |
 
---
 
## 📁 Project Structure
 
```
GlobeTrotter/
├── backend/
│   ├── models/
│   │   └── Trip.js           # Trip schema (status, stops, travelers)
│   ├── routes/
│   │   ├── trip.js           # Trip CRUD endpoints
│   │   ├── user.js           # Profile endpoints
│   │   └── auth.js           # Login / Register
│   ├── uploads/              # Uploaded trip images
│   └── server.js             # Express server setup
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── TripCard/     # Reusable trip card
│       │   └── addplan/      # Create trip form
│       ├── pages/
│       │   ├── MyTrips.jsx   # Trips dashboard
│       │   └── Profile.jsx   # User profile page
│       ├── services/
│       │   └── api.js        # Centralized API client
│       └── App.jsx
└── README.md
```
 
---
 
## 🚀 Quick Start
 
### 1. Clone the repo
```bash
git clone https://github.com/Ranjitha04-S/GlobeTrotter.git
cd GlobeTrotter
```
 
### 2. Backend Setup
```bash
cd backend
npm install
```
 
Create `.env` file:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```
 
```bash
npm start
```
 
### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
 
- Backend runs on `http://localhost:5000`
- Frontend runs on `http://localhost:5173`
 
---
 
## 🔌 API Endpoints
 
### Trips
```
POST   /api/trips           Create a trip
GET    /api/trips           Get all user trips (search & filter)
GET    /api/trips/:id       Get single trip
PUT    /api/trips/:id       Update trip
DELETE /api/trips/:id       Delete trip
```
 
### Users
```
GET    /api/users/profile   Get profile + stats
PUT    /api/users/profile   Update profile
```
 
### Auth
```
POST   /api/auth/register   Register
POST   /api/auth/login      Login
```
 
---
 
## 🏆 Built For
 
**Odoo Hackathon** — Built by a team of 4 members.
 
---
 
## 👩‍💻 Team
 
| Member | Role |
|---|---|
| Ranjitha S | Team Member |
| Member 2 | Team Member |
| Member 3 | Team Member |
| Member 4 | Team Member |
 
---
 
> 💬 *"Not fully polished, but built with full effort as a team."*
