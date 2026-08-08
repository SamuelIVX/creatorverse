import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import EditCreator from './EditCreator'

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

const creatorWithNullImage = {
  ...creator,
  imageURL: null,
}

function mockChain(data, { updateError = null } = {}) {
  const query = {
    select: vi.fn(),
    eq: vi.fn(),
    maybeSingle: vi.fn().mockResolvedValue({ data, error: null }),
    update: vi.fn(),
  }
  query.select.mockReturnValue(query)
  query.eq.mockReturnValue(query)
  query.update.mockReturnValue({
    eq: vi.fn().mockResolvedValue({ error: updateError }),
  })
  supabase.from.mockReturnValue(query)
  return query
}

function renderEditCreator(id = creator.id) {
  return render(
    <MemoryRouter initialEntries={[`/edit/${id}`]}>
      <Routes>
        <Route path="/edit/:id" element={<EditCreator />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('EditCreator', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('loads_existing_values', async () => {
    mockChain(creator)
    renderEditCreator()
    const nameInput = await screen.findByLabelText('Name')
    expect(nameInput).toHaveValue(creator.name)
    expect(screen.getByLabelText('URL')).toHaveValue(creator.url)
    expect(screen.getByLabelText('Description')).toHaveValue(creator.description)
    expect(screen.getByLabelText('Image URL (optional)')).toHaveValue(creator.imageURL)
  })

  it('coerces_null_image_to_empty', async () => {
    mockChain(creatorWithNullImage)
    renderEditCreator()
    const imageInput = await screen.findByLabelText('Image URL (optional)')
    expect(imageInput).toHaveValue('')
  })

  it('not_found_state', async () => {
    mockChain(null)
    renderEditCreator('999')
    expect(await screen.findByText(/creator not found/i)).toBeInTheDocument()
    expect(screen.queryByLabelText('Name')).not.toBeInTheDocument()
  })

  it('required_fields_enforced', async () => {
    mockChain(creator)
    renderEditCreator()
    await screen.findByLabelText('Name')
    expect(screen.getByLabelText('Name')).toHaveAttribute('required')
    expect(screen.getByLabelText('URL')).toHaveAttribute('required')
    expect(screen.getByLabelText('Description')).toHaveAttribute('required')
    expect(screen.getByLabelText('Image URL (optional)')).not.toHaveAttribute('required')
  })

  it('submit_updates_row', async () => {
    const query = mockChain(creator)
    renderEditCreator()
    await screen.findByLabelText('Name')
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Ada King' } })
    fireEvent.click(screen.getByRole('button', { name: /update creator/i }))
    expect(query.update).toHaveBeenCalledWith({
      name: 'Ada King',
      url: creator.url,
      description: creator.description,
      imageURL: creator.imageURL,
    })
    const updateEq = query.update.mock.results[0].value.eq
    expect(updateEq).toHaveBeenCalledWith('id', '42')
  })

  it('update_payload_excludes_system_columns', async () => {
    const query = mockChain(creator)
    renderEditCreator()
    await screen.findByLabelText('Name')
    fireEvent.click(screen.getByRole('button', { name: /update creator/i }))
    const payload = query.update.mock.calls[0][0]
    expect(Object.keys(payload).sort()).toEqual(
      ['name', 'url', 'description', 'imageURL'].sort(),
    )
  })

  it('blank_image_updates_null', async () => {
    const query = mockChain(creator)
    renderEditCreator()
    await screen.findByLabelText('Name')
    fireEvent.change(screen.getByLabelText('Image URL (optional)'), { target: { value: '' } })
    fireEvent.click(screen.getByRole('button', { name: /update creator/i }))
    expect(query.update).toHaveBeenCalledWith(
      expect.objectContaining({ imageURL: null }),
    )
  })

  it('error_keeps_page', async () => {
    mockChain(creator, { updateError: new Error('update failed') })
    renderEditCreator()
    await screen.findByLabelText('Name')
    fireEvent.click(screen.getByRole('button', { name: /update creator/i }))
    expect(await screen.findByRole('alert')).toHaveTextContent('update failed')
    expect(screen.getByRole('heading', { name: /edit creator/i })).toBeInTheDocument()
  })
})
