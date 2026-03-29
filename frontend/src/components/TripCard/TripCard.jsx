import { Link } from 'react-router-dom'
import './TripCard.css'

// ─── TripCard ─────────────────────────────────────────────────────────────────
// Displays a single trip in a card layout.
// Props: trip (object), onDelete (function)
export default function TripCard({ trip, onDelete }) {
  // Calculate how many days until the trip starts
  const getDaysLeft = () => {
    if (!trip.startDate) return null
    const today = new Date()
    const start = new Date(trip.startDate)
    const diff  = Math.ceil((start - today) / (1000 * 60 * 60 * 24))
    if (diff > 0)  return `${diff} days left`
    if (diff === 0) return 'Today!'
    return null
  }

  const daysLeft = getDaysLeft()

  return (
    <div className="trip-card">
      {/* Cover image or placeholder */}
      <div className="trip-card-image">
        {trip.coverImage
          ? <img src={trip.coverImage} alt={trip.title} />
          : <div className="trip-card-placeholder">🌍</div>
        }
        <span className={`badge badge-${trip.status}`}>{trip.status}</span>
      </div>

      <div className="trip-card-body">
        <h3 className="trip-title">{trip.title}</h3>
        <p className="trip-destination">📍 {trip.destination}</p>

        {/* Dates */}
        {trip.startDate && (
          <p className="trip-dates">
            📅 {new Date(trip.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            {trip.endDate && ` → ${new Date(trip.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`}
          </p>
        )}

        {/* Budget and travelers */}
        <div className="trip-meta">
          {trip.budget      && <span>💰 ₹{trip.budget.toLocaleString()}</span>}
          {trip.totalTravelers && <span>👥 {trip.totalTravelers} travelers</span>}
          {daysLeft         && <span className="days-left">⏳ {daysLeft}</span>}
        </div>

        {/* Stops */}
        {trip.stops && (
          <p className="trip-stops">🛑 {trip.stops}</p>
        )}
      </div>

      {/* Action buttons */}
      <div className="trip-card-actions">
        <Link to={`/trips/${trip.id}`} className="btn btn-primary">View Details</Link>
        <button
          onClick={() => onDelete(trip.id)}
          className="btn btn-outline"
          style={{ color: 'var(--danger)', borderColor: 'var(--danger)' }}
        >
          Delete
        </button>
      </div>
    </div>
  )
}
