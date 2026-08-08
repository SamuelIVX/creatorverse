/**
 * client tests: verifies the Supabase client exports a usable query builder,
 * that .env is git-ignored, and (when real env is set) that the live database
 * schema matches the spec.
 */
import { describe, it, expect, vi } from 'vitest'
import { execFileSync } from 'node:child_process'

/**
 * Whether a value is a placeholder (unset, `<...>`, or `...example...`).
 * @param {string} value - The env value to check.
 * @returns {boolean} True if the value is not a real credential.
 */
const isPlaceholder = (value) =>
  !value || value.includes('<') || value.includes('example')

const hasEnv =
  !isPlaceholder(import.meta.env.VITE_SUPABASE_URL) &&
  !isPlaceholder(import.meta.env.VITE_SUPABASE_ANON_KEY)

describe('client', () => {
  it('client_exports_supabase', async () => {
    vi.stubEnv('VITE_SUPABASE_URL', 'https://example.supabase.co')
    vi.stubEnv('VITE_SUPABASE_ANON_KEY', 'fake-anon-key')
    vi.resetModules()

    const { supabase } = await import('./client.js')

    expect(supabase).toBeDefined()
    expect(supabase.from).toBeTypeOf('function')
    vi.unstubAllEnvs()
  })

  it('env_not_committed', () => {
    expect(() => execFileSync('git', ['check-ignore', '.env'])).not.toThrow()
  })
})

describe.skipIf(!hasEnv)('supabase database', () => {
  it('table_schema_matches', async () => {
    const { supabase } = await import('./client.js')
    const { data, error } = await supabase
      .from('creators')
      .select('*')
      .limit(1)

    expect(error).toBeNull()
    expect(data).toHaveLength(1)

    const row = data[0]
    const columns = Object.keys(row)
    expect(columns).toEqual(
      expect.arrayContaining([
        'id',
        'created_at',
        'name',
        'url',
        'description',
        'imageURL',
      ]),
    )
  })

  it('seed_has_five_rows', async () => {
    const { supabase } = await import('./client.js')
    const { data, error } = await supabase
      .from('creators')
      .select('*')

    expect(error).toBeNull()
    expect(data.length).toBeGreaterThanOrEqual(5)
    for (const row of data) {
      expect(row.name).toBeTruthy()
      expect(row.url).toBeTruthy()
      expect(row.description).toBeTruthy()
    }
  })
})
