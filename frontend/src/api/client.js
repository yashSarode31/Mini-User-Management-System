const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export async function apiRequest(
  endpoint,
  { method = 'GET', body, token } = {}
) {
  const headers = {
    'Content-Type': 'application/json',
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Request failed')
  }

  return data
}
