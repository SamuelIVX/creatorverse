/**
 * ViewCreator tests: id param read, single-creator fetch, field rendering,
 * conditional image, not-found state, and loading behavior. Mocks Supabase.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route, Link } from 'react-router-dom'
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

/**
 * Stubs the supabase query chain to resolve with the given result.
 * @param {Object} result - { data, error } to resolve from maybeSingle.
 * @returns {Object} The mocked query object.
 */
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

/**
 * Renders ViewCreator at /creator/:id.
 * @param {string} id - The creator id for the route.
 * @returns {RenderResult} The render result.
 */
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
    expect(screen.getByRole('link', { name: 'Edit' })).toHaveAttribute(
      'href',
      `/edit/${creator.id}`,
    )
  })

  it('hides_image_when_absent', async () => {
    mockChain({ data: { ...creator, imageURL: null }, error: null })
    renderViewCreator('42')
    await screen.findByRole('heading', { name: creator.name })
    expect(screen.queryByAltText(creator.name)).not.toBeInTheDocument()
  })

  it('failed_avatar_resets_for_new_url', async () => {
    const first = { ...creator, id: '1', imageURL: 'https://bad.example/a.png' }
    const second = { ...creator, id: '2', imageURL: 'https://good.example/b.png' }
    let firstResolve
    let secondResolve
    const promises = {
      '1': new Promise((res) => {
        firstResolve = res
      }),
      '2': new Promise((res) => {
        secondResolve = res
      }),
    }
    const query = {
      select: vi.fn(),
      eq: vi.fn(),
      maybeSingle: vi.fn(),
    }
    query.select.mockReturnValue(query)
    query.eq.mockImplementation((_col, id) => {
      query.maybeSingle.mockReturnValue(promises[id])
      return query
    })
    supabase.from.mockReturnValue(query)

    render(
      <MemoryRouter initialEntries={['/creator/1']}>
        <nav>
          <Link to="/creator/2">view creator 2</Link>
        </nav>
        <Routes>
          <Route path="/creator/:id" element={<ViewCreator />} />
        </Routes>
      </MemoryRouter>,
    )

    firstResolve({ data: first, error: null })
    const badImg = await screen.findByAltText(first.name)
    fireEvent.error(badImg)
    expect(screen.queryByAltText(first.name)).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('link', { name: /view creator 2/i }))
    secondResolve({ data: second, error: null })
    expect(await screen.findByAltText(second.name)).toHaveAttribute(
      'src',
      second.imageURL,
    )
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
