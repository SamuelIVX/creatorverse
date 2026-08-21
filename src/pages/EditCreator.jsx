/**
 * EditCreator: page for editing (and deleting) a creator at /edit/:id.
 * Uses the shared useCreator hook to load the record, pre-fills CreatorForm,
 * and submits updates back to Supabase. Delete goes through a ConfirmDialog.
 */
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/client'
import { useCreator } from '../lib/useCreator'
import { useToast } from '../lib/useToast'
import CreatorForm from '../components/CreatorForm'
import ConfirmDialog from '../components/ConfirmDialog'
import BackButton from '../components/BackButton'
import AuthGate from '../components/AuthGate'

export default function EditCreator() {
  const { id } = useParams()
  const { creator, loading } = useCreator(id)
  const [form, setForm] = useState({ name: '', url: '', description: '', imageURL: '' })
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const navigate = useNavigate()
  const pushToast = useToast()

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
    setSubmitting(true)
    setError(null)
    try {
      const payload = { ...form, imageURL: form.imageURL || null }
      const { error } = await supabase.from('creators').update(payload).eq('id', id)
      if (error) {
        setError(error.message)
        pushToast('Could not update creator.', 'error')
        return
      }
      pushToast(`${form.name} updated.`)
      navigate(`/creator/${id}`)
    } catch (err) {
      setError(err.message)
      pushToast('Could not update creator.', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      const { error } = await supabase.from('creators').delete().eq('id', id)
      if (error) {
        setConfirmOpen(false)
        setError(error.message)
        pushToast('Could not delete creator.', 'error')
        return
      }
      pushToast('Creator deleted.')
      navigate('/')
    } catch (err) {
      setConfirmOpen(false)
      setError(err.message)
      pushToast('Could not delete creator.', 'error')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <AuthGate fallback="Sign in to edit this creator.">
      {() => (
        <div className="container">
          <div className="page-nav">
            <BackButton />
          </div>
          <div className="page-header">
            <h1 className="page-title">Edit Creator</h1>
          </div>
          {loading ? (
            <p>Loading…</p>
          ) : !creator ? (
            <p>Creator not found.</p>
          ) : (
            <>
              <CreatorForm
                form={form}
                onChange={handleChange}
                onSubmit={handleSubmit}
                submitLabel="Update Creator"
                submitting={submitting}
                error={error}
              >
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => setConfirmOpen(true)}
                  disabled={deleting}
                >
                  {deleting ? 'Deleting…' : 'Delete'}
                </button>
              </CreatorForm>
              <ConfirmDialog
                open={confirmOpen}
                title="Delete this creator?"
                message={`"${creator.name}" will be permanently removed. This cannot be undone.`}
                confirmLabel="Delete"
                disabled={deleting}
                onConfirm={handleDelete}
                onCancel={() => setConfirmOpen(false)}
              />
            </>
          )}
        </div>
      )}
    </AuthGate>
  )
}
