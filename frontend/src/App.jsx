import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './AuthContext'
import Navbar from './components/Navbar/Navbar'
import Login from './pages/Login'
import Register from './pages/Register'
import MyTrips from './pages/MyTrips'
import TripDetail from './pages/TripDetail'
import CreateTrip from './pages/CreateTrip'
import Profile from './pages/Profile'
import FlightSearch from './pages/FlightSearch'
import './App.css'

// ─── Protected Route ──────────────────────────────────────────────────────────
// Wraps pages that require login. Redirects to /login if not authenticated.
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="loading">Loading...</div>
  return user ? children : <Navigate to="/login" replace />
}

// ─── App Router ───────────────────────────────────────────────────────────────
function AppRoutes() {
  const { user } = useAuth()

  return (
    <>
      {user && <Navbar />}
      <Routes>
        {/* Public routes */}
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes (need login) */}
        <Route path="/" element={
          <ProtectedRoute><MyTrips /></ProtectedRoute>
        } />
        <Route path="/trips/new" element={
          <ProtectedRoute><CreateTrip /></ProtectedRoute>
        } />
        <Route path="/trips/:id" element={
          <ProtectedRoute><TripDetail /></ProtectedRoute>
        } />
        <Route path="/flights" element={
          <ProtectedRoute><FlightSearch /></ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute><Profile /></ProtectedRoute>
        } />

        {/* Fallback: unknown URLs go to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  )
}
