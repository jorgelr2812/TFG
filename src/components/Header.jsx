import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { Menu, X, Moon, Sun, LayoutDashboard, Calendar, LogOut, User } from 'lucide-react'

export default function Header() {
  const { user, role, clearAuth } = useAuth()
  const { darkMode, toggleDarkMode } = useTheme()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = (e) => {
    e.preventDefault()
    clearAuth()
    navigate('/')
  }

  const navLinkClass = "hover:text-brand-accent transition-all font-bold text-sm uppercase tracking-tighter"

  return (
    <header className="fixed w-full glass z-50 transition-all duration-500">
      <div className="container mx-auto px-6 h-20 flex justify-between items-center">
        {/* LOGO RESTAURADO Y NOMBRE CORRECTO */}
        <Link to="/" className="flex items-center gap-4 active:scale-95 transition-transform group">
          <div className="relative">
            <img src="/logo.png" alt="Barbería JLR" className="w-12 h-12 object-contain group-hover:rotate-6 transition-transform" />
            <div className="absolute inset-0 bg-brand-accent/20 blur-xl rounded-full scale-0 group-hover:scale-100 transition-transform"></div>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tighter leading-none text-brand-dark dark:text-white uppercase italic">
              Barbería
            </span>
            <span className="text-brand-accent font-black text-2xl leading-none">JLR</span>
          </div>
        </Link>
        
        <div className="flex items-center gap-4 md:gap-8">
          {/* NAVEGACIÓN DESKTOP */}
          <nav className="hidden lg:flex items-center gap-8 text-gray-500 dark:text-slate-200">
            <Link to="/" className={navLinkClass}>Inicio</Link>
            <Link to="/gallery" className={navLinkClass}>Galería</Link>
            <Link to="/store" className={navLinkClass}>Tienda</Link>
            <Link to="/contact" className={navLinkClass}>Contacto</Link>
            
            {user && (
              <div className="flex items-center gap-3 pl-6 border-l border-gray-200 dark:border-slate-800">
                {role === 'jefe' && (
                  <Link to="/jefe" className="p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-xl hover:scale-110 transition shadow-sm" title="Panel Admin">
                    <LayoutDashboard size={20} />
                  </Link>
                )}
                {(role === 'peluquero' || role === 'jefe') && (
                  <Link to="/peluquero" className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl hover:scale-110 transition shadow-sm" title="Agenda">
                    <Calendar size={20} />
                  </Link>
                )}
                <button 
                  onClick={handleLogout} 
                  className="p-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl hover:scale-110 transition shadow-sm"
                  title="Cerrar sesión"
                >
                  <LogOut size={20} />
                </button>
              </div>
            )}
            {!user && (
              <Link to="/login" className="btn-primary px-8 flex items-center gap-2">
                <User size={18} /> Entrar
              </Link>
            )}
          </nav>

          {/* SELECTOR DE TEMA */}
          <button 
            onClick={toggleDarkMode}
            className="w-12 h-12 rounded-2xl flex items-center justify-center bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 hover:border-brand-accent transition-all"
          >
            {darkMode ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-brand-dark" />}
          </button>

          {/* MENÚ MÓVIL (BOTÓN) */}
          <button 
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden w-12 h-12 rounded-2xl flex items-center justify-center bg-brand-dark text-white shadow-xl"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* MENÚ MÓVIL (CONTENIDO) */}
        {menuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 glass shadow-2xl animate-in slide-in-from-top-4 p-8 border-t border-white/5 mx-4 mt-2 rounded-3xl overflow-hidden">
            <nav className="flex flex-col gap-6 text-center font-black text-2xl tracking-tighter uppercase italic">
              <Link to="/" onClick={() => setMenuOpen(false)}>Inicio</Link>
              <Link to="/gallery" onClick={() => setMenuOpen(false)}>Galería</Link>
              <Link to="/store" onClick={() => setMenuOpen(false)}>Tienda</Link>
              <Link to="/contact" onClick={() => setMenuOpen(false)}>Contacto</Link>
              
              {user ? (
                <div className="pt-8 mt-8 border-t border-gray-200 dark:border-slate-800 flex flex-col gap-4">
                   {role === 'jefe' && <Link to="/jefe" className="text-purple-500" onClick={() => setMenuOpen(false)}>👑 Admin Panel</Link>}
                   <Link to="/peluquero" className="text-brand-accent" onClick={() => setMenuOpen(false)}>📅 Agenda</Link>
                   <button onClick={handleLogout} className="text-red-500 font-black">Cerrar Sesión</button>
                </div>
              ) : (
                <Link to="/login" className="btn-primary mt-4 py-5" onClick={() => setMenuOpen(false)}>Iniciar Sesión</Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
