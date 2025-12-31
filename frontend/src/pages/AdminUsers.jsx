import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { updateUserStatus } from '../api/admin'
import { apiRequest } from '../api/client'

export default function AdminUsers() {
  const { user } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    loadUsers(page)
  }, [page])

  const loadUsers = async (pageToLoad) => {
    setLoading(true)
    try {
      const token = localStorage.getItem('purple.auth.token')
      const data = await apiRequest(
        `/admin/users?page=${pageToLoad}&limit=${limit}`,
        { token }
      )
      setUsers(data.users || [])
      setTotalPages(data.totalPages || 1)
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
    loadUsers(page)
  }

  if (loading) return <p>Loading users...</p>

  return (
    <div>
      <h1>Admin Users</h1>

      <div>
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page <= 1}
        >
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page >= totalPages}
        >
          Next
        </button>
      </div>

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
                  <button onClick={() => toggleStatus(u._id, u.status)}>
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
