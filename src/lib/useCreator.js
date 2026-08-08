import { useEffect, useState } from 'react'
import { supabase } from './client'

export function useCreator(id) {
  const [creator, setCreator] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCreator = async () => {
      const { data } = await supabase
        .from('creators')
        .select('*')
        .eq('id', id)
        .maybeSingle()
      setCreator(data)
      setLoading(false)
    }
    fetchCreator()
  }, [id])

  return { creator, loading }
}
