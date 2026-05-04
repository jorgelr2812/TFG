import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { register as registerUser } from '../lib/api'
import { useForm } from 'react-hook-form'
import ReCAPTCHA from 'react-google-recaptcha'

// Página de registro para crear nuevas cuentas de cliente.
export default function Register() {
  const [captchaToken, setCaptchaToken] = useState(null)
  const [msg, setMsg] = useState({ text: '', type: '' })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { setAuth } = useAuth()
  const { register, handleSubmit, formState: { errors } } = useForm()

  const onCaptchaChange = (token) => {
    setCaptchaToken(token)
  }

  const onSubmit = async (data) => {
    if (!captchaToken) {
      setMsg({ text: 'Por favor, completa el captcha', type: 'error' })
      return
    }
    setLoading(true)
    setMsg({ text: 'Creando cuenta...', type: 'info' })

    try {
      const response = await registerUser(data.email.trim(), data.password.trim(), captchaToken)
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
      <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-2xl border border-gray-100 dark:border-slate-800 w-full max-w-md transition-all">
        <h2 className="text-3xl font-black text-center text-brand-dark dark:text-white mb-2">Crear Cuenta</h2>
        <p className="text-center text-gray-500 dark:text-slate-400 mb-8 text-sm">Únete a la experiencia Barbería JLR</p>
        
        {msg.text && (
          <div className={`p-4 rounded-xl mb-6 text-sm text-center font-medium border ${
            msg.type === 'error' ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-100 dark:border-red-900/30' : 
            msg.type === 'success' ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-100 dark:border-green-900/30' : 
            'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-900/30'
          }`}>
            {msg.text}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-gray-500 dark:text-slate-400 mb-2">Correo electrónico</label>
            <input 
              type="email" 
              {...register("email", { 
                required: "El email es obligatorio",
                pattern: { value: /^\S+@\S+$/i, message: "Email inválido" }
              })}
              className="input-field dark:bg-slate-800 dark:border-slate-700 dark:text-white" 
              placeholder="tu@email.com"
            />
            {errors.email && <p className="text-red-500 text-[10px] font-bold mt-1 uppercase">{errors.email.message}</p>}
          </div>
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-gray-500 dark:text-slate-400 mb-2">Contraseña</label>
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
              className="input-field dark:bg-slate-800 dark:border-slate-700 dark:text-white" 
              placeholder="••••••••"
            />
            {errors.password && <p className="text-red-500 text-[10px] font-bold mt-1 uppercase">{errors.password.message}</p>}
          </div>

          <div className="flex flex-col items-center gap-3">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Verificación de seguridad</p>
            <ReCAPTCHA
              sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
              onChange={onCaptchaChange}
              theme={document.documentElement.classList.contains('dark') ? 'dark' : 'light'}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading || !captchaToken} 
            className={`w-full py-4 rounded-xl font-bold text-white transition-all shadow-lg ${
              loading || !captchaToken 
                ? 'bg-gray-300 dark:bg-slate-700 cursor-not-allowed shadow-none' 
                : 'bg-brand-accent hover:bg-brand-accent/90 shadow-brand-accent/20 active:scale-[0.98]'
            }`}
          >
            {loading ? 'Creando cuenta...' : 'Registrar cuenta'}
          </button>
        </form>

        <p className="text-center text-gray-600 dark:text-slate-400 mt-8 text-sm">
          ¿Ya tienes cuenta? <Link to="/login" className="text-brand-accent hover:underline font-black">Inicia sesión</Link>
        </p>
      </div>
    </div>
  )
}
