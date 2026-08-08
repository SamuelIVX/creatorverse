/**
 * ShowCreators: the homepage. Fetches all creators from Supabase on mount and
 * renders a Card per creator, or an empty-state message. Links to /add.
 */
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/client'
import Card from '../components/Card'

/**
 * Renders the list of creators.
 * @returns {JSX.Element} The homepage with the add link and card list.
 */
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
      <Link to="/add">
        <button type="button">Add Creator</button>
      </Link>
      {creators.length === 0 ? (
        <p>No creators yet — add one!</p>
      ) : (
        <div className="creator-grid">
          {creators.map((creator) => (
            <Card key={creator.id} {...creator} />
          ))}
        </div>
      )}
    </main>
  )
}
