/**
 * Route-level tests for App: verifies each route renders its page and that
 * ViewCreator/EditCreator read the id from the URL param. Mocks Supabase.
 */
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from './App.jsx'

vi.mock('./lib/client', () => {
  const chain = (id) => ({
    select: vi.fn().mockImplementation(function () {
      return this
    }),
    eq: vi.fn().mockImplementation((_col, val) => chain(val)),
    maybeSingle: vi.fn().mockResolvedValue({
      data: {
        id,
        name: `Creator ${id}`,
        url: 'https://x.example',
        description: 'a creator',
        imageURL: null,
      },
      error: null,
    }),
  })

  return {
    supabase: {
      from: vi.fn().mockReturnValue(chain(null)),
    },
  }
})

/**
 * Renders the app at the given path.
 * @param {string} path - The URL to start at.
 */
function renderAt(path) {
  render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  )
}

describe('routes', () => {
  it('routes_render_pages: / renders ShowCreators', async () => {
    renderAt('/')
    expect(await screen.findByText(/no creators yet/i)).toBeInTheDocument()
  })

  it('routes_render_pages: /creator/:id renders ViewCreator', async () => {
    renderAt('/creator/7')
    expect(await screen.findByRole('heading', { name: /creator 7/i })).toBeInTheDocument()
  })

  it('routes_render_pages: /add renders AddCreator', () => {
    renderAt('/add')
    expect(screen.getByRole('heading', { name: /add creator/i })).toBeInTheDocument()
  })

  it('routes_render_pages: /edit/:id renders EditCreator', async () => {
    renderAt('/edit/9')
    expect(await screen.findByDisplayValue('Creator 9')).toBeInTheDocument()
  })

  it('id_param_readable: ViewCreator reads the id from useParams', async () => {
    renderAt('/creator/42')
    expect(await screen.findByRole('heading', { name: /creator 42/i })).toBeInTheDocument()
  })

  it('id_param_readable: EditCreator reads the id from useParams', async () => {
    renderAt('/edit/42')
    expect(await screen.findByDisplayValue('Creator 42')).toBeInTheDocument()
  })
})
