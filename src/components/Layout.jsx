/**
 * Layout: the shared app shell wrapping every route — sticky header with brand
 * wordmark + Home/Add nav, a main content region, and a footer.
 * @param {Object} props
 * @param {React.ReactNode} props.children - The matched route's page.
 * @returns {JSX.Element} The app shell.
 */
import { Link } from 'react-router-dom'

export default function Layout({ children }) {
  return (
    <>
      <header className="app-header">
        <div className="app-header-inner">
          <Link to="/" className="brand">
            Creatorverse
            <span className="brand-dot" aria-hidden="true" />
          </Link>
          <nav className="app-nav" aria-label="Primary">
            <Link to="/" className="btn btn-sm">
              Home
            </Link>
            <Link to="/add" className="btn btn-sm btn-primary">
              Add Creator
            </Link>
          </nav>
        </div>
      </header>
      <main>{children}</main>
      <footer className="app-footer">
        <div className="app-footer-inner">
          <span>Creatorverse — curating the creators worth following.</span>
          <span>© {new Date().getFullYear()} SamuelIVX</span>
        </div>
      </footer>
    </>
  )
}
