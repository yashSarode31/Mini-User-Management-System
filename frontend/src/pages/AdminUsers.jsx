import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { getUsers, updateUserStatus } from '../api/admin'

export default function AdminUsers() {
  const { user } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      const token = localStorage.getItem('purple.auth.token')
      const data = await getUsers(token)
      setUsers(data)
    } catch (error) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  const toggleStatus = async (id, currentStatus) => {
    const token = localStorage.getItem('purple.auth.token')
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active'

    await updateUserStatus(id, newStatus, token)
    loadUsers()
  }

  if (loading) return <p>Loading users...</p>

  return (
    <div>
      <h1>Admin Users</h1>

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u) => (
            <tr key={u._id}>
              <td>{u.fullName}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>{u.status}</td>
              <td>
                {u.role !== 'admin' && (
                  <button
                    onClick={() => toggleStatus(u._id, u.status)}
                  >
                    {u.status === 'active'
                      ? 'Deactivate'
                      : 'Activate'}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
