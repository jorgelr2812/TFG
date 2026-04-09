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
      let finalRole = null

      try {
        console.log('--- FETCHING ROLE FROM DB ---')
        
        // 1. Intentar desde la tabla principal 'profiles'
        const { data: profileList, error: tableError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .limit(1)

        if (tableError) {
          console.warn('Supabase Error 500/Table Error. Check RLS policies or Triggers in Supabase Dashboard:', tableError)
        } else {
          const profile = profileList?.[0]
          finalRole = profile?.rol || profile?.role
        }

        // 2. Si no hay rol en la tabla (o falló), intentar desde user_metadata (Rescate)
        if (!finalRole) {
          console.log('--- TRYING USER_METADATA FALLBACK ---')
          finalRole = userObj.user_metadata?.rol || userObj.user_metadata?.role
        }

        // 3. Establecer rol o fallback final (cliente)
        setRole(finalRole || 'cliente')
      } catch (err) {
        console.error('Critical Auth Exception:', err)
        setRole('cliente')
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
