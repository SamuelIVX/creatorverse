# Spec: Project Setup (Vite + React + Router)

## Objective
Scaffold a runnable React application using Vite and wire in client-side routing
via React Router. This establishes the foundation every other spec builds on: a
dev server, an entry point, and a router provider.

## Scope
- Package: `creatorverse` (new project root)
- Modifies: `index.html`, `src/main.jsx`, `src/App.jsx`, `package.json`, `.gitignore`
- Off-limits: none (greenfield)

## Non-Goals
- No database wiring (see `02-supabase-database`).
- No pages, components, or route definitions (see `03-app-structure-and-routing`).
- No styling (see `10-stretch-styling`).

## Requirements
1. WHEN a developer runs `npm create vite@latest creatorverse -- --template react` and `npm install`, THE SYSTEM SHALL produce a React project that builds without errors.
2. WHEN a developer runs `npm run dev`, THE SYSTEM SHALL serve the starter app locally with no console errors.
3. THE SYSTEM SHALL install `react-router-dom` as a dependency.
4. THE SYSTEM SHALL wrap the application root in a `BrowserRouter` so routing context is available to all descendants.
5. THE SYSTEM SHALL exclude the dependency artifact `node_modules` from version control. (The `.env` ignore entry is owned by `02-supabase-database`, where `.env` is created.)

## Design
`src/main.jsx`:
```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
```
`.gitignore` must include `node_modules`. (`02-supabase-database` adds the `.env` entry when it creates that file.)

## Current State
- Project does not yet exist. [confirmed — greenfield]
- Node/npm assumed available in the dev environment. [assumed]
- `src/App.jsx` is left as the Vite starter here and is rewritten to use `useRoutes` by `03-app-structure-and-routing`. [confirmed — shared file, sequential ownership]

## Tests
- `builds_cleanly`: `npm run build` exits 0.
- `dev_server_starts`: `npm run dev` serves without runtime errors.
- `router_context_available`: a descendant component can call `useNavigate()`/`useParams()` without throwing.

## Constraints
- Dependencies: none (this spec must merge first).
- Backward compatibility: n/a (first spec).

## Context
- Getting Started with Vite: https://vitejs.dev/guide
- React Router: https://reactrouter.com/en/main
