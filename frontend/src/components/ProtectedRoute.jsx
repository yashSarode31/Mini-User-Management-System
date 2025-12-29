import { Navigate, Outlet, useLocation } from 'react-router-dom'

import { useAuth } from '../context/AuthContext.jsx'

export default function ProtectedRoute({
	children,
	allowedRoles,
	redirectTo = '/login',
	unauthorizedTo = '/dashboard',
}) {
	const location = useLocation()
	const { isAuthenticated, isLoading, user } = useAuth()

	if (isLoading) return <div>Loading...</div>


	if (!isAuthenticated) {
		return (
			<Navigate
				to={redirectTo}
				replace
				state={{ from: location }}
			/>
		)
	}

	const roles =
		allowedRoles == null
			? null
			: Array.isArray(allowedRoles)
				? allowedRoles
				: [allowedRoles]

	if (roles && roles.length > 0 && !roles.includes(user?.role)) {
		return <Navigate to={unauthorizedTo} replace />
	}

	return children ?? <Outlet />
}
