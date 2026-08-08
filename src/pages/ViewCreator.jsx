/**
 * ViewCreator: detail page for a single creator at /creator/:id.
 * Uses the shared useCreator hook to load the record, then renders its full
 * info plus an Edit link. Handles loading, not-found, and loaded states.
 */
import { useParams, Link } from 'react-router-dom'
import { useCreator } from '../lib/useCreator'

/**
 * Renders a creator's full details.
 * @returns {JSX.Element} Loading, not-found, or the creator's details.
 */
export default function ViewCreator() {
  const { id } = useParams()
  const { creator, loading } = useCreator(id)

  if (loading) return <p>Loading…</p>
  if (!creator) return <p>Creator not found.</p>

  return (
    <article>
      {creator.imageURL && <img src={creator.imageURL} alt={creator.name} />}
      <h1>{creator.name}</h1>
      <p>{creator.description}</p>
      <a href={creator.url} target="_blank" rel="noreferrer">
        Visit channel
      </a>
      <Link to={`/edit/${creator.id}`}>Edit</Link>
    </article>
  )
}
