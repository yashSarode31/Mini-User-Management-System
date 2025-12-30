import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useAuth } from '../context/AuthContext.jsx'

export default function Login() {
  const navigate = useNavigate()
  const { login, isLoading } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      await login({ email, password })
      navigate('/dashboard', { replace: true })
    } catch (error) {
      alert(error.message)
    }
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
              placeholder="test@example.com"
              autoComplete="email"
              required
            />
          </label>
        </div>

        <div>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </label>
        </div>

        <button type="submit" disabled={isLoading}>
          Sign in
        </button>
      </form>
    </div>
  )
}
