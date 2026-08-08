# Spec: Supabase Database & Client

## Objective
Provision a Supabase project with a `creators` table and connect the frontend to
it via a shared Supabase client module. This gives every CRUD feature a single,
importable database handle.

## Scope
- Package: `creatorverse`
- Modifies: `src/client.js` (new), `.env` (new), `.gitignore`, `package.json`
- External: Supabase project + `creators` table (created via Supabase dashboard)
- Off-limits: page/component files (owned by later specs)

## Non-Goals
- No queries/mutations here — only the client, schema, and initial seed data (application reads/writes live in specs 05–09).
- No Row Level Security policies (RLS is disabled for this prework).

## Requirements
1. THE SYSTEM SHALL provide a Supabase project named `creatorverse`.
2. THE SYSTEM SHALL define a `creators` table with columns `id` (int8, PK, auto), `created_at` (timestamptz, default `now()` — kept from the Supabase table-editor default), `name` (text), `url` (text), `description` (text), and `imageURL` (text, nullable). `id` and `created_at` are non-editable system columns; `name`, `url`, `description`, and `imageURL` are the editable application columns.
3. THE SYSTEM SHALL have Row Level Security **disabled** and Realtime **enabled** on the `creators` table.
4. THE SYSTEM SHALL install `@supabase/supabase-js`.
5. THE SYSTEM SHALL export a single configured `supabase` client from `src/client.js`.
6. WHEN the client is constructed, THE SYSTEM SHALL read the project URL and anon key from environment variables and SHALL NOT commit those secrets to version control; THE SYSTEM SHALL add `.env` to `.gitignore` (ownership handed over by `01-project-setup` R5, which creates `.gitignore` but leaves the `.env` entry to this spec since `.env` is created here).
7. THE SYSTEM SHALL seed the `creators` table with at least five complete rows (`name`, `url`, `description`; `imageURL` optional) via the Supabase table editor, satisfying the homepage's ≥5-creator requirement (owned here; consumed by `05-view-all-creators`).
8. THE SYSTEM SHALL create the `imageURL` column with that exact mixed-case spelling. Postgres folds unquoted identifiers to lowercase, so the column must be created via the Supabase table editor (which quotes identifiers) — not via raw unquoted SQL — so query results key on `imageURL` as the app expects.

## Design
`src/client.js`:
```js
import { createClient } from '@supabase/supabase-js'

const URL = import.meta.env.VITE_SUPABASE_URL
const API_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(URL, API_KEY)
```
`.env`:
```
VITE_SUPABASE_URL=<project url>
VITE_SUPABASE_ANON_KEY=<anon key>
```
Table schema:

| column | type | editable? | notes |
|---|---|---|---|
| `id` | int8 | no (system) | primary key, auto-generated |
| `created_at` | timestamptz | no (system) | default `now()`; kept from the Supabase table-editor default |
| `name` | text | yes | required |
| `url` | text | yes | channel/page link |
| `description` | text | yes | short blurb |
| `imageURL` | text | yes | optional/nullable; create via table editor to preserve mixed-case name |

The two system columns (`id`, `created_at`) are excluded from all update/insert
payloads by the mutation specs (`07-add-creator`, `08-update-creator`).

## Current State
- No Supabase project exists yet. [confirmed — greenfield]
- Prework instructs hard-coding `URL`/`API_KEY` in `client.js`; this spec uses
  env vars instead to avoid leaking keys to GitHub. Functionally equivalent for
  grading. [confirmed — deviation documented]

## Tests
- `client_exports_supabase`: importing `{ supabase }` yields a defined client.
- `env_not_committed`: `git check-ignore .env` succeeds.
- `table_schema_matches`: `select` on `creators` returns the six expected columns (`id`, `created_at`, `name`, `url`, `description`, `imageURL`), with `imageURL` in exact casing.
- `seed_has_five_rows`: `select('*')` on `creators` returns ≥ 5 complete rows.

## Constraints
- Dependencies: `01-project-setup` must merge first.
- Backward compatibility: n/a.

## Context
- Supabase: https://supabase.com/
- Supabase JS library: https://supabase.com/docs/reference/javascript/introduction
