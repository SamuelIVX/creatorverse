import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/client'
import CreatorForm from '../components/CreatorForm'

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
      <CreatorForm
        form={form}
        onChange={handleChange}
        onSubmit={handleSubmit}
        submitLabel="Add Creator"
        error={error}
      />
    </main>
  )
}
