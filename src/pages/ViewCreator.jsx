import { useParams } from 'react-router-dom'

export default function ViewCreator() {
  const { id } = useParams()
  return (
    <main>
      <h1>Creator {id}</h1>
      <p>Creator details coming soon.</p>
    </main>
  )
}
