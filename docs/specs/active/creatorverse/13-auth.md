# Spec: Authentication & Row Level Security

## Objective
Enable Row Level Security on the `creators` table and add email/password
authentication through Supabase Auth so that only verified users can alter
data. Public visitors can still browse creators, but creating, updating, and
deleting creators requires an authenticated session.

## Scope
- Package: `creatorverse`
- Modifies: `src/lib/client.js` (add auth helpers), `src/components/AuthGate.jsx` (new), `src/pages/AddCreator.jsx` (auth gate), `src/pages/EditCreator.jsx` (auth gate), `src/pages/ShowCreators.jsx` (sign-in prompt near add button)
- External: Supabase project `wzgfswtqkoyzjahbbrie` — database policies + Auth provider
- Off-limits: `Card.jsx`, `ViewCreator.jsx`, routing (`App.jsx`), styling files

## Non-Goals
- No OAuth providers (Google/GitHub/Apple) — email/password only for this prework.
- No password reset or email confirmation flows.
- No role-based access control beyond the single authenticated policy.
- No protected routes or redirect logic beyond gating write actions.

## Requirements
1. THE SYSTEM SHALL enable Row Level Security on `public.creators`.
2. THE SYSTEM SHALL create a policy allowing `SELECT` for both `anon` and `authenticated` roles.
3. THE SYSTEM SHALL create a policy denying `INSERT`, `UPDATE`, and `DELETE` for the `anon` role.
4. THE SYSTEM SHALL create a policy allowing `INSERT`, `UPDATE`, and `DELETE` for the `authenticated` role.
5. THE SYSTEM SHALL provide `signUp`, `signIn`, `signOut`, and `getSession` helpers in `src/lib/client.js`.
6. WHEN a user is not authenticated, THE SYSTEM SHALL hide or disable the add/edit/delete controls in the UI.
7. WHEN a user is authenticated, THE SYSTEM SHALL show the add/edit/delete controls.
8. WHEN an unauthenticated user attempts a write operation, THE SYSTEM SHALL prompt them to sign in before proceeding.
9. THE SYSTEM SHALL sign the user out cleanly and clear the session from the UI.

## Design

### Database policies

```sql
alter table public.creators enable row level security;

create policy creators_public_read on public.creators
  for select
  to anon, authenticated
  using (true);

create policy creators_anon_no_write on public.creators
  for insert, update, delete
  to anon
  using (false)
  with check (false);

create policy creators_authenticated_write on public.creators
  for insert, update, delete
  to authenticated
  using (true)
  with check (true);
```

### Auth helpers (`src/lib/client.js`)

```js
import { createClient } from '@supabase/supabase-js'

const URL = import.meta.env.VITE_SUPABASE_URL
const API_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(URL, API_KEY)

export async function signUp(email, password) {
  const { error } = await supabase.auth.signUp({ email, password })
  return { error }
}

export async function signIn(email, password) {
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  return { error }
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export async function getSession() {
  const { data: { session } } = await supabase.auth.getSession()
  return session
}
```

**Sign-out behavior:** `signOut` clears the session. `AuthGate` subscribes to
`onAuthStateChange`, so the UI automatically returns to the sign-in view without
a manual redirect.

### Auth gate component (`src/components/AuthGate.jsx`)

```jsx
import { useState, useEffect } from 'react'
import { supabase } from '../client'
import { getSession, signIn, signUp, signOut } from '../client'

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
```

### Gating pattern

Write pages wrap their entire content in `AuthGate`. The `fallback` message shows
above the sign-in form; when authenticated, `children` receives the user object
and renders the existing page content unchanged.

```jsx
import AuthGate from '../components/AuthGate'

export default function AddCreator() {
  return (
    <AuthGate fallback="Sign in to add a creator.">
      {(user) => (
        // existing form, unchanged
      )}
    </AuthGate>
  )
}
```

`EditCreator` follows the same pattern. `ShowCreators` and `ViewCreator` remain
unwrapped; they may show a sign-in prompt near write controls if desired, but
their read behavior is unchanged.

Public-read pages (`ShowCreators`, `ViewCreator`) remain accessible without auth.

### Client changes

`src/lib/client.js` gains the four auth helper exports listed above. No other
files import from `client.js` need to change — existing CRUD pages continue to
call `supabase.from('creators')` directly.

**Test impact on specs 07, 08, 09:** existing tests for `AddCreator`, `EditCreator`,
and delete assume unauthenticated writes succeed. Those tests must be updated to
either mock an authenticated session or assert that unauthenticated writes are
rejected. This spec does not rewrite those tests; implementers should update them
to match the new auth-gated behavior.

## Current State
- `creators` table has RLS disabled. [confirmed — spec 02, line 16]
- `client.js` exports only the Supabase client, no auth helpers. [confirmed]
- No auth UI exists in any page. [confirmed]
- Specs 07, 08, 09 allow writes unconditionally. [confirmed]

## Tests
- `rls_enabled`: `creators` table has RLS enabled.
- `public_read_policy_exists`: a policy allows `SELECT` for `anon` and `authenticated`.
- `anon_write_denied`: a policy denies `INSERT/UPDATE/DELETE` for `anon`.
- `authenticated_write_allowed`: a policy allows `INSERT/UPDATE/DELETE` for `authenticated`.
- `client_exports_auth_helpers`: `signUp`, `signIn`, `signOut`, `getSession` are exported.
- `auth_gate_requires_signin_for_writes`: `AddCreator` renders sign-in form when not authenticated.
- `auth_gate_shows_form_when_authenticated`: `AddCreator` renders form when session exists.
- `sign_out_clears_session`: after `signOut`, the auth gate returns to the sign-in view.

## Constraints
- Dependencies: `02-supabase-database` (schema), `07-add-creator`, `08-update-creator`, `09-delete-creator` (write pages to gate).
- Backward compatibility: public read access must remain functional; existing `supabase.from('creators')` calls in read pages must not change.

## Context
- Supabase Auth: https://supabase.com/docs/guides/auth
- Row Level Security: https://supabase.com/docs/guides/database/postgres/row-level-security
- Supabase JS Auth methods: https://supabase.com/docs/reference/javascript/auth-signup
