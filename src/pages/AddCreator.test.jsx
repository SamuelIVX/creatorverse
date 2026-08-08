import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from '../App'
import AddCreator from './AddCreator'

vi.mock('../lib/client', () => ({
  supabase: {
    from: vi.fn(),
  },
}))

import { supabase } from '../lib/client'

const store = { rows: [] }

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

function renderAddCreator() {
  return render(
    <MemoryRouter initialEntries={['/add']}>
      <AddCreator />
    </MemoryRouter>,
  )
}

function renderAppAtAdd() {
  return render(
    <MemoryRouter initialEntries={['/add']}>
      <App />
    </MemoryRouter>,
  )
}

async function fillForm({ name = 'Grace Hopper', url = 'https://grace.example', description = 'Compiler pioneer', imageURL = '' } = {}) {
  fireEvent.change(screen.getByLabelText('Name'), { target: { value: name } })
  fireEvent.change(screen.getByLabelText('URL'), { target: { value: url } })
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

  it('form_has_all_fields', () => {
    renderAddCreator()
    expect(screen.getByLabelText('Name')).toBeInTheDocument()
    expect(screen.getByLabelText('URL')).toBeInTheDocument()
    expect(screen.getByLabelText('Description')).toBeInTheDocument()
    expect(screen.getByLabelText('Image URL (optional)')).toBeInTheDocument()
  })

  it('required_fields_enforced', () => {
    renderAddCreator()
    expect(screen.getByLabelText('Name')).toHaveAttribute('required')
    expect(screen.getByLabelText('URL')).toHaveAttribute('required')
    expect(screen.getByLabelText('Description')).toHaveAttribute('required')
    expect(screen.getByLabelText('Image URL (optional)')).not.toHaveAttribute('required')
  })

  it('submit_inserts_row', async () => {
    renderAddCreator()
    await fillForm()
    expect(chain.insert).toHaveBeenCalledWith({
      name: 'Grace Hopper',
      url: 'https://grace.example',
      description: 'Compiler pioneer',
      imageURL: null,
    })
  })

  it('blank_image_inserts_null', async () => {
    renderAddCreator()
    await fillForm({ imageURL: '' })
    expect(chain.insert).toHaveBeenCalledWith(
      expect.objectContaining({ imageURL: null }),
    )
  })

  it('provides_image_when_given', async () => {
    renderAddCreator()
    await fillForm({ imageURL: 'https://grace.example/portrait.png' })
    expect(chain.insert).toHaveBeenCalledWith(
      expect.objectContaining({ imageURL: 'https://grace.example/portrait.png' }),
    )
  })

  it('error_keeps_page', async () => {
    chain.insert.mockResolvedValue({ error: new Error('insert failed') })
    renderAddCreator()
    await fillForm()
    expect(await screen.findByRole('alert')).toHaveTextContent('insert failed')
    expect(screen.getByRole('heading', { name: /add creator/i })).toBeInTheDocument()
    expect(chain.insert).toHaveBeenCalledTimes(1)
  })

  it('new_creator_appears', async () => {
    renderAppAtAdd()
    await fillForm({ name: 'Katherine Johnson' })
    expect(
      await screen.findByRole('heading', { name: 'Katherine Johnson' }),
    ).toBeInTheDocument()
  })
})
