import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { Menu, X, Moon, Sun } from 'lucide-react'

// Cabecera con navegación y lógica de sesión.

export default function Header() {
  const { user, role, clearAuth } = useAuth()
  const { darkMode, toggleDarkMode } = useTheme()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = async (e) => {
    e.preventDefault()
    clearAuth()
    navigate('/')
  }

  return (
    <header className="fixed w-full bg-white backdrop-blur-md shadow-sm z-50 transition-all dark-header">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="Logo" className="w-12 h-12 object-contain" />
          <span className="font-bold text-xl text-brand-dark dark-logo tracking-tight">Peluquería</span>
        </Link>
        
        {/* Theme toggle */}
        <button 
          onClick={toggleDarkMode}
          className="p-2 rounded-lg hover:bg-gray-100 text-gray-700 transition-colors dark-toggle"
          aria-label="Toggle dark mode"
        >
          {darkMode ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} />}
        </button>
        
        {/* Mobile menu button */}
        <button 
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        
        <nav className="hidden md:flex items-center gap-6 font-medium text-gray-600 dark-nav">
          <Link to="/" className="hover:text-brand-accent transition-colors">Inicio</Link>
          <a href="/#servicios" className="hover:text-brand-accent transition-colors">Servicios</a>
          <Link to="/gallery" className="hover:text-brand-accent transition-colors">Galería</Link>
          <Link to="/store" className="hover:text-brand-accent transition-colors">Tienda</Link>
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

        {/* Mobile nav */}
        {menuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg border-t dark-mobile-nav">
            <nav className="flex flex-col p-4 space-y-4">
              <Link to="/" className="text-gray-900 dark-mobile-link hover:text-brand-accent transition-colors" onClick={() => setMenuOpen(false)}>Inicio</Link>
              <a href="/#servicios" className="text-gray-900 dark-mobile-link hover:text-brand-accent transition-colors" onClick={() => setMenuOpen(false)}>Servicios</a>
              <Link to="/gallery" className="text-gray-900 dark-mobile-link hover:text-brand-accent transition-colors" onClick={() => setMenuOpen(false)}>Galería</Link>
              <Link to="/store" className="text-gray-900 dark-mobile-link hover:text-brand-accent transition-colors" onClick={() => setMenuOpen(false)}>Tienda</Link>
              <Link to="/contact" className="text-gray-900 dark-mobile-link hover:text-brand-accent transition-colors" onClick={() => setMenuOpen(false)}>Contacto</Link>
              
              {user && role === 'jefe' && (
                <Link to="/jefe" className="text-purple-600 hover:text-purple-700 font-semibold" onClick={() => setMenuOpen(false)}>
                  👑 Panel Jefe
                </Link>
              )}
              {user && (role === 'peluquero' || role === 'jefe') && (
                <Link to="/peluquero" className="text-blue-600 hover:text-blue-700 font-semibold" onClick={() => setMenuOpen(false)}>
                  📅 Agenda
                </Link>
              )}

              {user ? (
                <button 
                  onClick={(e) => { handleLogout(e); setMenuOpen(false); }} 
                  className="text-red-500 hover:text-red-600 font-semibold text-left"
                >
                  Salir 🚪
                </button>
              ) : (
                <Link to="/login" className="btn-primary text-center" onClick={() => setMenuOpen(false)}>
                  Iniciar Sesión
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
