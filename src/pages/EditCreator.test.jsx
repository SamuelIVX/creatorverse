/**
 * EditCreator tests: pre-fill from the fetched creator, null-image coercion,
 * not-found state, required fields, update/delete payloads, error handling,
 * and post-delete navigation. Mocks Supabase.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, within } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { ToastProvider } from '../components/Toast'
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

const store = { rows: [] }

/**
 * Builds a mocked supabase query chain with configurable update/delete errors.
 * @param {Object} data - The creator to resolve from maybeSingle.
 * @param {Object} options
 * @param {Error|null} options.updateError - Error for update, if any.
 * @param {Error|null} options.deleteError - Error for delete, if any.
 * @returns {Object} The mocked query object.
 */
function mockChain(data, { updateError = null, deleteError = null } = {}) {
  const query = {
    select: vi.fn().mockResolvedValue({ data: store.rows, error: null }),
    eq: vi.fn(),
    maybeSingle: vi.fn().mockResolvedValue({ data, error: null }),
    update: vi.fn(),
    delete: vi.fn(),
  }
  query.select.mockReturnValue(query)
  query.eq.mockReturnValue(query)
  query.update.mockReturnValue({
    eq: vi.fn().mockResolvedValue({ error: updateError }),
  })
  query.delete.mockReturnValue({
    eq: vi.fn().mockResolvedValue({ error: deleteError }),
  })
  supabase.from.mockReturnValue(query)
  return query
}

/**
 * Renders EditCreator at /edit/:id.
 * @param {string} id - The creator id for the route.
 * @returns {RenderResult} The render result.
 */
function renderEditCreator(id = creator.id) {
  return render(
    <ToastProvider>
      <MemoryRouter initialEntries={[`/edit/${id}`]}>
        <Routes>
          <Route path="/edit/:id" element={<EditCreator />} />
        </Routes>
      </MemoryRouter>
    </ToastProvider>,
  )
}

/**
 * Waits for the form to pre-fill with the given creator name.
 * @param {string} name - The expected pre-filled name value.
 * @returns {Promise<HTMLElement>} The resolved name input.
 */
async function waitForPrefill(name = creator.name) {
  return screen.findByDisplayValue(name)
}

