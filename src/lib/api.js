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

export const login = async (email, password, captchaToken) => {
  return apiFetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password, captchaToken })
  })
}

export const register = async (email, password, captchaToken) => {
  return apiFetch('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password, captchaToken })
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

// NUEVAS FUNCIONES PARA LA SUITE AVANZADA JLR
export const getUserAppointments = async (token) => {
  return apiFetch('/api/appointments/user', {
    method: 'GET',
    headers: getAuthHeaders(token)
  })
}

export const submitReview = async (appointmentId, review, rating, token) => {
  return apiFetch(`/api/appointments/${appointmentId}/review`, {
    method: 'POST',
    headers: getAuthHeaders(token),
    body: JSON.stringify({ review, rating })
  })
}

export const updateUserPointsApi = async (points, token) => {
  return apiFetch('/api/users/points', {
    method: 'PUT',
    headers: getAuthHeaders(token),
    body: JSON.stringify({ puntos: points })
  })
}

export const getBarberos = async () => {
  return {
    barberos: [
      { id: 1, name: 'Jorge', specialty: 'Experto en Degradados', image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=100' },
      { id: 2, name: 'Luis', specialty: 'Color y Estilismo', image: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100' },
      { id: 3, name: 'Raúl', specialty: 'Barba Tradicional', image: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100' }
    ]
  }
}

export const updateProductStockApi = async (items) => {
  return apiFetch('/api/products/stock', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items })
  })
}

