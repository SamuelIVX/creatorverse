import { useState, useEffect } from 'react'
import { supabase } from '../lib/client'
import { getSession, signIn, signUp, signOut } from '../lib/client'

export default function AuthNav() {
  const [session, setSession] = useState(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState('signin')
  const [error, setError] = useState('')
  const [open, setOpen] = useState(false)

  useEffect(() => {
    getSession().then(setSession)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setSession(session)
    })
    return () => subscription.unsubscribe()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const { error } = mode === 'signin'
      ? await signIn(email, password)
      : await signUp(email, password)
    if (error) {
      setError(error.message)
    } else {
      setOpen(false)
      setEmail('')
      setPassword('')
    }
  }

  if (session) {
    return (
      <div className="auth-nav auth-nav--authenticated">
        <span className="auth-nav__email">{session.user.email}</span>
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => signOut()}>
          Sign out
        </button>
      </div>
    )
  }

  return (
    <div className="auth-nav">
      <button
        type="button"
        className="btn btn-primary btn-sm"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-haspopup="true"
      >
        {open ? 'Close' : 'Sign in'}
      </button>
      {open && (
        <div className="auth-nav__dropdown page-enter">
          <form onSubmit={handleSubmit} className="auth-nav__form">
            <div className="field">
              <label className="field-label" htmlFor="nav-email">Email</label>
              <input
                id="nav-email"
                className="field-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="field">
              <label className="field-label" htmlFor="nav-password">Password</label>
              <input
                id="nav-password"
                className="field-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="form-error" role="alert">{error}</p>}
            <div className="form-actions">
              <button type="submit" className="btn btn-primary btn-sm">
                {mode === 'signin' ? 'Sign in' : 'Sign up'}
              </button>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
              >
                {mode === 'signin' ? 'Need an account?' : 'Have an account?'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
