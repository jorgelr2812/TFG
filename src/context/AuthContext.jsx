import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext({})

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [role, setRole] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRole = async (userId) => {
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
    }

    // onAuthStateChange dispara INITIAL_SESSION al montar,
    // SIGNED_IN al hacer login y SIGNED_OUT al hacer logout.
    // Ponemos loading=true al inicio de cada cambio para evitar
    // renders intermedios con user!=null pero role==null (pantalla en blanco).
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setLoading(true)
        if (session?.user) {
          setUser(session.user)
          await fetchRole(session.user.id)
        } else {
          setUser(null)
          setRole(null)
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
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
