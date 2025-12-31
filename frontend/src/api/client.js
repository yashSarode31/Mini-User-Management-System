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

  const contentType = response.headers.get('content-type') || ''
  const isJson = contentType.includes('application/json')
  const data = isJson ? await response.json() : await response.text()

  if (!isJson) {
    throw new Error(
      `API returned non-JSON response. Check VITE_API_URL. Status: ${response.status}`
    )
  }

  if (!response.ok) {
    throw new Error(data.message || 'Request failed')
  }

  return data
}
