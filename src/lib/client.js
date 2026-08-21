/**
 * Supabase client singleton for the creatorverse app.
 * Reads VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY from env at module load.
 * The anon key is a public client key by design — access is enforced by
 * Supabase row-level security policies, not by key secrecy.
 */
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
