import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState({ text: '', type: '' })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleRegister = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMsg({ text: 'Creando cuenta...', type: 'info' })

    const { error } = await supabase.auth.signUp({ 
      email: email.trim(), 
      password: password.trim(),
      options: {
        data: {
          rol: 'cliente',
          email: email.trim() // Esto asegura que el campo de email/gmail se rellene si hay triggers
        }
      }
    })

    if (error) {
      setMsg({ text: error.message, type: 'error' })
      setLoading(false)
    } else {
      setMsg({ text: 'Cuenta creada correctamente. Entrando...', type: 'success' })
      setTimeout(() => {
        navigate('/')
      }, 1500)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4">
      <div className="card w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-brand-dark mb-8">Crear Cuenta</h2>
        
        {msg.text && (
          <div className={`p-3 rounded-lg mb-6 text-sm text-center ${
            msg.type === 'error' ? 'bg-red-50 text-red-600' : 
            msg.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'
          }`}>
            {msg.text}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Correo electrónico</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field" 
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Contraseña</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field" 
              required
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full shadow-lg">
            Registrar cuenta
          </button>
        </form>

        <p className="text-center text-gray-600 mt-6">
          ¿Ya tienes cuenta? <Link to="/login" className="text-brand-accent hover:underline font-medium">Inicia sesión</Link>
        </p>
      </div>
    </div>
  )
}
