/**
 * Shared hook: fetches a single creator by id and tracks loading state.
 * Used by ViewCreator and EditCreator so both pages share the same fetch,
 * reset, and stale-response handling. Talks to Supabase via ../lib/client.
 */
import { useEffect, useState } from 'react'
import { supabase } from './client'

/**
 * Loads the creator with the given id.
 * @param {string} id - The creator's id (from the route param).
 * @returns {{creator: (object|null), loading: boolean}} The fetched creator
 *   (null while loading or when no row matches), and whether a fetch is in flight.
 * @example
 * const { creator, loading } = useCreator(useParams().id)
 */
export function useCreator(id) {
  const [creator, setCreator] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setCreator(null)

    const fetchCreator = async () => {
      const { data } = await supabase
        .from('creators')
        .select('*')
        .eq('id', id)
        .maybeSingle()
      if (!cancelled) {
        setCreator(data)
        setLoading(false)
      }
    }
    fetchCreator()

    return () => {
      cancelled = true
    }
  }, [id])

  return { creator, loading }
}
