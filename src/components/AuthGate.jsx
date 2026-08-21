import { useState, useEffect } from 'react'
import { supabase } from '../lib/client'
import { getSession, signIn, signUp, signOut } from '../lib/client'
import './AuthGate.css'

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
      <div className="auth-gate auth-gate--authenticated page-enter">
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => signOut()}>
          Sign out
        </button>
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
    <div className="auth-gate page-enter">
      <div className="form-card">
        <p className="auth-gate__eyebrow">Account</p>
        <h1 className="page-title" style={{ marginBottom: 'var(--space-4)' }}>
          {mode === 'signin' ? 'Sign in' : 'Create account'}
        </h1>
        {fallback && <p className="auth-gate__fallback">{fallback}</p>}
        <form onSubmit={handleSubmit} className="auth-gate__form">
          <div className="field">
            <label className="field-label" htmlFor="auth-email">Email</label>
            <input
              id="auth-email"
              className="field-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label className="field-label" htmlFor="auth-password">Password</label>
            <input
              id="auth-password"
              className="field-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="form-error" role="alert">{error}</p>}
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              {mode === 'signin' ? 'Sign in' : 'Sign up'}
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
            >
              {mode === 'signin' ? 'Need an account?' : 'Have an account?'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
