# Spec: Update a Creator

## Objective
Let users edit an existing creator via a pre-populated form that writes changes
back to Supabase. Includes edit entry points on the card and the detail page.

## Scope
- Package: `creatorverse`
- Modifies: `src/pages/EditCreator.jsx`, `src/components/Card.jsx` (edit link), `src/pages/ViewCreator.jsx` (edit link)
- Off-limits: `client.js`, `ShowCreators.jsx`, `AddCreator.jsx`

## Non-Goals
- No delete here (see `09-delete-creator`) — though the delete button physically
  lives on this page per the prework, its behavior is specified separately.

## Requirements
1. WHEN `EditCreator` mounts, THE SYSTEM SHALL read `id` via `useParams` and fetch that creator with `.maybeSingle()`.
2. THE SYSTEM SHALL distinguish loading, loaded, and not-found states, and WHEN no creator matches the `id`, THE SYSTEM SHALL display a not-found message rather than a blank form (mirroring `06-view-single-creator`).
3. THE SYSTEM SHALL pre-populate a form with the creator's existing `name`, `url`, `description`, and `imageURL`, coercing a `null` `imageURL` to `''` for the controlled input.
4. THE SYSTEM SHALL mark the `name`, `url`, and `description` inputs as `required`; `imageURL` SHALL remain optional.
5. WHEN the user submits, THE SYSTEM SHALL update the matching row in `creators` (`eq('id', id)`) using async/await, sending only the editable application columns (`name`, `url`, `description`, `imageURL`) and excluding the system columns (`id`, `created_at`) defined in `02-supabase-database`, and writing `null` for a blank `imageURL` (consistent with `07-add-creator`).
6. WHEN the update succeeds, THE SYSTEM SHALL navigate so the changes are reflected; WHEN it returns an error, THE SYSTEM SHALL remain on the page and surface the error (navigation occurs only on success).
7. THE SYSTEM SHALL provide an "Edit" button/link to `/edit/:id` on both the `Card` and the `ViewCreator` page.

## Design
```jsx
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../client'

export default function EditCreator() {
  const { id } = useParams()
  const [form, setForm] = useState({ name: '', url: '', description: '', imageURL: '' })
  const [loading, setLoading] = useState(true)
  const [found, setFound] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const load = async () => {
      // maybeSingle() (matching ViewCreator) resolves a bad/deleted id to
      // data: null instead of erroring, so we can show a not-found state.
      const { data } = await supabase
        .from('creators').select('*').eq('id', id).maybeSingle()
      if (data) {
        // Drop the system columns (id, created_at — see 02-supabase-database)
        // so the form (and the update payload) holds only editable columns;
        // coerce a null imageURL to '' for the controlled input.
        const { id: _id, created_at: _createdAt, ...editable } = data
        setForm({ ...editable, imageURL: editable.imageURL ?? '' })
        setFound(true)
      }
      setLoading(false)
    }
    load()
  }, [id])

  const handleSubmit = async (e) => {
    e.preventDefault()
    // Normalize blank imageURL to null, consistent with AddCreator.
    const payload = { ...form, imageURL: form.imageURL || null }
    const { error } = await supabase.from('creators').update(payload).eq('id', id)
    if (error) return // surface error + stay on page; navigate only on success
    navigate(`/creator/${id}`)
  }

  if (loading) return <p>Loading…</p>
  if (!found) return <p>Creator not found.</p>
  // pre-filled controlled form (required name/url/description) + submit button
}
```
Edit entry points: `<Link to={`/edit/${id}`}>Edit</Link>` on Card and ViewCreator.

> **Implementation note (refactor):** the fetch comes from the shared `useCreator(id)` hook (`src/lib/useCreator.js`) — the hook owns fetching and the shared `creator`/`loading` state (resetting both on `id` change and ignoring stale responses); `EditCreator` retains the loading and not-found render guards and owns the form state, prefill, update, and delete. The four-field form is rendered by the shared `CreatorForm` component (`src/components/CreatorForm.jsx`) with `EditCreator` supplying `form`, `onChange`, `onSubmit`, and the delete button via `children`. Behavior is unchanged from the design above.

## Current State
- `EditCreator` renders placeholder content from spec 03. [confirmed]
- `/edit/:id` route defined. [confirmed — spec 03]

## Tests
- `loads_existing_values`: form fields are pre-filled from the fetched creator.
- `not_found_state`: an `id` matching no row renders the not-found message, not a blank form.
- `submit_updates_row`: submit calls `update` filtered by `eq('id', id)`.
- `update_payload_excludes_system_columns`: the object passed to `update` contains only the editable columns (`name`, `url`, `description`, `imageURL`) — not the system columns `id` or `created_at`.
- `blank_image_updates_null`: clearing `imageURL` writes `null` for that column.
- `error_keeps_page`: when `update` returns an error, the page does not navigate away.
- `edit_links_present`: Card and ViewCreator each link to `/edit/:id`.

## Constraints
- Dependencies: `02-supabase-database`, `03-app-structure-and-routing`, `04-creator-card-component` (R5 adds an edit link to the Card), `06-view-single-creator`.
- Backward compatibility: shares the `/edit/:id` route with `09-delete-creator`; keep the page component stable.

## Context
- Handling Events: https://reactjs.org/docs/handling-events.html
- W3Schools React Events: https://www.w3schools.com/react/react_events.asp
