# Spec: View All Creators (Homepage)

## Objective
Fetch every creator from Supabase and render them on the homepage as `Card`
components, with a friendly empty-state when the table has no rows. This is the
app's primary read view.

## Scope
- Package: `creatorverse`
- Modifies: `src/pages/ShowCreators.jsx`
- Off-limits: `Card.jsx`, `client.js`, other pages

## Non-Goals
- No create/edit/delete here (those live in specs 07–09).
- The "Add creator" nav button is defined in `07-add-creator`.

## Requirements
1. WHEN `ShowCreators` mounts, THE SYSTEM SHALL fetch all rows from `creators` using async/await via the Supabase client.
2. THE SYSTEM SHALL render one `Card` per creator, passing `id`, `name`, `url`, `description`, `imageURL`.
3. THE SYSTEM SHALL render every creator returned by the fetch. (The ≥5-creator requirement is satisfied by the seed data owned by `02-supabase-database`; this page renders whatever it is given.)
4. WHEN the `creators` table is empty, THE SYSTEM SHALL display an empty-state message instead of an empty page.
5. THE SYSTEM SHALL store fetched creators in component state via the state hook.

## Design
```jsx
import { useEffect, useState } from 'react'
import { supabase } from '../client'
import Card from '../components/Card'

export default function ShowCreators() {
  const [creators, setCreators] = useState([])

  useEffect(() => {
    const fetchCreators = async () => {
      const { data } = await supabase.from('creators').select('*')
      setCreators(data ?? [])
    }
    fetchCreators()
  }, [])

  return (
    <main>
      {/* The "Add Creator" nav button (07-add-creator) mounts here, above the
          list, so it stays visible in BOTH the empty and populated states. */}
      {creators.length === 0
        ? <p>No creators yet — add one!</p>
        : creators.map((c) => <Card key={c.id} {...c} />)}
    </main>
  )
}
```

## Current State
- `ShowCreators` renders placeholder content from spec 03. [confirmed]
- `creators` table has ≥ 5 seeded rows. [confirmed — seeded by `02-supabase-database`; more can be added via the spec 07 form]
- Prework Step 5 places the `useEffect` fetch in `App`; this spec intentionally
  relocates it into the `ShowCreators` page so `App` stays a pure router shell.
  Functionally equivalent for grading. [confirmed — deviation documented]

## Tests
- `fetches_on_mount`: a `select('*')` against `creators` runs on mount.
- `renders_all_creators`: N rows → N Card components (N ≥ 5 with seed data present).
- `empty_state_message`: 0 rows renders the empty-state message.

## Constraints
- Dependencies: `02-supabase-database` (client + seeded data), `04-creator-card-component`.
- Backward compatibility: relies on Card's five-prop contract.

## Context
- Using the State Hook: https://reactjs.org/docs/hooks-state.html
- Array.map: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map
- Async/Await: https://javascript.info/async-await
