import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import ViewCreator from './ViewCreator'

vi.mock('../lib/client', () => ({
  supabase: {
    from: vi.fn(),
  },
}))

import { supabase } from '../lib/client'

const creator = {
  id: '42',
  name: 'Ada Lovelace',
  url: 'https://ada.example',
  description: 'First programmer',
  imageURL: 'https://ada.example/portrait.png',
}

function mockChain(result) {
  const query = {
    select: vi.fn(),
    eq: vi.fn(),
    maybeSingle: vi.fn().mockResolvedValue(result),
  }
  query.select.mockReturnValue(query)
  query.eq.mockReturnValue(query)
  supabase.from.mockReturnValue(query)
  return query
}

function renderViewCreator(id = creator.id) {
  return render(
    <MemoryRouter initialEntries={[`/creator/${id}`]}>
      <Routes>
        <Route path="/creator/:id" element={<ViewCreator />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('ViewCreator', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('reads_id_param', async () => {
    const query = mockChain({ data: null, error: null })
    renderViewCreator('42')
    await screen.findByText(/creator not found/i)
    expect(query.eq).toHaveBeenCalledWith('id', '42')
  })

  it('fetches_single_creator', async () => {
    const query = mockChain({ data: creator, error: null })
    renderViewCreator('42')
    await screen.findByRole('heading', { name: creator.name })
    expect(supabase.from).toHaveBeenCalledWith('creators')
    expect(query.select).toHaveBeenCalledWith('*')
    expect(query.eq).toHaveBeenCalledWith('id', '42')
    expect(query.maybeSingle).toHaveBeenCalled()
  })

  it('renders_creator_fields', async () => {
    mockChain({ data: creator, error: null })
    renderViewCreator('42')
    await screen.findByRole('heading', { name: creator.name })
    expect(screen.getByText(creator.description)).toBeInTheDocument()
    const link = screen.getByRole('link', { name: /visit channel/i })
    expect(link).toHaveAttribute('href', creator.url)
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noreferrer')
    const image = screen.getByAltText(creator.name)
    expect(image).toHaveAttribute('src', creator.imageURL)
  })

  it('hides_image_when_absent', async () => {
    mockChain({ data: { ...creator, imageURL: null }, error: null })
    renderViewCreator('42')
    await screen.findByRole('heading', { name: creator.name })
    expect(screen.queryByAltText(creator.name)).not.toBeInTheDocument()
  })

  it('not_found_state', async () => {
    mockChain({ data: null, error: null })
    renderViewCreator('999')
    expect(await screen.findByText(/creator not found/i)).toBeInTheDocument()
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
  })

  it('shows_loading_then_resolves', async () => {
    let resolve
    const query = {
      select: vi.fn(),
      eq: vi.fn(),
      maybeSingle: vi
        .fn()
        .mockReturnValue(
          new Promise((res) => {
            resolve = res
          }),
        ),
    }
    query.select.mockReturnValue(query)
    query.eq.mockReturnValue(query)
    supabase.from.mockReturnValue(query)

    renderViewCreator('42')
    expect(screen.getByText(/loading/i)).toBeInTheDocument()

    resolve({ data: creator, error: null })
    expect(await screen.findByRole('heading', { name: creator.name })).toBeInTheDocument()
  })
})
