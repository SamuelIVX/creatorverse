/**
 * Root component: defines the app's routes and renders the matched page.
 * Route → page: `/` ShowCreators, `/creator/:id` ViewCreator, `/add`
 * AddCreator, `/edit/:id` EditCreator.
 */
import { useRoutes } from 'react-router-dom'
import ShowCreators from './pages/ShowCreators'
import ViewCreator from './pages/ViewCreator'
import AddCreator from './pages/AddCreator'
import EditCreator from './pages/EditCreator'

/**
 * Renders the page matching the current URL.
 * @returns {JSX.Element} The matched page wrapped in the app shell.
 */
export default function App() {
  const element = useRoutes([
    { path: '/', element: <ShowCreators /> },
    { path: '/creator/:id', element: <ViewCreator /> },
    { path: '/add', element: <AddCreator /> },
    { path: '/edit/:id', element: <EditCreator /> },
  ])
  return <div className="App">{element}</div>
}
