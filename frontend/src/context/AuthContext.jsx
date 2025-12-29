import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const AuthContext = createContext(null)

const STORAGE_KEY = 'purple.auth.user'

export function AuthProvider({ children }) {
	const [user, setUser] = useState(null)
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		try {
			const raw = localStorage.getItem(STORAGE_KEY)
			setUser(raw ? JSON.parse(raw) : null)
		} catch {
			setUser(null)
		} finally {
			setIsLoading(false)
		}
	}, [])

	const login = async ({ email, role } = {}) => {
		const fakeUser = {
			id: 'fake-user-1',
			email: email || 'demo@example.com',
			name: 'Demo User',
			role: role || 'user',
		}

		setUser(fakeUser)
		localStorage.setItem(STORAGE_KEY, JSON.stringify(fakeUser))
		return fakeUser
	}

	const logout = () => {
		setUser(null)
		localStorage.removeItem(STORAGE_KEY)
	}

	const value = useMemo(
		() => ({
			user,
			isAuthenticated: Boolean(user),
			isLoading,
			login,
			logout,
		}),
		[user, isLoading],
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