describe('EditCreator', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    store.rows = []
  })

  it('loads_existing_values', async () => {
    mockChain(creator)
    renderEditCreator()
    const nameInput = await waitForPrefill()
    expect(nameInput).toHaveValue(creator.name)
    expect(screen.getByLabelText('Channel URL')).toHaveValue(creator.url)
    expect(screen.getByLabelText('Description')).toHaveValue(creator.description)
    expect(screen.getByLabelText('Image URL (optional)')).toHaveValue(creator.imageURL)
  })

  it('coerces_null_image_to_empty', async () => {
    mockChain(creatorWithNullImage)
    renderEditCreator()
    await waitForPrefill()
    const imageInput = screen.getByLabelText('Image URL (optional)')
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
    await waitForPrefill()
    expect(screen.getByLabelText('Name')).toHaveAttribute('required')
    expect(screen.getByLabelText('Channel URL')).toHaveAttribute('required')
    expect(screen.getByLabelText('Description')).toHaveAttribute('required')
    expect(screen.getByLabelText('Image URL (optional)')).not.toHaveAttribute('required')
  })

  it('submit_updates_row', async () => {
    const query = mockChain(creator)
    renderEditCreator()
    await waitForPrefill()
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
    await waitForPrefill()
    fireEvent.click(screen.getByRole('button', { name: /update creator/i }))
    const payload = query.update.mock.calls[0][0]
    expect(Object.keys(payload).sort()).toEqual(
      ['name', 'url', 'description', 'imageURL'].sort(),
    )
  })

  it('blank_image_updates_null', async () => {
    const query = mockChain(creator)
    renderEditCreator()
    await waitForPrefill()
    fireEvent.change(screen.getByLabelText('Image URL (optional)'), { target: { value: '' } })
    fireEvent.click(screen.getByRole('button', { name: /update creator/i }))
    expect(query.update).toHaveBeenCalledWith(
      expect.objectContaining({ imageURL: null }),
    )
  })

  it('error_keeps_page', async () => {
    mockChain(creator, { updateError: new Error('update failed') })
    renderEditCreator()
    await waitForPrefill()
    fireEvent.click(screen.getByRole('button', { name: /update creator/i }))
    expect(await screen.findByRole('alert')).toHaveTextContent('update failed')
    expect(screen.getByRole('heading', { name: /edit creator/i })).toBeInTheDocument()
  })

  it('rejected_update_keeps_page', async () => {
    const query = mockChain(creator)
    query.update.mockReturnValue({
      eq: vi.fn().mockRejectedValue(new Error('network down')),
    })
    renderEditCreator()
    await waitForPrefill()
    fireEvent.click(screen.getByRole('button', { name: /update creator/i }))
    expect(await screen.findByRole('alert')).toHaveTextContent('network down')
    expect(screen.getByRole('heading', { name: /edit creator/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /update creator/i })).not.toBeDisabled()
  })

  it('delete_button_present', async () => {
    mockChain(creator)
    renderEditCreator()
    await waitForPrefill()
    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument()
  })

  it('click_deletes_row', async () => {
    const query = mockChain(creator)
    renderEditCreator()
    await waitForPrefill()
    fireEvent.click(screen.getByRole('button', { name: /delete/i }))
    const dialog = screen.getByRole('dialog')
    fireEvent.click(within(dialog).getByRole('button', { name: /delete/i }))
    expect(query.delete).toHaveBeenCalled()
    const deleteEq = query.delete.mock.results[0].value.eq
    expect(deleteEq).toHaveBeenCalledWith('id', '42')
  })

  it('cancel_does_not_delete', async () => {
    const query = mockChain(creator)
    renderEditCreator()
    await waitForPrefill()
    fireEvent.click(screen.getByRole('button', { name: /delete/i }))
    const dialog = screen.getByRole('dialog')
    fireEvent.click(within(dialog).getByRole('button', { name: /cancel/i }))
    expect(query.delete).not.toHaveBeenCalled()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('error_keeps_page_on_delete', async () => {
    mockChain(creator, { deleteError: new Error('delete failed') })
    renderEditCreator()
    await waitForPrefill()
    fireEvent.click(screen.getByRole('button', { name: /delete/i }))
    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: /delete/i }))
    expect(await screen.findByRole('alert')).toHaveTextContent('delete failed')
    expect(screen.getByRole('heading', { name: /edit creator/i })).toBeInTheDocument()
  })

  it('rejected_delete_keeps_page', async () => {
    const query = mockChain(creator)
    query.delete.mockReturnValue({
      eq: vi.fn().mockRejectedValue(new Error('network down')),
    })
    renderEditCreator()
    await waitForPrefill()
    fireEvent.click(screen.getByRole('button', { name: /delete/i }))
    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: /delete/i }))
    expect(await screen.findByRole('alert')).toHaveTextContent('network down')
    expect(screen.getByRole('heading', { name: /edit creator/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /delete/i })).not.toBeDisabled()
  })

  it('redirects_home_after_delete', async () => {
    store.rows.push({ ...creator })
    const query = mockChain(creator)
    query.delete.mockReturnValue({
      eq: vi.fn().mockImplementation(async (col, value) => {
        store.rows = store.rows.filter((row) => row[col] !== value)
        return { error: null }
      }),
    })

    render(
      <ToastProvider>
        <MemoryRouter initialEntries={['/edit/42']}>
          <Routes>
            <Route path="/edit/:id" element={<EditCreator />} />
            <Route path="/" element={<p>HOME PAGE</p>} />
          </Routes>
        </MemoryRouter>
      </ToastProvider>,
    )

    await waitForPrefill()
    fireEvent.click(screen.getByRole('button', { name: /delete/i }))
    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: /delete/i }))
    expect(await screen.findByText('HOME PAGE')).toBeInTheDocument()
  })

  it('creator_gone_from_list', async () => {
    store.rows.push({ ...creator })
    store.rows.push({
      id: '43',
      name: 'Katherine Johnson',
      url: 'https://k.example',
      description: 'Mathmatician',
      imageURL: null,
    })
    const query = mockChain(creator)
    query.delete.mockReturnValue({
      eq: vi.fn().mockImplementation(async (col, value) => {
        store.rows = store.rows.filter((row) => row[col] !== value)
        return { error: null }
      }),
    })

    render(
      <ToastProvider>
        <MemoryRouter initialEntries={['/edit/42']}>
          <Routes>
            <Route path="/edit/:id" element={<EditCreator />} />
            <Route path="/" element={<p>HOME PAGE</p>} />
          </Routes>
        </MemoryRouter>
      </ToastProvider>,
    )

    await waitForPrefill()
    fireEvent.click(screen.getByRole('button', { name: /delete/i }))
    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: /delete/i }))
    expect(await screen.findByText('HOME PAGE')).toBeInTheDocument()
    expect(store.rows.map((row) => row.id)).toEqual(['43'])
    expect(store.rows.map((row) => row.name)).not.toContain('Ada Lovelace')
  })
})
