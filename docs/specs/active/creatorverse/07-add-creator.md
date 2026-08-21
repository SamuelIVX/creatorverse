# Spec: Add a Creator

## Objective
Let authenticated users create a new creator through a form that inserts a row into Supabase,
after which the new creator appears in the homepage list. Unauthenticated users are prompted
to sign in before accessing the add form. Includes the homepage entry point that routes to the add form.

## Scope
- Package: `creatorverse`
- Modifies: `src/pages/AddCreator.jsx` (auth gate), `src/pages/ShowCreators.jsx` (add nav button)
- Off-limits: `client.js`, `Card.jsx`, other pages

## Non-Goals
- No edit/delete here (see `08-update-creator` and `09-delete-creator`).
- No client-side validation beyond required fields (out of scope for prework).

## Requirements
1. THE SYSTEM SHALL show a button on the homepage — visible whether or not the creator list is empty — that navigates to `/add`.
2. WHEN a user is not authenticated, THE SYSTEM SHALL prompt them to sign in before showing the add form.
3. WHEN a user is authenticated, THE SYSTEM SHALL present a form with inputs for `name`, `url`, `description`, and optional `imageURL`.
4. THE SYSTEM SHALL mark the `name`, `url`, and `description` inputs as `required`; `imageURL` SHALL remain optional.
5. WHEN `imageURL` is left blank, THE SYSTEM SHALL insert `null` for that column rather than an empty string.
6. WHEN the user submits the form, THE SYSTEM SHALL insert a new row into `creators` using async/await.
7. WHEN the insert succeeds, THE SYSTEM SHALL navigate back so the new creator appears in the homepage list; WHEN the insert returns an error, THE SYSTEM SHALL remain on the page and surface the error (navigation occurs only on success).
8. THE SYSTEM SHALL use controlled inputs bound to component state.

## Design
```jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthGate from '../components/AuthGate'

export default function AddCreator() {
  const [form, setForm] = useState({ name: '', url: '', description: '', imageURL: '' })
  const navigate = useNavigate()

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    const payload = { ...form, imageURL: form.imageURL || null }
    const { error } = await supabase.from('creators').insert(payload)
    if (error) return
    navigate('/')
  }

  return (
    <AuthGate fallback="Sign in to add a creator.">
      {(user) => (
        <form onSubmit={handleSubmit}>
          <input name="name" value={form.name} onChange={handleChange} required />
          <input name="url" value={form.url} onChange={handleChange} required />
          <input name="description" value={form.description} onChange={handleChange} required />
          <input name="imageURL" value={form.imageURL} onChange={handleChange} />
          <button type="submit">Add Creator</button>
        </form>
      )}
    </AuthGate>
  )
}
```
Homepage gains: `<Link to="/add"><button>Add Creator</button></Link>`.

> **Implementation note (refactor):** the four-field form is extracted into the shared `CreatorForm` component in `src/components/CreatorForm.jsx` (also used by `EditCreator`), per the DRY cleanup. The fields, required flags, `imageURL`-optional handling, submit button, and error surface below are unchanged in behavior. `AddCreator` wraps the form in `AuthGate` so only authenticated users can submit.

## Current State
- `AddCreator` renders placeholder content from spec 03. [confirmed]
- `/add` route defined. [confirmed — spec 03]

## Tests
- `nav_button_routes_to_add`: homepage button navigates to `/add`.
- `auth_gate_requires_signin`: unauthenticated users see the sign-in form, not the add form.
- `auth_gate_shows_form_when_authenticated`: authenticated users see the add form.
- `form_has_all_fields`: inputs exist for name, url, description, imageURL.
- `submit_inserts_row`: submit calls `insert` with the form values.
- `required_fields_enforced`: `name`, `url`, and `description` inputs carry the `required` attribute.
- `blank_image_inserts_null`: submitting with an empty `imageURL` inserts `null` for that column.
- `error_keeps_page`: when `insert` returns an error, the page does not navigate away.
- `new_creator_appears`: after insert + nav, the creator is in the homepage list.

## Constraints
- Dependencies: `02-supabase-database`, `03-app-structure-and-routing`, `05-view-all-creators`, `13-auth`.
- Backward compatibility: inserted column names must match the schema in spec 02.

## Context
- React Forms: https://reactjs.org/docs/forms.html
- Handling Events: https://reactjs.org/docs/handling-events.html
