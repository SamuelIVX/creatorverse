/**
 * Layout: the shared app shell wrapping every route — sticky header with brand
 * wordmark, a main content region, and a footer. The brand links home, so no
 * nav links are needed.
 * @param {Object} props
 * @param {React.ReactNode} props.children - The matched route's page.
 * @returns {JSX.Element} The app shell.
 */
import { Link, useLocation } from 'react-router-dom'

export default function Layout({ children }) {
  const { pathname } = useLocation()

  return (
    <>
      <header className="app-header">
        <div className="app-header-inner">
          <Link to="/" className="brand">
            Creatorverse
            <span className="brand-dot" aria-hidden="true" />
          </Link>
        </div>
      </header>
      <main>
        <div className="page-enter" key={pathname}>
          {children}
        </div>
      </main>
      <footer className="app-footer">
        <div className="app-footer-inner">
          <span>Creatorverse — curating the creators worth following.</span>
          <span>© {new Date().getFullYear()} SamuelIVX</span>
        </div>
      </footer>
    </>
  )
}
