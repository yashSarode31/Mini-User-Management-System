import { apiRequest } from './client'

export const getUsers = (token) => {
  return apiRequest('/admin/users', { token })
}

export const updateUserStatus = (userId, status, token) => {
  return apiRequest(`/admin/users/${userId}/status`, {
    method: 'PATCH',
    body: { status },
    token,
  })
}
