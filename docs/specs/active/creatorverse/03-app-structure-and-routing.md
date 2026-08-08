# Spec: App Structure & Routing

## Objective
Create the page and component skeleton and define the routes that connect them.
This establishes the logical React component structure and gives each creator a
unique URL — the navigational backbone for all CRUD views.

## Scope
- Package: `creatorverse`
- Modifies: `src/App.jsx`, `src/components/Card.jsx` (new), `src/pages/*.jsx` (new)
- Off-limits: `src/lib/client.js`, `src/main.jsx` (owned by specs 01–02)

## Non-Goals
- No data fetching or mutations (later specs fill in behavior).
- Pages/components render placeholder content only at this stage.
- Pages are **not** allowed to grow into business logic: they stay thin templates
  (composition + route params only). Logic lives in hooks, rendering in components.

## Requirements
1. THE SYSTEM SHALL provide a `Card` component under `src/components/` accepting `id`, `name`, `url`, `description`, and `imageURL` props.
2. THE SYSTEM SHALL provide four pages under `src/pages/`: `ShowCreators`, `ViewCreator`, `EditCreator`, `AddCreator`.
3. THE SYSTEM SHALL define routes mapping `/`→`ShowCreators`, `/creator/:id`→`ViewCreator`, `/add`→`AddCreator`, `/edit/:id`→`EditCreator`.
4. WHEN a user navigates to any defined path, THE SYSTEM SHALL render the matching page element inside the `App` container.
5. THE SYSTEM SHALL give each creator a unique URL via its unique `id` in the `/creator/:id` and `/edit/:id` paths, and SHALL expose that `id` to the page via `useParams`.
6. THE SYSTEM SHALL keep every page a thin template: it composes components and reads route params, with no data fetching or business logic (deferred to specs 05–09).

## Design

**Templates vs components:** `src/pages/` holds thin route templates — each page
only composes components and reads route params; it must not fetch data or own
business logic. `src/components/` holds presentational building blocks (e.g.
`Card`) that render props. Data-fetching logic lives in hooks (later specs).

Route table:

| path | element |
|---|---|
| `/` | `ShowCreators` |
| `/creator/:id` | `ViewCreator` |
| `/add` | `AddCreator` |
| `/edit/:id` | `EditCreator` |

`src/App.jsx` using `useRoutes`:
```jsx
import { useRoutes } from 'react-router-dom'
import ShowCreators from './pages/ShowCreators'
import ViewCreator from './pages/ViewCreator'
import AddCreator from './pages/AddCreator'
import EditCreator from './pages/EditCreator'

export default function App() {
  const element = useRoutes([
    { path: '/', element: <ShowCreators /> },
    { path: '/creator/:id', element: <ViewCreator /> },
    { path: '/add', element: <AddCreator /> },
    { path: '/edit/:id', element: <EditCreator /> },
  ])
  return <div className="App">{element}</div>
}
```

## Current State
- `App.jsx` holds Vite starter content. [confirmed — from spec 01]
- No `components/` or `pages/` directories exist yet. [confirmed]

## Tests
- `routes_render_pages`: visiting each path renders the corresponding page component.
- `id_param_readable`: `ViewCreator`/`EditCreator` read `id` from `useParams`.
- `card_accepts_props`: `Card` renders without error given the five props.

## Constraints
- Dependencies: `01-project-setup` (router), and `useRoutes` requires the `BrowserRouter` from spec 01.
- Backward compatibility: must not break the router provider wiring.

## Context
- React Router tutorial: https://reactrouter.com/en/v6.3.0/getting-started/tutorial
- Components and Props: https://reactjs.org/docs/components-and-props.html
