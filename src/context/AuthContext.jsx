import React, { createContext, useContext, useEffect, useState } from 'react'
import { getProfile } from '../lib/api'

// Contexto que guarda el estado de autenticación en toda la app.
const AuthContext = createContext({})

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [role, setRole] = useState(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState(null)

  // El estado de auth guarda el usuario conectado, su rol y el token JWT.

  const setAuth = (userData, authToken) => {
    // Guardar el token en localStorage para mantener la sesión tras actualizar.
    localStorage.setItem('authToken', authToken)
    setUser(userData)
    setRole(userData.role)
    setToken(authToken)
  }

  const clearAuth = () => {
    // Limpiar el estado de auth cuando el usuario cierra sesión o el token es inválido.
    localStorage.removeItem('authToken')
    setUser(null)
    setRole(null)
    setToken(null)
  }

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('authToken')
      if (!storedToken) {
        setLoading(false)
        return
      }

      try {
        // Validar el token y cargar el perfil del usuario al iniciar la app.
        const { profile } = await getProfile(storedToken)
        setUser(profile)
        setRole(profile.role)
        setToken(storedToken)
      } catch (err) {
        console.error('Auth init failed:', err)
        clearAuth()
      } finally {
        setLoading(false)
      }
    }

    initAuth()
  }, [])

  const value = {
    user,
    role,
    loading,
    token,
    setAuth,
    clearAuth
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}


