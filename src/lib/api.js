const API_BASE = import.meta.env.VITE_API_BASE_URL || ''

// Construye los headers con JWT si el token está disponible.
const getAuthHeaders = (token) => {
  return token ? { Authorization: `Bearer ${token}` } : {}
}

const apiFetch = async (path, options = {}) => {
  const { headers, ...restOptions } = options
  
  // Wrapper centralizado para todas las llamadas a la API.
  const response = await fetch(`${API_BASE}${path}`, {
    ...restOptions,
    headers: {
      'Content-Type': 'application/json',
      ...headers
    }
  })

  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    if (data.errors && Array.isArray(data.errors)) {
      const messages = data.errors.map(err => err.msg || err.message).join('. ')
      throw new Error(messages)
    }
    const error = data.error || data.message || 'Error en la petición'
    throw new Error(error)
  }
  return data
}

export const login = async (email, password) => {
  return apiFetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  })
}

export const register = async (email, password) => {
  return apiFetch('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  })
}

export const getProfile = async (token) => {
  return apiFetch('/api/users/profile', {
    method: 'GET',
    headers: getAuthHeaders(token)
  })
}

export const createAppointment = async (payload, token) => {
  return apiFetch('/api/appointments', {
    method: 'POST',
    headers: getAuthHeaders(token),
    body: JSON.stringify(payload)
  })
}

export const getAppointments = async (token) => {
  return apiFetch('/api/appointments', {
    method: 'GET',
    headers: getAuthHeaders(token)
  })
}

export const updateAppointmentStatus = async (id, status, token, precio = undefined) => {
  return apiFetch(`/api/appointments/${id}/status`, {
    method: 'PUT',
    headers: getAuthHeaders(token),
    body: JSON.stringify({ estado: status, precio })
  })
}

export const createSuggestion = async (mensaje, token) => {
  return apiFetch('/api/suggestions', {
    method: 'POST',
    headers: getAuthHeaders(token),
    body: JSON.stringify({ mensaje })
  })
}

export const getSuggestions = async (token) => {
  return apiFetch('/api/suggestions', {
    method: 'GET',
    headers: getAuthHeaders(token)
  })
}

export const getStatus = async (token) => {
  return apiFetch('/api/auth/status', {
    method: 'GET',
    headers: getAuthHeaders(token)
  })
}

export const getStoreProducts = async () => {
  return apiFetch('/api/products', {
    method: 'GET'
  })
}

