import { useEffect, useState } from 'react'
import { supabase } from './client'

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
