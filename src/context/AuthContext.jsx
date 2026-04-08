import React, { createContext, useContext, useEffect, useState, useRef } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext({})

const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [role, setRole] = useState(null)
  const [loading, setLoading] = useState(true)
  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    const fetchRole = async (userId) => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('rol')
          .eq('id', userId)
          .single()

        if (data && !error) {
          setRole(data.rol)
        } else {
          setRole('cliente')
        }
      } catch (err) {
        console.error('Error fetching role:', err)
        setRole('cliente')
      }
    }

    const init = async () => {
      // Timeout de seguridad: si en 3 segundos no hay respuesta de Supabase,
      // desbloqueamos la web para evitar pantalla en blanco.
      const timeoutId = setTimeout(() => {
        if (loading) {
          console.warn('Auth initialization timed out, defaulting to guest state.')
          setLoading(false)
        }
      }, 3000)

      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) throw error

        if (session?.user) {
          setUser(session.user)
          await fetchRole(session.user.id)
        } else {
          setUser(null)
          setRole(null)
        }
      } catch (err) {
        console.error('Auth check failed:', err)
        setUser(null)
        setRole(null)
      } finally {
        clearTimeout(timeoutId)
        setLoading(false)
      }
    }

    init()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'INITIAL_SESSION') return

        setLoading(true)
        try {
          if (session?.user) {
            setUser(session.user)
            await fetchRole(session.user.id)
          } else {
            setUser(null)
            setRole(null)
          }
        } catch (err) {
          console.error('Auth state change error:', err)
        } finally {
          setLoading(false)
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const value = {
    user,
    role,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export { useAuth }
