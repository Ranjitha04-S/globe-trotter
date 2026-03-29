import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../AuthContext'
import './Navbar.css'

// ─── Navbar ───────────────────────────────────────────────────────────────────
// Top navigation bar. Shows active link, user name, and logout button.
export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const isActive = (path) => location.pathname === path ? 'nav-link active' : 'nav-link'

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          ✈️ <span>GlobeTrotter</span>
        </Link>

        {/* Navigation Links */}
        <div className="navbar-links">
          <Link to="/"        className={isActive('/')}>🗺️ My Trips</Link>
          <Link to="/flights" className={isActive('/flights')}>✈️ Flights</Link>
          <Link to="/profile" className={isActive('/profile')}>👤 Profile</Link>
        </div>

        {/* User Info + Logout */}
        <div className="navbar-user">
          <span className="user-name">👋 {user?.name}</span>
          <button onClick={handleLogout} className="btn btn-outline logout-btn">
            Logout
          </button>
        </div>
      </div>
    </nav>
  )
}
