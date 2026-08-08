# Creatorverse

CodePath WEB103 prework — a small full-stack CRUD app for curating the content
creators worth following. React + Vite on the front end, Supabase (hosted
Postgres) as the backend, with every read/write on the async/await pattern.

## TL;DR

Homepage shows at least five creators (name, channel link, description), each
with a unique detail URL; users can add, edit, and delete creators through
forms that persist to the hosted database. Specs live in `docs/specs/active/`
and each is implemented in dependency order as its own PR.

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

## Specs (dependency order)

| # | Spec | One-line summary |
|---|------|------------------|
| 01 | `docs/specs/active/01-project-setup.md` | Scaffold a runnable Vite + React app and wire in React Router with a `BrowserRouter` root. |
| 02 | `docs/specs/active/02-supabase-database.md` | Provision the Supabase `creators` table, seed ≥5 rows, and export one shared, env-configured client. |
| 03 | `docs/specs/active/03-app-structure-and-routing.md` | Create the page/component skeleton and define the routes that give each creator a unique URL. |
| 04 | `docs/specs/active/04-creator-card-component.md` | Presentational `Card`: name, channel link, description, conditional image, and a detail-page link. |
| 05 | `docs/specs/active/05-view-all-creators.md` | Homepage fetches all creators via async/await and renders them, with an empty-state message. |
| 06 | `docs/specs/active/06-view-single-creator.md` | Detail page fetches one creator by `id` with loading and not-found states. |
| 07 | `docs/specs/active/07-add-creator.md` | Add form inserts a new creator (blank image → `null`) and it appears in the list. |
| 08 | `docs/specs/active/08-update-creator.md` | Pre-filled edit form updates editable columns only; edit links on Card and detail page. |
| 09 | `docs/specs/active/09-delete-creator.md` | Delete control on the edit page removes the creator; navigate only on success. |
| 10 | `docs/specs/active/10-stretch-styling.md` | Stretch: install PicoCSS, present creators in a card grid, and show creator images. |
| 11 | `docs/specs/active/11-submission-readme.md` | Package for submission: template README with feature checklist + walkthrough, push to GitHub. |

## Map — where things live

- `src/main.jsx` — entry point; wraps `<App />` in `<BrowserRouter>`.
- `src/App.jsx` — route table via `useRoutes` (implemented in spec 03).
- `src/pages/` — `ShowCreators`, `ViewCreator`, `AddCreator`, `EditCreator`.
- `src/components/` — `Card` (presentational creator card).
- `src/client.js` — single shared Supabase client (spec 02).
- `docs/specs/active/` — the spec chain, one file per phase.

## Current state

Spec 01 (project setup + toolchain) implemented. Remaining specs 02–09 in
progress; stretch (10) and submission README (11) deferred.
