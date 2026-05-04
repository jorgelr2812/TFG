import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { login } from '../lib/api'
import ReCAPTCHA from 'react-google-recaptcha'

// Página de inicio de sesión para usuarios registrados.
export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [captchaToken, setCaptchaToken] = useState(null)
  const [errorMsg, setErrorMsg] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { setAuth } = useAuth()

  const onCaptchaChange = (token) => {
    setCaptchaToken(token)
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    if (!captchaToken) {
      setErrorMsg('Por favor, completa el captcha.')
      return
    }
    setLoading(true)
    setErrorMsg('')

    try {
      const response = await login(email, password, captchaToken)
      setAuth(response.user, response.token)
      navigate('/')
    } catch (err) {
      setErrorMsg(err.message || 'Credenciales incorrectas o usuario no encontrado.')
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4">
      <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-2xl border border-gray-100 dark:border-slate-800 w-full max-w-md transition-all">
        <h2 className="text-3xl font-black text-center text-brand-dark dark:text-white mb-2">Bienvenido de nuevo</h2>
        <p className="text-center text-gray-500 dark:text-slate-400 mb-8 text-sm">Introduce tus credenciales para acceder</p>
        
        {errorMsg && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl mb-6 text-sm text-center font-medium border border-red-100 dark:border-red-900/30">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-gray-500 dark:text-slate-400 mb-2">Correo electrónico</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field dark:bg-slate-800 dark:border-slate-700 dark:text-white" 
              required
              placeholder="ejemplo@correo.com"
            />
          </div>
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-gray-500 dark:text-slate-400 mb-2">Contraseña</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field dark:bg-slate-800 dark:border-slate-700 dark:text-white" 
              required
              placeholder="••••••••"
            />
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
            {loading ? 'Iniciando sesión...' : 'Entrar en mi cuenta'}
          </button>
        </form>

        <p className="text-center text-gray-600 dark-text mt-6">
          ¿No tienes cuenta? <Link to="/register" className="text-brand-accent hover:underline font-medium">Regístrate aquí</Link>
        </p>
      </div>
    </div>
  )
}
