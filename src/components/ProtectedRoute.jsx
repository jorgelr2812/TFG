import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Ruta que exige sesión activa para acceder.
export const ProtectedRoute = ({ children }) => {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}
