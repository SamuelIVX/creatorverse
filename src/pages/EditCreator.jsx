import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/client'

export default function EditCreator() {
  const { id } = useParams()
  const [form, setForm] = useState({ name: '', url: '', description: '', imageURL: '' })
  const [loading, setLoading] = useState(true)
  const [found, setFound] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('creators')
        .select('*')
        .eq('id', id)
        .maybeSingle()
      if (data) {
        const { id: _id, created_at: _createdAt, ...editable } = data
        setForm({ ...editable, imageURL: editable.imageURL ?? '' })
        setFound(true)
      }
      setLoading(false)
    }
    load()
  }, [id])

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    const payload = { ...form, imageURL: form.imageURL || null }
    const { error } = await supabase.from('creators').update(payload).eq('id', id)
    if (error) {
      setError(error.message)
      return
    }
    navigate(`/creator/${id}`)
  }

  if (loading) return <p>Loading…</p>
  if (!found) return <p>Creator not found.</p>

  return (
    <main>
      <h1>Edit Creator</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">
          Name
          <input
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </label>
        <label htmlFor="url">
          URL
          <input
            id="url"
            name="url"
            value={form.url}
            onChange={handleChange}
            required
          />
        </label>
        <label htmlFor="description">
          Description
          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            required
          />
        </label>
        <label htmlFor="imageURL">
          Image URL (optional)
          <input
            id="imageURL"
            name="imageURL"
            value={form.imageURL}
            onChange={handleChange}
          />
        </label>
        {error && <p role="alert">{error}</p>}
        <button type="submit">Update Creator</button>
      </form>
    </main>
  )
}
