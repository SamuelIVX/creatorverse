/**
 * Card: displays a single creator summary on the homepage.
 * Pure presentational — receives the creator's data via props. Renders an image
 * (or an initial-letter fallback when imageURL is missing/failed), name,
 * description, channel link, and links to the detail and edit pages.
 */
import { useState } from 'react'
import { Link } from 'react-router-dom'

/**
 * Renders one creator card.
 * @param {Object} props
 * @param {string} props.id - Creator's id, used for the detail/edit links.
 * @param {string} props.name - Creator's display name.
 * @param {string} props.url - Creator's external channel URL.
 * @param {string} props.description - Short description of the creator.
 * @param {string|null} props.imageURL - Image URL; falls back to an initial.
 * @returns {JSX.Element} The card article.
 */
export default function Card({ id, name, url, description, imageURL }) {
  const [imgFailed, setImgFailed] = useState(false)
  const showImage = imageURL && !imgFailed

  return (
    <article className="card">
      <div className="card-media">
        {showImage ? (
          <img
            className="card-image"
            src={imageURL}
            alt={name}
            loading="lazy"
            onError={() => setImgFailed(true)}
          />
        ) : (
          <div className="card-fallback" aria-hidden="true">
            {name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
      <div className="card-body">
        <h3 className="card-name">{name}</h3>
        <p className="card-desc">{description}</p>
        <div className="card-actions">
          <a
            className="btn btn-sm btn-primary"
            href={url}
            target="_blank"
            rel="noreferrer"
          >
            Visit channel
          </a>
          <Link to={`/creator/${id}`} className="btn btn-sm">
            Details
          </Link>
          <Link to={`/edit/${id}`} className="btn btn-sm">
            Edit
          </Link>
        </div>
      </div>
    </article>
  )
}
