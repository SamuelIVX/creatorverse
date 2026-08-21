import { useState, useEffect } from 'react'
import { supabase } from '../lib/client'
import { getSession, signIn, signUp, signOut } from '../lib/client'

export default function AuthGate({ children, fallback }) {
  const [session, setSession] = useState(null)

  useEffect(() => {
    getSession().then(setSession)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setSession(session)
    })
    return () => subscription.unsubscribe()
  }, [])

  if (session) {
    return <>{children(session.user)}</>
  }

  if (fallback) {
    return <p className="auth-gate__fallback">{fallback}</p>
  }

  return null
}
