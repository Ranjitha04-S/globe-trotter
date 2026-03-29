import axios from 'axios'

// ─── API Client ───────────────────────────────────────────────────────────────
// All API calls go through this single axios instance.
// It automatically attaches the JWT token to every request.
const api = axios.create({
  baseURL: '/api',   // Vite proxy routes this to http://localhost:8080/api
  headers: { 'Content-Type': 'application/json' }
})

// ─── Request Interceptor ──────────────────────────────────────────────────────
// Before EVERY request, attach the JWT token from localStorage.
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ─── Response Interceptor ─────────────────────────────────────────────────────
// If we get a 401 (Unauthorized), token expired → redirect to login.
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.clear()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// ─── Auth API ─────────────────────────────────────────────────────────────────
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login:    (data) => api.post('/auth/login', data),
}

// ─── Trips API ────────────────────────────────────────────────────────────────
export const tripsAPI = {
  getAll:   (params) => api.get('/trips', { params }),          // ?search=x&status=y
  getById:  (id)     => api.get(`/trips/${id}`),
  create:   (data)   => api.post('/trips', data),
  update:   (id, data) => api.put(`/trips/${id}`, data),
  delete:   (id)     => api.delete(`/trips/${id}`),
}

// ─── Flights API ──────────────────────────────────────────────────────────────
export const flightsAPI = {
  search:      (from, to) => api.get('/flights/search', { params: { from, to } }),
  getSeatMap:  (flightId) => api.get(`/flights/${flightId}/seats`),
  bookSeat:    (data)     => api.post('/flights/book-seat', data),
  getBookings: (tripId)   => api.get(`/flights/bookings/trip/${tripId}`),
  cancel:      (bookingId) => api.delete(`/flights/bookings/${bookingId}`),
}

// ─── User API ─────────────────────────────────────────────────────────────────
export const userAPI = {
  getProfile:    ()     => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
}

export default api
