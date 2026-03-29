import { useState, useEffect } from 'react'
import { userAPI } from '../services/api'
import './Profile.css'

// ─── Profile Page ─────────────────────────────────────────────────────────────
// Shows user info with trip stats. Allows editing name, phone, and bio.
export default function Profile() {
  const [profile, setProfile] = useState(null)
  const [editing, setEditing] = useState(false)
  const [form, setForm]       = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving]   = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    userAPI.getProfile().then(res => {
      setProfile(res.data)
      setForm({ name: res.data.name, phone: res.data.phone, bio: res.data.bio })
    }).finally(() => setLoading(false))
  }, [])

  const handleSave = async () => {
    setSaving(true)
    setMessage('')
    try {
      await userAPI.updateProfile(form)
      setProfile({ ...profile, ...form })
      setMessage('✅ Profile updated!')
      setEditing(false)
    } catch {
      setMessage('❌ Failed to save. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="loading">Loading profile...</div>

  return (
    <div className="page">
      <h1>👤 My Profile</h1>

      <div className="profile-grid">

        {/* ── Profile Card ──────────────────────────────────────────────── */}
        <div className="card profile-card">
          <div className="avatar">
            {profile.name?.charAt(0).toUpperCase()}
          </div>

          {editing ? (
            <div className="profile-edit-form">
              <div className="form-group">
                <label>Full Name</label>
                <input value={form.name || ''} onChange={e => setForm({...form, name: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input value={form.phone || ''} placeholder="+91 9999999999" onChange={e => setForm({...form, phone: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Bio</label>
                <textarea rows={3} value={form.bio || ''} placeholder="Tell us about yourself..." onChange={e => setForm({...form, bio: e.target.value})} />
              </div>

              {message && <p className={message.startsWith('✅') ? 'success-msg' : 'error-msg'}>{message}</p>}

              <div className="profile-actions">
                <button className="btn btn-outline" onClick={() => { setEditing(false); setMessage('') }}>Cancel</button>
                <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                  {saving ? 'Saving...' : '💾 Save'}
                </button>
              </div>
            </div>
          ) : (
            <div className="profile-info">
              <h2>{profile.name}</h2>
              <p className="profile-email">📧 {profile.email}</p>
              {profile.phone && <p className="profile-detail">📞 {profile.phone}</p>}
              {profile.bio   && <p className="profile-bio">{profile.bio}</p>}
              <p className="profile-joined">Member since {new Date(profile.joinedAt).toLocaleDateString('en-IN', {month:'long', year:'numeric'})}</p>

              {message && <p className="success-msg">{message}</p>}

              <button className="btn btn-outline edit-profile-btn" onClick={() => setEditing(true)}>
                ✏️ Edit Profile
              </button>
            </div>
          )}
        </div>

        {/* ── Stats Card ────────────────────────────────────────────────── */}
        <div className="stats-section">
          <h2>📊 My Travel Stats</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">{profile.stats?.totalTrips || 0}</div>
              <div className="stat-label">Total Trips</div>
            </div>
            <div className="stat-card completed">
              <div className="stat-number">{profile.stats?.completedTrips || 0}</div>
              <div className="stat-label">Completed</div>
            </div>
            <div className="stat-card planned">
              <div className="stat-number">{profile.stats?.plannedTrips || 0}</div>
              <div className="stat-label">Planning</div>
            </div>
          </div>

          {/* Tips / Info box */}
          <div className="card tips-card">
            <h3>✈️ Quick Tips</h3>
            <ul>
              <li>Create a trip first, then attach flights to it.</li>
              <li>Use the <strong>Flight Search</strong> page to pick seats.</li>
              <li>Trip status updates automatically based on dates.</li>
              <li>Add stops to track your multi-city itinerary.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
