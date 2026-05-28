const BASE_URL = import.meta.env.VITE_API_URL

const request = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token')

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    },
    ...options
  })

  const data = await response.json()

  if (!response.ok) throw new Error(data.error || 'Error en la petición')

  return data
}

export const api = {
  post: (endpoint, body) => request(endpoint, { method: 'POST', body: JSON.stringify(body) }),
  get: (endpoint) => request(endpoint),
  put: (endpoint, body) => request(endpoint, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (endpoint) => request(endpoint, { method: 'DELETE' }),
  patch: (endpoint, body) => request(endpoint, { method: 'PATCH', body: JSON.stringify(body) })
}