/**
 * AddCreator: page for creating a new creator at /add.
 * Owns form state and submits a new row to Supabase via CreatorForm; on
 * success shows a toast and navigates to the homepage.
 */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/client'
import { useToast } from '../lib/useToast'
import CreatorForm from '../components/CreatorForm'
import BackButton from '../components/BackButton'
import AuthGate from '../components/AuthGate'

export default function AddCreator() {
  const [form, setForm] = useState({ name: '', url: '', description: '', imageURL: '' })
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()
  const pushToast = useToast()

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      const payload = { ...form, imageURL: form.imageURL || null }
      const { error } = await supabase.from('creators').insert(payload)
      if (error) {
        setError(error.message)
        pushToast('Could not add creator.', 'error')
        return
      }
      pushToast(`${form.name} added.`)
      navigate('/')
    } catch (err) {
      setError(err.message)
      pushToast('Could not add creator.', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthGate fallback="Sign in to add a creator.">
      {() => (
        <div className="container">
          <div className="page-nav">
            <BackButton />
          </div>
          <div className="page-header">
            <h1 className="page-title">Add Creator</h1>
          </div>
          <CreatorForm
            form={form}
            onChange={handleChange}
            onSubmit={handleSubmit}
            submitLabel="Add Creator"
            submitting={submitting}
            error={error}
          />
        </div>
      )}
    </AuthGate>
  )
}
