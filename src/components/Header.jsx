import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

export default function Header() {
  const { user, role, loading } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async (e) => {
    e.preventDefault()
    try {
      await supabase.auth.signOut()
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      localStorage.clear()
      sessionStorage.clear()
      // Recarga completa a la raíz para evitar fallos de 'NotFound' en el servidor
      window.location.href = '/'
    }
  }

  return (
    <header className="fixed w-full bg-white/90 backdrop-blur-md shadow-sm z-50 transition-all">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="Logo" className="w-12 h-12 object-contain" />
          <span className="font-bold text-xl text-brand-dark tracking-tight">Peluquería</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-6 font-medium text-gray-600">
          <Link to="/" className="hover:text-brand-accent transition-colors">Inicio</Link>
          <a href="/#servicios" className="hover:text-brand-accent transition-colors">Servicios</a>
          <Link to="/gallery" className="hover:text-brand-accent transition-colors">Galería</Link>
          <Link to="/contact" className="hover:text-brand-accent transition-colors">Contacto</Link>
          
          {/* Enlaces exclusivos por rol - Solo si está logeado */}
          {user && role === 'jefe' && (
            <Link to="/jefe" className="text-purple-600 hover:text-purple-700 font-semibold flex items-center gap-1">
              👑 Panel Jefe
            </Link>
          )}
          {user && (role === 'peluquero' || role === 'jefe') && (
            <Link to="/peluquero" className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1">
              📅 Agenda
            </Link>
          )}

          {user ? (
            <button 
              onClick={handleLogout} 
              className="text-red-500 hover:text-red-600 font-semibold px-4 py-2 hover:bg-red-50 rounded-lg transition-all"
            >
              Salir 🚪
            </button>
          ) : (
            <Link to="/login" className="btn-primary">
              Iniciar Sesión
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
