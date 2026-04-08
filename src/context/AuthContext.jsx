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
        setRole('cliente') // fallback si no existe perfil
      }
    }

    // 1) Carga inicial garantizada: getSession siempre resuelve rápido
    //    y asegura que loading=false aunque onAuthStateChange tarde.
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        setUser(session.user)
        await fetchRole(session.user.id)
      } else {
        setUser(null)
        setRole(null)
      }
      setLoading(false)
    }
    init()

    // 2) Cambios posteriores (login / logout): ponemos loading=true
    //    para evitar renders intermedios con role=null.
    //    Ignoramos INITIAL_SESSION porque ya lo gestiona init().
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'INITIAL_SESSION') return

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
