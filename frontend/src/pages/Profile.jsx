import { useEffect, useState } from 'react'
import { apiRequest } from '../api/client'
import { useAuth } from '../context/AuthContext'

const TOKEN_KEY = 'purple.auth.token'

export default function Profile() {
  const { user } = useAuth()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')

  const [profileMessage, setProfileMessage] = useState('')
  const [profileError, setProfileError] = useState('')
  const [passwordMessage, setPasswordMessage] = useState('')
  const [passwordError, setPasswordError] = useState('')

  const [savingProfile, setSavingProfile] = useState(false)
  const [savingPassword, setSavingPassword] = useState(false)

  useEffect(() => {
    setFullName(user?.fullName || '')
    setEmail(user?.email || '')
  }, [user])

  const refreshMe = async (token) => {
    try {
      await apiRequest('/auth/me', { token })
    } catch {
      // AuthContext will handle token invalidation on next app load.
      // Keep this silent to avoid double-messaging.
    }
  }

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    setProfileMessage('')
    setProfileError('')

    const token = localStorage.getItem(TOKEN_KEY)
    if (!token) {
      setProfileError('Not authenticated')
      return
    }

    setSavingProfile(true)
    try {
      await apiRequest('/users/me', {
        method: 'PUT',
        body: {
          fullName,
          email,
        },
        token,
      })

      setProfileMessage('Profile updated successfully')
      await refreshMe(token)
    } catch (err) {
      setProfileError(err.message)
    } finally {
      setSavingProfile(false)
    }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    setPasswordMessage('')
    setPasswordError('')

    const token = localStorage.getItem(TOKEN_KEY)
    if (!token) {
      setPasswordError('Not authenticated')
      return
    }

    setSavingPassword(true)
    try {
      await apiRequest('/users/me/password', {
        method: 'PUT',
        body: {
          currentPassword,
          newPassword,
        },
        token,
      })

      setPasswordMessage('Password updated successfully')
      setCurrentPassword('')
      setNewPassword('')
    } catch (err) {
      setPasswordError(err.message)
    } finally {
      setSavingPassword(false)
    }
  }

  return (
    <div>
      <h1>Profile</h1>

      <h2>Update Profile</h2>
      <form onSubmit={handleUpdateProfile}>
        <div>
          <label>
            Full Name
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </label>
        </div>

        <div>
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
        </div>

        <button type="submit" disabled={savingProfile}>
          {savingProfile ? 'Saving...' : 'Save'}
        </button>

        {profileMessage ? <p>{profileMessage}</p> : null}
        {profileError ? <p>{profileError}</p> : null}
      </form>

      <hr />

      <h2>Change Password</h2>
      <form onSubmit={handleChangePassword}>
        <div>
          <label>
            Current Password
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </label>
        </div>

        <div>
          <label>
            New Password
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </label>
        </div>

        <button type="submit" disabled={savingPassword}>
          {savingPassword ? 'Saving...' : 'Change Password'}
        </button>

        {passwordMessage ? <p>{passwordMessage}</p> : null}
        {passwordError ? <p>{passwordError}</p> : null}
      </form>
    </div>
  )
}