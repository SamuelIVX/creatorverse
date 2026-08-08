/**
 * ViewCreator: detail page for a single creator at /creator/:id.
 * Uses the shared useCreator hook to load the record, then renders a profile
 * layout (cover band, avatar, name, description, channel link, edit action).
 * Handles loading, not-found, and loaded states.
 */
import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useCreator } from '../lib/useCreator'
import BackButton from '../components/BackButton'

/**
 * Renders a creator's full details.
 * @returns {JSX.Element} Loading, not-found, or the creator's profile.
 */
export default function ViewCreator() {
  const { id } = useParams()
  const { creator, loading } = useCreator(id)
  const [failedImageURL, setFailedImageURL] = useState(null)

  if (loading) return <p>Loading…</p>
  if (!creator) return <p>Creator not found.</p>

  const showImage = creator.imageURL && failedImageURL !== creator.imageURL

  return (
    <div className="container">
      <div className="page-nav">
        <BackButton />
      </div>
      <article className="profile">
        <div className="profile-cover" aria-hidden="true" />
        <div className="profile-main">
          {showImage ? (
            <img
              className="profile-avatar"
              src={creator.imageURL}
              alt={creator.name}
              onError={() => setFailedImageURL(creator.imageURL)}
            />
          ) : (
            <div
              className="profile-avatar profile-avatar-fallback"
              aria-hidden="true"
            >
              {creator.name.charAt(0).toUpperCase()}
            </div>
          )}
          <h1 className="profile-name">{creator.name}</h1>
          <p className="profile-desc">{creator.description}</p>
          <p className="profile-meta">
            Added {new Date(creator.created_at).toLocaleDateString()}
          </p>
          <div className="profile-actions">
            <a
              className="btn btn-primary"
              href={creator.url}
              target="_blank"
              rel="noreferrer"
            >
              Visit channel
            </a>
            <Link to={`/edit/${creator.id}`} className="btn">
              Edit
            </Link>
          </div>
        </div>
      </article>
    </div>
  )
}
