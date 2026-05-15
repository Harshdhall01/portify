import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Load user from localStorage on app start
  useEffect(() => {
    const storedUser = localStorage.getItem('portify_user')
    const storedToken = localStorage.getItem('portify_token')
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const login = (userData) => {
    localStorage.setItem('portify_token', userData.token)
    localStorage.setItem('portify_user', JSON.stringify({
      _id: userData._id,
      name: userData.name,
      email: userData.email
    }))
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem('portify_token')
    localStorage.removeItem('portify_user')
    localStorage.removeItem('portify_template')
    localStorage.removeItem('portify_last_template')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthContext