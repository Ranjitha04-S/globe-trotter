import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { tripsAPI, flightsAPI } from '../services/api'
import './TripDetail.css'

// ─── TripDetail Page ──────────────────────────────────────────────────────────
// Shows full details of one trip and its associated flight bookings.
// Also allows editing trip status inline.
export default function TripDetail() {
  const { id }    = useParams()         // Get trip ID from URL /trips/:id
  const navigate  = useNavigate()

  const [trip, setTrip]         = useState(null)
  const [bookings, setBookings] = useState([])
  const [loading, setLoading]   = useState(true)
  const [editing, setEditing]   = useState(false)
  const [editForm, setEditForm] = useState({})
  const [saveLoading, setSaveLoading] = useState(false)
  const [error, setError]       = useState('')

  // Load trip details and flight bookings
  useEffect(() => {
    const load = async () => {
      try {
        const [tripRes, bookingRes] = await Promise.all([
          tripsAPI.getById(id),
          flightsAPI.getBookings(id),
        ])
        setTrip(tripRes.data)
        setEditForm(tripRes.data)
        setBookings(bookingRes.data)
      } catch (err) {
        setError('Trip not found.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  // Save edits
  const handleSave = async () => {
    setSaveLoading(true)
    try {
      const res = await tripsAPI.update(id, {
        title:          editForm.title,
        destination:    editForm.destination,
        description:    editForm.description,
        startDate:      editForm.startDate,
        endDate:        editForm.endDate,
        budget:         editForm.budget,
        totalTravelers: editForm.totalTravelers,
        stops:          editForm.stops,
        status:         editForm.status,
      })
      setTrip(res.data)
      setEditing(false)
    } catch {
      setError('Failed to save changes.')
    } finally {
      setSaveLoading(false)
    }
  }

  // Cancel flight booking
  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Cancel this flight booking?')) return
    await flightsAPI.cancel(bookingId)
    setBookings(bookings.filter(b => b.id !== bookingId))
  }

  if (loading) return <div className="loading">Loading trip details...</div>
  if (error)   return <div className="page"><p className="error-msg">{error}</p></div>

  return (
    <div className="page">

      {/* ── Back + Actions ─────────────────────────────────────────────────── */}
      <div className="detail-topbar">
        <button onClick={() => navigate('/')} className="btn btn-outline back-btn">← Back</button>
        <div className="detail-actions">
          {editing ? (
            <>
              <button onClick={() => setEditing(false)} className="btn btn-outline">Cancel</button>
              <button onClick={handleSave} className="btn btn-primary" disabled={saveLoading}>
                {saveLoading ? 'Saving...' : '💾 Save'}
              </button>
            </>
          ) : (
            <button onClick={() => setEditing(true)} className="btn btn-outline">✏️ Edit</button>
          )}
        </div>
      </div>

      {/* ── Trip Header ────────────────────────────────────────────────────── */}
      <div className="card detail-header">
        {editing ? (
          <div className="edit-fields">
            <input className="edit-title-input" value={editForm.title || ''} onChange={e => setEditForm({...editForm, title: e.target.value})} />
            <input className="edit-dest-input" value={editForm.destination || ''} onChange={e => setEditForm({...editForm, destination: e.target.value})} />
          </div>
        ) : (
          <>
            <h1 className="detail-title">{trip.title}</h1>
            <p className="detail-destination">📍 {trip.destination}</p>
          </>
        )}
        <span className={`badge badge-${trip.status}`}>{trip.status}</span>
      </div>

      <div className="detail-grid">

        {/* ── Trip Info ──────────────────────────────────────────────────── */}
        <div className="card detail-info">
          <h2>Trip Details</h2>

          {editing ? (
            <div className="edit-form-grid">
              <div className="form-group"><label>Start Date</label>
                <input type="date" value={editForm.startDate || ''} onChange={e => setEditForm({...editForm, startDate: e.target.value})} />
              </div>
              <div className="form-group"><label>End Date</label>
                <input type="date" value={editForm.endDate || ''} onChange={e => setEditForm({...editForm, endDate: e.target.value})} />
              </div>
              <div className="form-group"><label>Budget (₹)</label>
                <input type="number" value={editForm.budget || ''} onChange={e => setEditForm({...editForm, budget: e.target.value})} />
              </div>
              <div className="form-group"><label>Travelers</label>
                <input type="number" value={editForm.totalTravelers || ''} onChange={e => setEditForm({...editForm, totalTravelers: e.target.value})} />
              </div>
              <div className="form-group" style={{gridColumn:'1/-1'}}><label>Stops</label>
                <input value={editForm.stops || ''} onChange={e => setEditForm({...editForm, stops: e.target.value})} />
              </div>
              <div className="form-group" style={{gridColumn:'1/-1'}}><label>Status</label>
                <select value={editForm.status || 'PLANNING'} onChange={e => setEditForm({...editForm, status: e.target.value})}>
                  {['PLANNING','CONFIRMED','ONGOING','COMPLETED','CANCELLED'].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="form-group" style={{gridColumn:'1/-1'}}><label>Description</label>
                <textarea rows={3} value={editForm.description || ''} onChange={e => setEditForm({...editForm, description: e.target.value})} />
              </div>
            </div>
          ) : (
            <div className="info-list">
              {trip.startDate && <div className="info-row"><span>📅 Dates</span><span>{new Date(trip.startDate).toLocaleDateString('en-IN')} → {trip.endDate ? new Date(trip.endDate).toLocaleDateString('en-IN') : '?'}</span></div>}
              {trip.budget      && <div className="info-row"><span>💰 Budget</span><span>₹{trip.budget.toLocaleString()}</span></div>}
              {trip.totalTravelers && <div className="info-row"><span>👥 Travelers</span><span>{trip.totalTravelers}</span></div>}
              {trip.stops       && <div className="info-row"><span>🛑 Stops</span><span>{trip.stops}</span></div>}
              {trip.description && <div className="info-row desc"><span>📝 Notes</span><span>{trip.description}</span></div>}
            </div>
          )}
        </div>

        {/* ── Flight Bookings ────────────────────────────────────────────── */}
        <div className="card detail-flights">
          <div className="flights-header">
            <h2>✈️ Flight Bookings</h2>
            <button onClick={() => navigate('/flights')} className="btn btn-primary" style={{fontSize:'13px', padding:'6px 14px'}}>
              + Add Flight
            </button>
          </div>

          {bookings.length === 0 ? (
            <div className="no-flights">
              <p>No flights booked yet.</p>
              <button onClick={() => navigate('/flights')} className="btn btn-outline">Search Flights</button>
            </div>
          ) : (
            <div className="booking-list">
              {bookings.map(b => (
                <div key={b.id} className="booking-item">
                  <div className="booking-route">
                    <strong>{b.fromCity}</strong>
                    <span className="route-arrow">✈️</span>
                    <strong>{b.toCity}</strong>
                  </div>
                  <div className="booking-meta">
                    <span>🪑 Seat {b.seatNumber}</span>
                    <span className={`seat-class-badge ${b.seatClass}`}>{b.seatClass}</span>
                    <span>👤 {b.passengerName}</span>
                    <span>💰 ₹{b.price?.toLocaleString()}</span>
                    <span className={`badge badge-${b.bookingStatus === 'CONFIRMED' ? 'CONFIRMED' : 'CANCELLED'}`}>{b.bookingStatus}</span>
                  </div>
                  {b.bookingStatus === 'CONFIRMED' && (
                    <button onClick={() => handleCancelBooking(b.id)} className="btn btn-outline cancel-booking-btn">
                      Cancel
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {error && <p className="error-msg" style={{marginTop:'16px'}}>{error}</p>}
    </div>
  )
}
