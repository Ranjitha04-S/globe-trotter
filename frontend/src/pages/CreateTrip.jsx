import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { tripsAPI } from '../services/api'
import './CreateTrip.css'

// ─── CreateTrip Page ──────────────────────────────────────────────────────────
// Form to create a new trip. All fields except title and destination are optional.
export default function CreateTrip() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  const [form, setForm] = useState({
    title:          '',
    destination:    '',
    description:    '',
    startDate:      '',
    endDate:        '',
    budget:         '',
    totalTravelers: '',
    stops:          '',
    status:         'PLANNING',
  })

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      // Build payload — only include non-empty fields
      const payload = { ...form }
      if (!payload.budget)         delete payload.budget
      if (!payload.totalTravelers) delete payload.totalTravelers
      if (!payload.startDate)      delete payload.startDate
      if (!payload.endDate)        delete payload.endDate

      const res = await tripsAPI.create(payload)
      navigate(`/trips/${res.data.id}`)   // Go to the new trip's detail page
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create trip.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page">
      <div className="create-trip-header">
        <button onClick={() => navigate(-1)} className="btn btn-outline back-btn">← Back</button>
        <h1>➕ Create New Trip</h1>
      </div>

      <div className="create-trip-form card">
        <form onSubmit={handleSubmit}>

          {/* ── Basic Info ─────────────────────────────────────────────────── */}
          <section className="form-section">
            <h2>🗺️ Basic Info</h2>
            <div className="form-row">
              <div className="form-group">
                <label>Trip Title *</label>
                <input name="title" placeholder="e.g. Summer Europe Tour" value={form.title} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Destination *</label>
                <input name="destination" placeholder="e.g. Paris, France" value={form.destination} onChange={handleChange} required />
              </div>
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea name="description" rows={3} placeholder="Describe your trip..." value={form.description} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Stops (comma-separated)</label>
              <input name="stops" placeholder="e.g. London, Amsterdam, Berlin" value={form.stops} onChange={handleChange} />
            </div>
          </section>

          {/* ── Dates & Budget ─────────────────────────────────────────────── */}
          <section className="form-section">
            <h2>📅 Dates & Budget</h2>
            <div className="form-row">
              <div className="form-group">
                <label>Start Date</label>
                <input type="date" name="startDate" value={form.startDate} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>End Date</label>
                <input type="date" name="endDate" value={form.endDate} onChange={handleChange} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Budget (₹)</label>
                <input type="number" name="budget" placeholder="e.g. 50000" value={form.budget} onChange={handleChange} min="0" />
              </div>
              <div className="form-group">
                <label>Total Travelers</label>
                <input type="number" name="totalTravelers" placeholder="e.g. 2" value={form.totalTravelers} onChange={handleChange} min="1" />
              </div>
            </div>
          </section>

          {/* ── Status ─────────────────────────────────────────────────────── */}
          <section className="form-section">
            <h2>🏷️ Status</h2>
            <div className="form-group">
              <label>Trip Status</label>
              <select name="status" value={form.status} onChange={handleChange}>
                <option value="PLANNING">Planning</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="ONGOING">Ongoing</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
          </section>

          {error && <p className="error-msg">{error}</p>}

          <div className="form-actions">
            <button type="button" className="btn btn-outline" onClick={() => navigate(-1)}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Creating...' : '✅ Create Trip'}
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}
