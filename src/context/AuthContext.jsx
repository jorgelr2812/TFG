import React, { createContext, useContext, useEffect, useState, useRef } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext({})

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [role, setRole] = useState(null)
  const [loading, setLoading] = useState(true)
  const loadingRef = useRef(true) // Ref to keep track of loading state for the timeout
  const initialized = useRef(false)

  // Keep ref in sync with state
  useEffect(() => {
    loadingRef.current = loading
  }, [loading])

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    const fetchRole = async (userObj) => {
      const userId = userObj.id
      
      // 1. CARGA OPTIMISTA: Prioridad inmediata a user_metadata (rápido y local)
      let currentRole = userObj.user_metadata?.rol || userObj.user_metadata?.role || 'cliente'
      
      setRole(currentRole)

      // 2. SINCRONIZACIÓN EN SEGUNDO PLANO: Consultar tabla 'profiles'
      try {
        
        // Eliminamos el timeout para evitar fallos por lentitud de la red en la primera carga
        const { data: profileList, error: tableError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single() // Usamos single para obtener uno solo directamente

        if (tableError) {
          console.error('--- ERROR FETCHING PROFILE TABLE: ---', tableError.message, tableError.details)
          // Si el error es 406 o similar, podría ser RLS o que no existe la fila
          if (tableError.code === 'PGRST116') {
            console.warn('Profile row not found for this user in "profiles" table.')
          }
          return
        }

        if (profileList) {
          const dbRole = profileList.rol || profileList.role
          
          if (dbRole) {
            setRole(dbRole)
          } else {
            console.warn('--- COLUMN "rol" OR "role" NOT FOUND IN PROFILE DATA ---')
          }
        }
      } catch (err) {
        console.error('--- UNEXPECTED ROLE SYNC EXCEPTION: ---', err)
      }
    }

    const init = async () => {
      const timeoutId = setTimeout(() => {
        if (loadingRef.current) {
          console.warn('Auth initialization timed out, check Supabase status.')
          setLoading(false)
        }
      }, 5000) // Aumentamos a 5s para mayor margen

      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) throw error

        if (session?.user) {
          setUser(session.user)
          // No bloqueamos el inicio de la app esperando a la DB lenta
          fetchRole(session.user)
        } else {
          setUser(null)
          setRole(null)
        }
      } catch (err) {
        console.error('Session init failed:', err)
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

        try {
          if (session?.user) {
            setUser(session.user)
            fetchRole(session.user)
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


