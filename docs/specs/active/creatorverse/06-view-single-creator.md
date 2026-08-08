# Spec: View a Single Creator (Detail Page)

## Objective
Render a detail page for the creator identified in the URL, fetching that one
record from Supabase and displaying its full information. Reached by clicking a
creator on the homepage.

## Scope
- Package: `creatorverse`
- Modifies: `src/pages/ViewCreator.jsx`
- Off-limits: `Card.jsx`, `ShowCreators.jsx`, `client.js`

## Non-Goals
- No editing/deleting here (edit link is added in `08-update-creator`).

## Requirements
1. WHEN `ViewCreator` mounts, THE SYSTEM SHALL read `id` from the route via `useParams`.
2. THE SYSTEM SHALL fetch the single matching creator from `creators` using async/await.
3. THE SYSTEM SHALL display the creator's `name` and `description`, render `url` as a link to their external channel, and render the image when `imageURL` is present.
4. WHEN a user clicks a creator on the homepage, THE SYSTEM SHALL navigate to that creator's unique `/creator/:id` URL and show their details.
5. THE SYSTEM SHALL distinguish three states — loading, loaded, and not-found — and WHEN no creator matches the `id`, THE SYSTEM SHALL display a not-found message rather than remaining on the loading indicator.

## Design
```jsx
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../client'

export default function ViewCreator() {
  const { id } = useParams()
  const [creator, setCreator] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCreator = async () => {
      // maybeSingle() returns data: null (no error) when no row matches,
      // so a bad/deleted id resolves to the not-found state instead of
      // hanging on the loading indicator.
      const { data } = await supabase
        .from('creators').select('*').eq('id', id).maybeSingle()
      setCreator(data)
      setLoading(false)
    }
    fetchCreator()
  }, [id])

  if (loading) return <p>Loading…</p>
  if (!creator) return <p>Creator not found.</p>
  return (
    <article>
      {creator.imageURL && <img src={creator.imageURL} alt={creator.name} />}
      <h1>{creator.name}</h1>
      <p>{creator.description}</p>
      <a href={creator.url} target="_blank" rel="noreferrer">Visit channel</a>
    </article>
  )
}
```

## Current State
- `ViewCreator` renders placeholder content from spec 03. [confirmed]
- `/creator/:id` route is defined. [confirmed — spec 03]

## Tests
- `reads_id_param`: component reads `id` from `useParams`.
- `fetches_single_creator`: query filters by `eq('id', id)` and uses `.maybeSingle()`.
- `renders_creator_fields`: name, description, channel link, and image (when `imageURL` is present) render for the fetched record.
- `not_found_state`: an `id` matching no row renders the not-found message, not a perpetual loading indicator.

## Constraints
- Dependencies: `02-supabase-database`, `03-app-structure-and-routing`.
- Backward compatibility: depends on the `/creator/:id` route path staying stable.

## Context
- Array.filter (alternative client-side approach): https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
