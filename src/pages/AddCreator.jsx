import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/client'

export default function AddCreator() {
  const [form, setForm] = useState({ name: '', url: '', description: '', imageURL: '' })
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    const payload = { ...form, imageURL: form.imageURL || null }
    const { error } = await supabase.from('creators').insert(payload)
    if (error) {
      setError(error.message)
      return
    }
    navigate('/')
  }

  return (
    <main>
      <h1>Add Creator</h1>
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
        <button type="submit">Add Creator</button>
      </form>
    </main>
  )
}
