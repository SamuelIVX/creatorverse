# Spec: Add a Creator

## Objective
Let users create a new creator through a form that inserts a row into Supabase,
after which the new creator appears in the homepage list. Includes the homepage
entry point that routes to the add form.

## Scope
- Package: `creatorverse`
- Modifies: `src/pages/AddCreator.jsx`, `src/pages/ShowCreators.jsx` (add nav button)
- Off-limits: `client.js`, `Card.jsx`, other pages

## Non-Goals
- No edit/delete here (see `08-update-creator` and `09-delete-creator`).
- No client-side validation beyond required fields (out of scope for prework).

## Requirements
1. THE SYSTEM SHALL show a button on the homepage — visible whether or not the creator list is empty — that navigates to `/add`.
2. THE SYSTEM SHALL present a form with inputs for `name`, `url`, `description`, and optional `imageURL`.
3. THE SYSTEM SHALL mark the `name`, `url`, and `description` inputs as `required`; `imageURL` SHALL remain optional.
4. WHEN `imageURL` is left blank, THE SYSTEM SHALL insert `null` for that column rather than an empty string.
5. WHEN the user submits the form, THE SYSTEM SHALL insert a new row into `creators` using async/await.
6. WHEN the insert succeeds, THE SYSTEM SHALL navigate back so the new creator appears in the homepage list; WHEN the insert returns an error, THE SYSTEM SHALL remain on the page and surface the error (navigation occurs only on success).
7. THE SYSTEM SHALL use controlled inputs bound to component state.

## Design
```jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../client'

export default function AddCreator() {
  const [form, setForm] = useState({ name: '', url: '', description: '', imageURL: '' })
  const navigate = useNavigate()

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    // imageURL is optional: store null (not an empty string) when left blank,
    // so the nullable column reflects "no image" rather than "".
    const payload = { ...form, imageURL: form.imageURL || null }
    const { error } = await supabase.from('creators').insert(payload)
    if (error) return // surface error + stay on page; navigate only on success
    navigate('/')
  }
  // form with required name/url/description inputs + optional imageURL + submit button
}
```
Homepage gains: `<Link to="/add"><button>Add Creator</button></Link>`.

## Current State
- `AddCreator` renders placeholder content from spec 03. [confirmed]
- `/add` route defined. [confirmed — spec 03]

## Tests
- `nav_button_routes_to_add`: homepage button navigates to `/add`.
- `form_has_all_fields`: inputs exist for name, url, description, imageURL.
- `submit_inserts_row`: submit calls `insert` with the form values.
- `required_fields_enforced`: `name`, `url`, and `description` inputs carry the `required` attribute.
- `blank_image_inserts_null`: submitting with an empty `imageURL` inserts `null` for that column.
- `error_keeps_page`: when `insert` returns an error, the page does not navigate away.
- `new_creator_appears`: after insert + nav, the creator is in the homepage list.

## Constraints
- Dependencies: `02-supabase-database`, `03-app-structure-and-routing`, `05-view-all-creators`.
- Backward compatibility: inserted column names must match the schema in spec 02.

## Context
- React Forms: https://reactjs.org/docs/forms.html
- Handling Events: https://reactjs.org/docs/handling-events.html
