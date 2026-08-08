/**
 * ShowCreators tests: fetch on mount, rendering all creators, empty state,
 * and the Add button navigation. Mocks Supabase.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import ShowCreators from './ShowCreators'

vi.mock('../lib/client', () => ({
  supabase: {
    from: vi.fn(),
  },
}))

import { supabase } from '../lib/client'

const seedCreators = [
  { id: 1, name: 'Alice', url: 'https://a.example', description: 'd1', imageURL: null },
  { id: 2, name: 'Bob', url: 'https://b.example', description: 'd2', imageURL: null },
  { id: 3, name: 'Cara', url: 'https://c.example', description: 'd3', imageURL: null },
  { id: 4, name: 'Dan', url: 'https://d.example', description: 'd4', imageURL: null },
  { id: 5, name: 'Eli', url: 'https://e.example', description: 'd5', imageURL: null },
]

/**
 * Stubs supabase.from().select() to resolve with the given rows.
 * @param {Array} rows - The creators to return from the mocked query.
 */
function mockRows(rows) {
  supabase.from.mockReturnValue({
    select: vi.fn().mockResolvedValue({ data: rows, error: null }),
  })
}

/**
 * Renders ShowCreators without routes (for list/empty-state tests).
 * @returns {RenderResult} The render result.
 */
function renderPage() {
  return render(
    <MemoryRouter>
      <ShowCreators />
    </MemoryRouter>,
  )
}

/**
 * Renders ShowCreators with an /add route (for navigation tests).
 * @returns {RenderResult} The render result.
 */
function renderWithRoutes() {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route path="/" element={<ShowCreators />} />
        <Route path="/add" element={<p>ADD PAGE</p>} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('ShowCreators', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fetches_on_mount', async () => {
    mockRows([])
    renderPage()
    await screen.findByText(/no creators yet/i)
    expect(supabase.from).toHaveBeenCalledWith('creators')
    expect(supabase.from).toHaveBeenCalledTimes(1)
  })

  it('renders_all_creators', async () => {
    mockRows(seedCreators)
    renderPage()
    for (const creator of seedCreators) {
      expect(await screen.findByRole('heading', { name: creator.name })).toBeInTheDocument()
    }
    expect(screen.getAllByRole('article')).toHaveLength(seedCreators.length)
  })

  it('empty_state_message', async () => {
    mockRows([])
    renderPage()
    expect(await screen.findByText(/no creators yet — add one/i)).toBeInTheDocument()
    expect(screen.queryAllByRole('article')).toHaveLength(0)
  })

  it('homepage_uses_grid', async () => {
    mockRows(seedCreators)
    renderPage()
    await screen.findByRole('heading', { name: /alice/i })
    const grid = document.querySelector('.creator-grid')
    expect(grid).toBeInTheDocument()
    expect(grid.querySelectorAll('article')).toHaveLength(seedCreators.length)
  })

  it('card_shows_image', async () => {
    mockRows([{ ...seedCreators[0], imageURL: 'https://a.example/avatar.png' }])
    renderPage()
    const img = await screen.findByRole('img', { name: 'Alice' })
    expect(img).toHaveAttribute('src', 'https://a.example/avatar.png')
    expect(img).toHaveClass('card-image')
  })

  it('nav_link_routes_to_add', async () => {
    mockRows([])
    renderWithRoutes()
    fireEvent.click(screen.getByRole('link', { name: /add a creator/i }))
    expect(await screen.findByText('ADD PAGE')).toBeInTheDocument()
  })

  it('homepage_search_filters', async () => {
    mockRows(seedCreators)
    renderPage()
    await screen.findByRole('heading', { name: /alice/i })
    fireEvent.change(screen.getByLabelText(/search creators/i), {
      target: { value: 'bob' },
    })
    expect(screen.getByRole('heading', { name: 'Bob' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Alice' })).not.toBeInTheDocument()
  })

  it('search_no_results_message', async () => {
    mockRows(seedCreators)
    renderPage()
    await screen.findByRole('heading', { name: /alice/i })
    fireEvent.change(screen.getByLabelText(/search creators/i), {
      target: { value: 'zzz-no-match' },
    })
    expect(await screen.findByText(/no matches/i)).toBeInTheDocument()
  })

  it('skeleton_shown_while_loading', () => {
    supabase.from.mockReturnValue({
      select: vi.fn().mockReturnValue(new Promise(() => {})),
    })
    renderPage()
    expect(document.querySelector('.skeleton-card')).toBeInTheDocument()
  })
})
