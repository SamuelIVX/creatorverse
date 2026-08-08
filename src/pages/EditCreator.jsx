import { useParams } from 'react-router-dom'

export default function EditCreator() {
  const { id } = useParams()
  return (
    <main>
      <h1>Edit Creator {id}</h1>
      <p>Edit form coming soon.</p>
    </main>
  )
}
