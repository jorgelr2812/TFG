import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setErrorMsg("Credenciales incorrectas o usuario no encontrado.")
      setLoading(false)
    } else {
      navigate('/')
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4">
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 dark-card w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-brand-dark dark-heading mb-8">Bienvenido de nuevo</h2>
        
        {errorMsg && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-gray-700 dark-label font-medium mb-2">Correo electrónico</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field dark-input" 
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 dark-label font-medium mb-2">Contraseña</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field dark-input" 
              required
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full shadow-lg dark-button">
            {loading ? 'Iniciando sesión...' : 'Entrar'}
          </button>
        </form>

        <p className="text-center text-gray-600 dark-text mt-6">
          ¿No tienes cuenta? <Link to="/register" className="text-brand-accent hover:underline font-medium">Regístrate aquí</Link>
        </p>
      </div>
    </div>
  )
}
