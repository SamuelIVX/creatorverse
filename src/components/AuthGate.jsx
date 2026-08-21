import { useState, useEffect } from 'react'
import { supabase } from '../lib/client'
import { getSession, signIn, signUp, signOut } from '../lib/client'

export default function AuthGate({ children, fallback }) {
  const [session, setSession] = useState(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState('signin')
  const [error, setError] = useState('')

  useEffect(() => {
    getSession().then(setSession)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setSession(session)
    })
    return () => subscription.unsubscribe()
  }, [])

  if (session) {
    return (
      <div>
        <button onClick={() => signOut()}>Sign out</button>
        {children(session.user)}
      </div>
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const { error } = mode === 'signin'
      ? await signIn(email, password)
      : await signUp(email, password)
    if (error) setError(error.message)
  }

  return (
    <div>
      {fallback && <p>{fallback}</p>}
      <form onSubmit={handleSubmit}>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">{mode === 'signin' ? 'Sign in' : 'Sign up'}</button>
        <button type="button" onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}>
          {mode === 'signin' ? 'Need an account?' : 'Have an account?'}
        </button>
        {error && <p>{error}</p>}
      </form>
    </div>
  )
}
