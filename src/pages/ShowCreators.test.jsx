import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
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

function mockRows(rows) {
  supabase.from.mockReturnValue({
    select: vi.fn().mockResolvedValue({ data: rows, error: null }),
  })
}

function renderPage() {
  return render(
    <MemoryRouter>
      <ShowCreators />
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
})
