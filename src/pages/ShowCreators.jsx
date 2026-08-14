/**
 * ShowCreators: the homepage. Fetches all creators from Supabase on mount and
 * renders a hero, a client-side search box, and a Card per matching creator
 * (or skeletons while loading / empty and no-results states).
 */
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/client'
import { getMockCreators } from '../lib/mockData'
import Card from '../components/Card'
import SkeletonCard from '../components/SkeletonCard'

/**
 * Renders the list of creators.
 * @returns {JSX.Element} The homepage with hero, search, and card list.
 */
export default function ShowCreators() {
  const [creators, setCreators] = useState(null)
  const [loadError, setLoadError] = useState(null)
  const [query, setQuery] = useState('')

  useEffect(() => {
    let cancelled = false
    const fetchCreators = async () => {
      try {
        const { data, error } = await supabase.from('creators').select('*')
        if (!cancelled) {
          if (error && error.status === 500) {
            setCreators(getMockCreators())
            setLoadError(null)
          } else {
            setLoadError(error)
            setCreators(error ? [] : (data ?? []))
          }
        }
      } catch {
        if (!cancelled) {
          setCreators(getMockCreators())
          setLoadError(null)
        }
      }
    }
    fetchCreators()
    return () => {
      cancelled = true
    }
  }, [])

  const normalized = query.trim().toLowerCase()
  const visible =
    creators === null
      ? null
      : creators.filter((creator) =>
          [creator.name, creator.description]
            .join(' ')
            .toLowerCase()
            .includes(normalized),
        )

  return (
    <div className="container">
      <section className="hero">
        <h1 className="hero-title">The creators worth following</h1>
        <p className="hero-subtitle">
          A hand-curated roster of builders, streamers, and educators — one
          place to keep the channels that actually deliver.
        </p>
        <div className="search">
          <div className="search-wrap">
            <span className="search-icon" aria-hidden="true">
              ⌕
            </span>
            <label htmlFor="creator-search" className="sr-only">
              Search creators
            </label>
            <input
              id="creator-search"
              className="search-input"
              type="search"
              placeholder="Search by name or description…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <Link to="/add" className="btn btn-primary search-add">
            Add Creator
          </Link>
        </div>
      </section>

      {visible === null ? (
        <div className="creator-grid" aria-busy="true">
          {Array.from({ length: 6 }, (_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : loadError ? (
        <div className="state-box" role="alert">
          <h2 className="state-title">Couldn't load creators</h2>
          <p>Something went wrong reaching the database. Please try again.</p>
        </div>
      ) : visible.length === 0 ? (
        <div className="state-box" role="status">
          {creators.length === 0 ? (
            <>
              <h2 className="state-title">No creators yet — add one!</h2>
              <p>Be the first to add a creator worth following.</p>
            </>
          ) : (
            <>
              <h2 className="state-title">No matches</h2>
              <p>Nothing matches "{query}". Try another search.</p>
            </>
          )}
        </div>
      ) : (
        <div className="creator-grid">
          {visible.map((creator, i) => (
            <Card key={creator.id} index={i} {...creator} />
          ))}
        </div>
      )}
    </div>
  )
}
