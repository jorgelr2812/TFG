import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { Menu, X, Moon, Sun, LayoutDashboard, Calendar, LogOut, User, Coins } from 'lucide-react'

export default function Header() {
  const { user, role, clearAuth } = useAuth()
  const { darkMode, toggleDarkMode } = useTheme()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)

  const handleLogout = (e) => {
    e.preventDefault()
    clearAuth()
    setProfileOpen(false)
    navigate('/')
  }

  const navLinkClass = "hover:text-brand-accent transition-all font-bold text-sm uppercase tracking-tighter"

  return (
    <header className="fixed top-0 left-0 right-0 glass z-[60] transition-all duration-500">
      <div className="container mx-auto px-6 h-20 flex justify-between items-center">
        {/* LOGO Y NOMBRE */}
        <Link to="/" className="flex items-center gap-4 active:scale-95 transition-transform group">
          <div className="relative">
            <img src="/logo.png" alt="Barbería JLR" className="w-12 h-12 object-contain group-hover:rotate-6 transition-transform" />
            <div className="absolute inset-0 bg-brand-accent/20 blur-xl rounded-full scale-0 group-hover:scale-100 transition-transform"></div>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tighter leading-none uppercase italic" style={{ color: 'var(--text-main)' }}>
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
              <div className="relative pl-6 border-l border-gray-200 dark:border-slate-800 flex items-center gap-4">
                {/* Puntos JLR */}
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-xl border border-amber-100 dark:border-amber-800/50" title="Mis Puntos JLR">
                  <Coins size={16} className="animate-pulse" />
                  <span className="font-black text-xs leading-none">{user.puntos || 0}</span>
                </div>

                {/* Botón Perfil Dropdown */}
                <button 
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="w-10 h-10 rounded-full bg-brand-accent flex items-center justify-center text-white font-black shadow-lg shadow-brand-accent/30 hover:scale-110 transition-all border-2 border-white dark:border-slate-900"
                >
                  {user.email?.[0].toUpperCase()}
                </button>

                {/* Dropdown Menu */}
                {profileOpen && (
                  <div className="absolute top-full right-0 mt-4 w-64 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-slate-800 p-2 animate-in fade-in zoom-in-95 duration-200">
                    <div className="p-4 border-b border-gray-50 dark:border-slate-800 mb-2 text-center">
                      <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Mi Cuenta JLR</p>
                      <p className="text-sm font-bold text-gray-800 dark:text-white truncate" title={user.email}>{user.email}</p>
                    </div>

                    <div className="space-y-1">
                      <Link to="/profile" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-xl transition-all text-sm font-bold text-gray-600 dark:text-slate-300 group">
                        <Calendar size={18} className="text-brand-accent group-hover:scale-110 transition-transform" /> Mis Reservas
                      </Link>
                      <Link to="/profile?tab=purchases" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-xl transition-all text-sm font-bold text-gray-600 dark:text-slate-300 group">
                        <LayoutDashboard size={18} className="text-brand-accent group-hover:scale-110 transition-transform" /> Mis Compras
                      </Link>
                      <Link to="/profile?tab=tracking" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-xl transition-all text-sm font-bold text-gray-600 dark:text-slate-300 group">
                        <Coins size={18} className="text-brand-accent group-hover:scale-110 transition-transform" /> Seguimiento Pedido
                      </Link>
                      
                      {(role === 'peluquero' || role === 'jefe') && (
                        <div className="pt-2 mt-2 border-t border-gray-50 dark:border-slate-800">
                          <Link to={role === 'jefe' ? "/jefe" : "/peluquero"} onClick={() => setProfileOpen(false)} className="flex items-center gap-3 p-3 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-xl transition-all text-sm font-bold text-purple-600 dark:text-purple-400">
                            <LayoutDashboard size={18} /> Panel Gestión
                          </Link>
                        </div>
                      )}

                      <div className="pt-2 mt-2 border-t border-gray-50 dark:border-slate-800">
                        <button onClick={handleLogout} className="w-full flex items-center gap-3 p-3 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all text-sm font-bold text-red-600 dark:text-red-400 group">
                          <LogOut size={18} className="group-hover:translate-x-1 transition-transform" /> Cerrar Sesión
                        </button>
                      </div>
                    </div>
                  </div>
                )}
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
                   <div className="flex items-center justify-center gap-2 text-amber-500 font-black mb-2">
                     <Coins size={24} />
                     <span>{user.puntos || 0} PUNTOS JLR</span>
                   </div>
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
