import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function NavBar() {
  const { isAuthenticated, isLoading, user, logout } = useAuth()

  if (isLoading || !isAuthenticated) return null

  return (
    <nav>
      <Link to="/dashboard">Dashboard</Link>{' '}
      <Link to="/profile">Profile</Link>{' '}
      {user?.role === 'admin' && (
        <Link to="/admin/users">Admin Users</Link>
      )}{' '}
      <button type="button" onClick={logout}>
        Logout
      </button>
    </nav>
  )
}
