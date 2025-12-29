import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useAuth } from '../context/AuthContext.jsx'

export default function Login() {
  const navigate = useNavigate()
  const { login, isLoading } = useAuth()

  const [email, setEmail] = useState('')
  const [role, setRole] = useState('user')

  const onSubmit = async (e) => {
    e.preventDefault()
    await login({ email, role })
    navigate('/dashboard', { replace: true })
  }

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={onSubmit}>
        <div>
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="demo@example.com"
              autoComplete="email"
              required
            />
          </label>
        </div>

        <div>
          <label>
            Role
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="user">user</option>
              <option value="admin">admin</option>
            </select>
          </label>
        </div>

        <button type="submit" disabled={isLoading}>
          Sign in
        </button>
      </form>
    </div>
  )
}