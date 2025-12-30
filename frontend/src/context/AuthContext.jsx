import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { apiRequest } from '../api/client'

const AuthContext = createContext(null)

const TOKEN_KEY = 'purple.auth.token'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load user on app start (page refresh)
  useEffect(() => {
    const savedToken = localStorage.getItem(TOKEN_KEY)

    if (savedToken) {
      setToken(savedToken)
      loadUser(savedToken)
    } else {
      setIsLoading(false)
    }
  }, [])

  const loadUser = async (authToken) => {
    try {
      const data = await apiRequest('/auth/me', {
        token: authToken,
      })
      setUser(data)
    } catch (error) {
      logout()
    } finally {
      setIsLoading(false)
    }
  }

  const login = async ({ email, password }) => {
    const data = await apiRequest('/auth/login', {
      method: 'POST',
      body: { email, password },
    })

    localStorage.setItem(TOKEN_KEY, data.token)
    setToken(data.token)
    await loadUser(data.token)
  }

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY)
    setUser(null)
    setToken(null)
  }

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      login,
      logout,
    }),
    [user, isLoading]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return ctx
}

export default AuthContext
