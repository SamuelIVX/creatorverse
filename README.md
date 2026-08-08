# Creatorverse

CodePath WEB103 prework — a small full-stack CRUD app for curating the content
creators worth following. React + Vite on the front end, Supabase (hosted
Postgres) as the backend, with every read/write on the async/await pattern.

## TL;DR

Homepage shows at least five creators (name, channel link, description), each
with a unique detail URL; users can add, edit, and delete creators through
forms that persist to the hosted database. Specs live in
`docs/specs/active/creatorverse/` and each is implemented in dependency order
as its own PR.

## Commands

```sh
npm install       # install dependencies
npm run dev       # start the dev server (Vite)
npm run build     # production build
npm run test      # run the Vitest suite once
npm run test:watch# run Vitest in watch mode
npm run lint      # run oxlint
npm run preview   # preview the production build
```

## Setup (Supabase)

1. Create a Supabase project, add the `creators` table (see
   `docs/specs/active/creatorverse/02-supabase-database.md` for the exact
   schema), and seed ≥5 rows.
2. `cp .env.example .env` and fill in your Project URL + anon key
   (Settings → API). `.env` is gitignored — secrets never committed.
3. The two database tests (`table_schema_matches`, `seed_has_five_rows`)
   skip until `.env` has real values, then run automatically.

## Specs (dependency order)

| # | Spec | One-line summary |
|---|------|------------------|
| 01 | `docs/specs/active/creatorverse/01-project-setup.md` | Scaffold a runnable Vite + React app and wire in React Router with a `BrowserRouter` root. |
| 02 | `docs/specs/active/creatorverse/02-supabase-database.md` | Provision the Supabase `creators` table, seed ≥5 rows, and export one shared, env-configured client. |
| 03 | `docs/specs/active/creatorverse/03-app-structure-and-routing.md` | Create the page/component skeleton and define the routes that give each creator a unique URL. |
| 04 | `docs/specs/active/creatorverse/04-creator-card-component.md` | Presentational `Card`: name, channel link, description, conditional image, and a detail-page link. |
| 05 | `docs/specs/active/creatorverse/05-view-all-creators.md` | Homepage fetches all creators via async/await and renders them, with an empty-state message. |
| 06 | `docs/specs/active/creatorverse/06-view-single-creator.md` | Detail page fetches one creator by `id` with loading and not-found states. |
| 07 | `docs/specs/active/creatorverse/07-add-creator.md` | Add form inserts a new creator (blank image → `null`) and it appears in the list. |
| 08 | `docs/specs/active/creatorverse/08-update-creator.md` | Pre-filled edit form updates editable columns only; edit links on Card and detail page. |
| 09 | `docs/specs/active/creatorverse/09-delete-creator.md` | Delete control on the edit page removes the creator; navigate only on success. |
| 10 | `docs/specs/active/creatorverse/10-stretch-styling.md` | Stretch: install PicoCSS, present creators in a card grid, and show creator images. |
| 11 | `docs/specs/active/creatorverse/11-submission-readme.md` | Package for submission: template README with feature checklist + walkthrough, push to GitHub. |

## Map — where things live

- `src/lib/` — shared client + logic; `client.js` is the Supabase client (spec 02), `useCreator.js` the shared single-creator fetch hook.
- `src/components/` — presentational building blocks: `Card` (spec 04) and the shared `CreatorForm` used by both add and edit pages.
- `src/pages/` — thin route templates: each page composes components, reads route params, and wires handlers; data loading lives in the shared `useCreator` hook (spec 06).
- `src/main.jsx` — entry point; wraps `<App />` in `<BrowserRouter>`.
- `src/App.jsx` — route table via `useRoutes` (spec 03).
- `docs/specs/active/creatorverse/` — the spec chain, one file per phase.

Pages orchestrate, components render, hooks hold shared logic.

Tests are co-located: each `*.test.jsx` sits next to the file it tests.

## Current state

Specs 01–09 implemented (CRUD complete): scaffold + toolchain, Supabase
client, routes, Card, list/detail/add/update/delete. The database half of
spec 02 (provisioning the Supabase project + seed) is pending — the app runs
against placeholder `.env` until a real project is configured. Stretch
styling (10) and the submission README (11) are deferred.
