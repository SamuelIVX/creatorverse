import { Link } from 'react-router-dom'

export default function Card({ id, name, url, description, imageURL }) {
  return (
    <article>
      {imageURL && <img src={imageURL} alt={name} />}
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
