import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { register as registerUser } from '../lib/api'
import { useForm } from 'react-hook-form'

// Página de registro para crear nuevas cuentas de cliente.
export default function Register() {
  const [msg, setMsg] = useState({ text: '', type: '' })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { setAuth } = useAuth()
  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit = async (data) => {
    setLoading(true)
    setMsg({ text: 'Creando cuenta...', type: 'info' })

    try {
      const response = await registerUser(data.email.trim(), data.password.trim())
      setAuth(response.user, response.token)
      setMsg({ text: 'Cuenta creada correctamente. Entrando...', type: 'success' })
      setTimeout(() => {
        navigate('/')
      }, 1500)
    } catch (error) {
      setMsg({ text: error.message || 'Error al crear la cuenta', type: 'error' })
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4">
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 dark-card w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-brand-dark dark-heading mb-8">Crear Cuenta</h2>
        
        {msg.text && (
          <div className={`p-3 rounded-lg mb-6 text-sm text-center ${
            msg.type === 'error' ? 'bg-red-50 text-red-600' : 
            msg.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'
          }`}>
            {msg.text}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-gray-700 dark-label font-medium mb-2">Correo electrónico</label>
            <input 
              type="email" 
              {...register("email", { 
                required: "El email es obligatorio",
                pattern: { value: /^\S+@\S+$/i, message: "Email inválido" }
              })}
              className="input-field dark-input" 
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>
          <div>
            <label className="block text-gray-700 dark-label font-medium mb-2">Contraseña</label>
            <input 
              type="password" 
              {...register("password", { 
                required: "La contraseña es obligatoria",
                minLength: { value: 8, message: "Mínimo 8 caracteres" },
                pattern: { 
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 
                  message: "Debe incluir mayúscula, minúscula y número" 
                }
              })}
              className="input-field dark-input" 
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full shadow-lg dark-button">
            Registrar cuenta
          </button>
        </form>

        <p className="text-center text-gray-600 dark-text mt-6">
          ¿Ya tienes cuenta? <Link to="/login" className="text-brand-accent hover:underline font-medium">Inicia sesión</Link>
        </p>
      </div>
    </div>
  )
}
