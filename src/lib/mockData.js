/**
 * Mock creator data used as a fallback when the Supabase API returns a 500
 * or otherwise fails during development. This keeps the UI functional for
 * walkthroughs and local testing without live database access.
 */

const MOCK_CREATORS = [
  {
    id: 'mock-1',
    name: 'Fireship',
    description: 'Fast-paced web dev tutorials and tech news.',
    url: 'https://www.youtube.com/@Fireship',
    imageURL: null,
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'mock-2',
    name: 'ThePrimeagen',
    description: 'Vim, Rust, and software engineering rants.',
    url: 'https://www.youtube.com/@ThePrimeagen',
    imageURL: null,
    created_at: '2026-01-02T00:00:00Z',
  },
]

export function getMockCreators() {
  return MOCK_CREATORS
}

export function getMockCreator(id) {
  return MOCK_CREATORS.find((c) => c.id === id) || null
}
