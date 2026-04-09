import React, { createContext, useContext, useEffect, useState, useRef } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext({})

const useAuth = () => useContext(AuthContext)

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
      console.log('--- ROLE SET OPTIMISTICALLY FROM METADATA:', currentRole, '---')

      // 2. SINCRONIZACIÓN EN SEGUNDO PLANO: Consultar tabla 'profiles' con timeout
      try {
        console.log('--- SYNCING ROLE WITH PROFILES TABLE (BACKGROUND) ---')
        
        // Usamos una carrera con timeout para que la tabla lenta/rota no bloquee la app
        const fetchPromise = supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .limit(1)

        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('DB_TIMEOUT')), 2500)
        )

        const { data: profileList, error: tableError } = await Promise.race([
          fetchPromise,
          timeoutPromise
        ])

        if (tableError) {
          console.warn('Profiles table background sync failed:', tableError)
        } else if (profileList?.[0]) {
          const dbRole = profileList[0].rol || profileList[0].role
          if (dbRole && dbRole !== currentRole) {
            console.log('--- ROLE UPDATED FROM TABLE:', dbRole, '---')
            setRole(dbRole)
          }
        }
      } catch (err) {
        if (err.message === 'DB_TIMEOUT') {
          console.warn('Profiles table is hanging (Timeout). Using metadata role.')
        } else {
          console.error('Background role sync exception:', err)
        }
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
          await fetchRole(session.user)
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

        setLoading(true)
        try {
          if (session?.user) {
            setUser(session.user)
            await fetchRole(session.user)
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
