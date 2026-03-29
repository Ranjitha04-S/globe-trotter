import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { tripsAPI } from '../services/api'
import TripCard from '../components/TripCard/TripCard'
import './MyTrips.css'

// ─── MyTrips Page ─────────────────────────────────────────────────────────────
// Main dashboard — shows all user trips in a card grid.
// Supports search, status filter, and tab navigation.
export default function MyTrips() {
  const [trips, setTrips]     = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch]   = useState('')
  const [activeTab, setActiveTab] = useState('ALL') // ALL, PLANNING, CONFIRMED, COMPLETED

  // Load trips on mount
  useEffect(() => {
    loadTrips()
  }, [])

  const loadTrips = async (searchVal = '', statusVal = '') => {
    setLoading(true)
    try {
      const params = {}
      if (searchVal) params.search = searchVal
      if (statusVal && statusVal !== 'ALL') params.status = statusVal
      const res = await tripsAPI.getAll(params)
      setTrips(res.data)
    } catch (err) {
      console.error('Failed to load trips:', err)
    } finally {
      setLoading(false)
    }
  }

  // Handle search input (debounce would be nice, but keeping it simple)
  const handleSearch = (e) => {
    const val = e.target.value
    setSearch(val)
    loadTrips(val, activeTab)
  }

  // Handle tab switch
  const handleTabChange = (tab) => {
    setActiveTab(tab)
    loadTrips(search, tab)
  }

  // Delete a trip
  const handleDelete = async (tripId) => {
    if (!window.confirm('Delete this trip? This cannot be undone.')) return
    try {
      await tripsAPI.delete(tripId)
      setTrips(trips.filter(t => t.id !== tripId))
    } catch (err) {
      alert('Failed to delete trip.')
    }
  }

  const tabs = ['ALL', 'PLANNING', 'CONFIRMED', 'ONGOING', 'COMPLETED']

  return (
    <div className="page">
      {/* Header */}
      <div className="trips-header">
        <div>
          <h1>🗺️ My Trips</h1>
          <p>{trips.length} trip{trips.length !== 1 ? 's' : ''} found</p>
        </div>
        <Link to="/trips/new" className="btn btn-primary">
          ➕ New Trip
        </Link>
      </div>

      {/* Search */}
      <input
        type="text"
        className="search-bar"
        placeholder="🔍 Search trips by name or destination..."
        value={search}
        onChange={handleSearch}
      />

      {/* Status Tabs */}
      <div className="tabs">
        {tabs.map(tab => (
          <button
            key={tab}
            className={`tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => handleTabChange(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Trips Grid */}
      {loading ? (
        <div className="loading">Loading your trips...</div>
      ) : trips.length === 0 ? (
        <div className="empty-state">
          <p>🌍</p>
          <h3>No trips yet!</h3>
          <p>Start by creating your first adventure.</p>
          <Link to="/trips/new" className="btn btn-primary">Create Trip</Link>
        </div>
      ) : (
        <div className="trips-grid">
          {trips.map(trip => (
            <TripCard key={trip.id} trip={trip} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  )
}
