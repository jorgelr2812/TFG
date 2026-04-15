import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Controla acceso según el rol del usuario.
export const RoleProtectedRoute = ({ children, allowedRoles }) => {
  const { user, role, loading } = useAuth()

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-900 dark:text-white">Cargando permisos...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Si el usuario no tiene rol cargado o no está en la lista de permitidos
  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />
  }

  return children
}
