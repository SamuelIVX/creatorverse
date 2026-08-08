import { useEffect, useState } from 'react'
import { supabase } from '../lib/client'
import Card from '../components/Card'

export default function ShowCreators() {
  const [creators, setCreators] = useState([])

  useEffect(() => {
    const fetchCreators = async () => {
      const { data } = await supabase.from('creators').select('*')
      setCreators(data ?? [])
    }
    fetchCreators()
  }, [])

  return (
    <main>
      {creators.length === 0 ? (
        <p>No creators yet — add one!</p>
      ) : (
        creators.map((creator) => (
          <Card key={creator.id} {...creator} />
        ))
      )}
    </main>
  )
}
