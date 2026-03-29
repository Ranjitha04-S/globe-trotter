import { createContext, useContext, useState, useEffect } from 'react'

// ─── AuthContext ──────────────────────────────────────────────────────────────
// Global state for authentication — available to every component.
// Uses React Context so any component can call useAuth() to check login state.

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // On app load, check if user was previously logged in (token in localStorage)
  useEffect(() => {
    const token = localStorage.getItem('token')
    const name  = localStorage.getItem('name')
    const email = localStorage.getItem('email')
    if (token && email) {
      setUser({ token, name, email })
    }
    setLoading(false)
  }, [])

  // Called after successful login/register
  const login = (data) => {
    localStorage.setItem('token', data.token)
    localStorage.setItem('name',  data.name)
    localStorage.setItem('email', data.email)
    setUser({ token: data.token, name: data.name, email: data.email })
  }

  // Called when user clicks logout
  const logout = () => {
    localStorage.clear()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook — instead of useContext(AuthContext) everywhere, just call useAuth()
export const useAuth = () => useContext(AuthContext)
