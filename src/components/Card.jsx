/**
 * Card: displays a single creator summary on the homepage.
 * Pure presentational component — receives the creator's data via props and
 * renders an image, name, description, external channel link, and links to
 * the detail and edit pages.
 */
import { Link } from 'react-router-dom'

/**
 * Renders one creator card.
 * @param {Object} props
 * @param {string} props.id - Creator's id, used for the detail/edit links.
 * @param {string} props.name - Creator's display name.
 * @param {string} props.url - Creator's external channel URL.
 * @param {string} props.description - Short description of the creator.
 * @param {string|null} props.imageURL - Image URL; rendered only when present.
 * @returns {JSX.Element} The card article.
 */
export default function Card({ id, name, url, description, imageURL }) {
  return (
    <article>
      {imageURL && <img className="card-image" src={imageURL} alt={name} />}
      <h3>{name}</h3>
      <p>{description}</p>
      <a href={url} target="_blank" rel="noreferrer">
        Visit channel
      </a>
      <Link to={`/creator/${id}`}>View details</Link>
      <Link to={`/edit/${id}`}>Edit</Link>
    </article>
  )
}
