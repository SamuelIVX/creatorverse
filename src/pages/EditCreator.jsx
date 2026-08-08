import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/client'
import { useCreator } from '../lib/useCreator'
import CreatorForm from '../components/CreatorForm'

export default function EditCreator() {
  const { id } = useParams()
  const { creator, loading } = useCreator(id)
  const [form, setForm] = useState({ name: '', url: '', description: '', imageURL: '' })
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (creator) {
      const { id: _id, created_at: _createdAt, ...editable } = creator
      setForm({ ...editable, imageURL: editable.imageURL ?? '' })
    }
  }, [creator])

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

  const handleDelete = async () => {
    const { error } = await supabase.from('creators').delete().eq('id', id)
    if (error) {
      setError(error.message)
      return
    }
    navigate('/')
  }

  if (loading) return <p>Loading…</p>
  if (!creator) return <p>Creator not found.</p>

  return (
    <main>
      <h1>Edit Creator</h1>
      <CreatorForm
        form={form}
        onChange={handleChange}
        onSubmit={handleSubmit}
        submitLabel="Update Creator"
        error={error}
      >
        <button type="button" onClick={handleDelete}>Delete</button>
      </CreatorForm>
    </main>
  )
}
