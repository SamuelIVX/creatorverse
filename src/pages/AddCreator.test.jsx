/**
 * AddCreator tests: field rendering, required enforcement, insert payloads
 * (including blank-image → null), error handling, and the post-add redirect.
 * Mocks Supabase.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from '../App'
import { ToastProvider } from '../components/Toast'
import AddCreator from './AddCreator'

vi.mock('../lib/client', () => {
  const mockOnAuthStateChange = vi.fn(() => ({
    data: { subscription: { unsubscribe: vi.fn() } }
  }))

  return {
    supabase: {
      from: vi.fn(),
      auth: {
        onAuthStateChange: mockOnAuthStateChange,
      },
    },
    getSession: vi.fn().mockResolvedValue({ user: { id: 'user-1', email: 'test@example.com' } }),
    signIn: vi.fn().mockResolvedValue({ error: null }),
    signUp: vi.fn().mockResolvedValue({ error: null }),
    signOut: vi.fn().mockResolvedValue({ error: null }),
  }
})

import { supabase } from '../lib/client'

const store = { rows: [] }

/**
 * Builds a mocked supabase query chain that stores inserts in memory.
 * @returns {Object} The mocked query object (select/eq/maybeSingle/insert).
 */
function makeChain() {
  return {
    select: vi.fn().mockResolvedValue({ data: store.rows, error: null }),
    eq: vi.fn().mockReturnThis(),
    maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
    insert: vi.fn().mockImplementation(async (payload) => {
      store.rows.push({ id: String(store.rows.length + 1), ...payload })
      return { error: null }
    }),
  }
}

let chain

/**
 * Renders AddCreator at /add and waits for the auth gate to resolve.
 * @returns {Promise<RenderResult>} The render result after auth settles.
 */
async function renderAddCreator() {
  const result = render(
    <ToastProvider>
      <MemoryRouter initialEntries={['/add']}>
        <AddCreator />
      </MemoryRouter>
    </ToastProvider>,
  )
  await waitFor(() => expect(screen.getByLabelText('Name')).toBeInTheDocument())
  return result
}

/**
 * Renders the full App at /add (to exercise post-add navigation).
 * @returns {Promise<RenderResult>} The render result after auth settles.
 */
async function renderAppAtAdd() {
  const result = render(
    <MemoryRouter initialEntries={['/add']}>
      <App />
    </MemoryRouter>,
  )
  await waitFor(() => expect(screen.getByLabelText('Name')).toBeInTheDocument())
  return result
}

/**
 * Fills the form fields and clicks submit.
 * @param {Object} values - Overrides for name/url/description/imageURL.
 */
async function fillForm({ name = 'Grace Hopper', url = 'https://grace.example', description = 'Compiler pioneer', imageURL = '' } = {}) {
  fireEvent.change(screen.getByLabelText('Name'), { target: { value: name } })
  fireEvent.change(screen.getByLabelText('Channel URL'), { target: { value: url } })
  fireEvent.change(screen.getByLabelText('Description'), { target: { value: description } })
  if (imageURL) {
    fireEvent.change(screen.getByLabelText('Image URL (optional)'), { target: { value: imageURL } })
  }
  fireEvent.click(screen.getByRole('button', { name: /add creator/i }))
}

describe('AddCreator', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    store.rows = []
    chain = makeChain()
    supabase.from.mockReturnValue(chain)
  })

  it('form_has_all_fields', async () => {
    await renderAddCreator()
    expect(screen.getByLabelText('Name')).toBeInTheDocument()
    expect(screen.getByLabelText('Channel URL')).toBeInTheDocument()
    expect(screen.getByLabelText('Description')).toBeInTheDocument()
    expect(screen.getByLabelText('Image URL (optional)')).toBeInTheDocument()
  })

  it('required_fields_enforced', async () => {
    await renderAddCreator()
    expect(screen.getByLabelText('Name')).toHaveAttribute('required')
    expect(screen.getByLabelText('Channel URL')).toHaveAttribute('required')
    expect(screen.getByLabelText('Description')).toHaveAttribute('required')
    expect(screen.getByLabelText('Image URL (optional)')).not.toHaveAttribute('required')
  })

  it('submit_inserts_row', async () => {
    await renderAddCreator()
    await fillForm()
    expect(chain.insert).toHaveBeenCalledWith({
      name: 'Grace Hopper',
      url: 'https://grace.example',
      description: 'Compiler pioneer',
      imageURL: null,
    })
  })

  it('blank_image_inserts_null', async () => {
    await renderAddCreator()
    await fillForm({ imageURL: '' })
    expect(chain.insert).toHaveBeenCalledWith(
      expect.objectContaining({ imageURL: null }),
    )
  })

  it('provides_image_when_given', async () => {
    await renderAddCreator()
    await fillForm({ imageURL: 'https://grace.example/portrait.png' })
    expect(chain.insert).toHaveBeenCalledWith(
      expect.objectContaining({ imageURL: 'https://grace.example/portrait.png' }),
    )
  })

  it('error_keeps_page', async () => {
    chain.insert.mockResolvedValue({ error: new Error('insert failed') })
    await renderAddCreator()
    await fillForm()
    expect(await screen.findByRole('alert')).toHaveTextContent('insert failed')
    expect(screen.getByRole('heading', { name: /add creator/i })).toBeInTheDocument()
    expect(chain.insert).toHaveBeenCalledTimes(1)
  })

  it('rejected_insert_keeps_page', async () => {
    chain.insert.mockRejectedValue(new Error('network down'))
    await renderAddCreator()
    await fillForm()
    expect(await screen.findByRole('alert')).toHaveTextContent('network down')
    expect(screen.getByRole('heading', { name: /add creator/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /add creator/i })).not.toBeDisabled()
  })

  it('new_creator_appears', async () => {
    await renderAppAtAdd()
    await fillForm({ name: 'Katherine Johnson' })
    expect(
      await screen.findByRole('heading', { name: 'Katherine Johnson' }),
    ).toBeInTheDocument()
  })

  it('toast_on_add_success', async () => {
    await renderAddCreator()
    await fillForm({ name: 'Grace Hopper' })
    expect(await screen.findByRole('status')).toHaveTextContent('Grace Hopper added.')
  })
})
