# Trip Management Feature - Implementation Guide

## Overview
This implementation adds a complete trip management system with CRUD operations, search/filter functionality, and user profiles to your GlobeTrotter application.

## Backend Changes

### 1. Updated Trip Model ([backend/models/Trip.js](backend/models/Trip.js))
Added new fields to match the card design:
- `userId`: Reference to the user who created the trip
- `status`: Trip status (planning, confirmed, completed, draft)
- `stops`: Number of stops in the trip
- `travelers`: Number of travelers

### 2. Enhanced Trip Routes ([backend/routes/trip.js](backend/routes/trip.js))
Implemented complete CRUD operations with authentication:
- **POST** `/api/trips` - Create new trip (with authentication)
- **GET** `/api/trips` - Get all user trips with search/filter (with authentication)
- **GET** `/api/trips/:id` - Get single trip (with authentication)
- **PUT** `/api/trips/:id` - Update trip (with authentication)
- **DELETE** `/api/trips/:id` - Delete trip (with authentication)

Search and filter parameters:
- `search` - Search in name, destination, and description
- `status` - Filter by trip status
- `sortBy` - Sort by 'date' or 'name'

### 3. New User Routes ([backend/routes/user.js](backend/routes/user.js))
- **GET** `/api/users/profile` - Get user profile with trips and statistics
- **PUT** `/api/users/profile` - Update user profile

### 4. Updated Server ([backend/server.js](backend/server.js))
- Added static file serving for uploaded images
- Registered user routes

## Frontend Changes

### 1. New Components

#### TripCard Component ([frontend/src/components/TripCard/TripCard.jsx](frontend/src/components/TripCard/TripCard.jsx))
Reusable trip card component with:
- Trip image display with fallback
- Status badge (dynamic based on dates and status)
- Date range formatting
- Metadata (stops, travelers)
- Action buttons (View, Edit, Delete)

#### MyTrips Page ([frontend/src/pages/MyTrips.jsx](frontend/src/pages/MyTrips.jsx))
Complete trips management page with:
- Tab navigation (Upcoming, Past, Drafts)
- Search functionality
- Sort options (Date, Name)
- Grid layout with trip cards
- Create new trip button
- Empty state handling

#### Profile Page ([frontend/src/pages/Profile.jsx](frontend/src/pages/Profile.jsx))
User profile page with:
- User information display
- Edit profile functionality
- Trip statistics (Total, Upcoming, Completed, Drafts)
- User's trips display

### 2. Updated Components

#### App.jsx ([frontend/src/App.jsx](frontend/src/App.jsx))
- Added routing for MyTrips and Profile pages
- Integrated new pages with navigation

#### AddPlan Component ([frontend/src/components/addplan/addplan.jsx](frontend/src/components/addplan/addplan.jsx))
- Added new fields: status, stops, travelers
- Updated to use API service
- Fixed error handling

### 3. New Services

#### API Service ([frontend/src/services/api.js](frontend/src/services/api.js))
Centralized API client with:
- Automatic token injection
- Trip CRUD operations
- User profile operations
- Auth operations

## How to Use

### 1. Start the Backend
```bash
cd backend
npm install
npm start
```

The server will run on `http://localhost:5000`

### 2. Start the Frontend
```bash
cd frontend
npm install
npm run dev
```

The app will run on `http://localhost:5173`

### 3. Using the Application

#### Creating a Trip
1. Click on "My Trips" in the navigation
2. Click "Create New Trip" button or the "+" card
3. Fill in the trip details:
   - Trip Name
   - Destination
   - Start/End Dates
   - Budget
   - Number of Stops
   - Number of Travelers
   - Status (Planning/Confirmed/Draft/Completed)
   - Description
   - Images (optional)
4. Click "Save Trip"

#### Viewing Trips
1. Navigate to "My Trips"
2. Use tabs to filter: Upcoming, Past, or Drafts
3. Use search bar to find specific trips
4. Use sort dropdown to sort by Date or Name

#### Editing/Deleting Trips
1. Click the edit icon on a trip card
2. Or click the delete icon to remove a trip
3. Confirm deletion when prompted

#### Viewing Profile
1. Click "Profile" in the navigation
2. View your profile information and statistics
3. Click "Edit Profile" to update your name/email
4. Scroll down to see all your trips

## Important Notes

### Authentication
All trip and profile operations require authentication. Make sure:
1. User is logged in
2. Token is stored in localStorage
3. Token is included in API requests (handled automatically by api.js)

### Image Upload
- Images are stored in the `backend/uploads/` directory
- Server serves images from `/uploads` route
- Maximum 10 images per trip
- Supported formats: All image types

### Date Format
- Backend stores dates as strings
- Frontend displays formatted dates (e.g., "Nov 12 - Nov 24, 2023")
- Status badges show "X days left" for upcoming confirmed trips

### Status Badge Logic
- **Draft**: Trip status is 'draft'
- **Planning**: Trip status is 'planning'
- **Confirmed**: Trip status is 'confirmed' and start date is in the future
- **X days left**: Confirmed trip with start date approaching
- **Completed**: Trip status is 'completed' or end date has passed

## API Endpoints Reference

### Trips
```
POST   /api/trips              - Create trip (auth required)
GET    /api/trips              - Get all user trips (auth required)
GET    /api/trips/:id          - Get single trip (auth required)
PUT    /api/trips/:id          - Update trip (auth required)
DELETE /api/trips/:id          - Delete trip (auth required)
```

### Users
```
GET    /api/users/profile      - Get user profile (auth required)
PUT    /api/users/profile      - Update user profile (auth required)
```

### Auth
```
POST   /api/auth/login         - Login
POST   /api/auth/register      - Register
```

## Troubleshooting

### 401 Unauthorized Error
- Ensure user is logged in
- Check if token exists in localStorage
- Verify JWT_SECRET in backend .env file

### Images Not Loading
- Verify uploads directory exists in backend
- Check if server is serving static files
- Ensure image paths are correct in database

### Trips Not Showing
- Check if user is authenticated
- Verify userId is properly set when creating trips
- Check browser console for errors

## Next Steps

Consider implementing:
1. Trip details page
2. Edit trip modal/page
3. Image gallery viewer
4. Trip sharing functionality
5. Export trip to PDF
6. Trip itinerary builder
7. Weather integration
8. Map integration for destinations
