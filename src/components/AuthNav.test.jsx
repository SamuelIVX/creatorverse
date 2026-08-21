/**
 * AuthNav tests: navbar auth widget rendering, dropdown toggle,
 * sign-in/sign-up mode switch, authenticated state, and submit behavior.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import AuthNav from './AuthNav'

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

import { getSession, signIn, signUp, signOut } from '../lib/client'

describe('AuthNav', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    getSession.mockResolvedValue({ user: { id: 'user-1', email: 'test@example.com' } })
  })

  it('shows_sign_out_when_authenticated', async () => {
    render(
      <MemoryRouter>
        <AuthNav />
      </MemoryRouter>
    )
    await waitFor(() => {
      expect(screen.getByText('test@example.com')).toBeInTheDocument()
    })
    expect(screen.getByRole('button', { name: 'Sign out' })).toBeInTheDocument()
  })

  it('shows_sign_in_button_when_unauthenticated', async () => {
    getSession.mockResolvedValueOnce(null)
    render(
      <MemoryRouter>
        <AuthNav />
      </MemoryRouter>
    )
    expect(screen.getByRole('button', { name: 'Sign in' })).toBeInTheDocument()
    expect(screen.queryByLabelText('Email')).not.toBeInTheDocument()
  })

  it('opens_dropdown_with_form_on_click', async () => {
    getSession.mockResolvedValueOnce(null)
    render(
      <MemoryRouter>
        <AuthNav />
      </MemoryRouter>
    )
    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }))
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Password')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Sign in' })).toBeInTheDocument()
  })

  it('toggles_between_sign_in_and_sign_up', async () => {
    getSession.mockResolvedValueOnce(null)
    render(
      <MemoryRouter>
        <AuthNav />
      </MemoryRouter>
    )
    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }))
    fireEvent.click(screen.getByRole('button', { name: 'Need an account?' }))
    expect(screen.getByRole('button', { name: 'Sign up' })).toBeInTheDocument()
  })

  it('submits_sign_in', async () => {
    getSession.mockResolvedValueOnce(null)
    render(
      <MemoryRouter>
        <AuthNav />
      </MemoryRouter>
    )
    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }))
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } })
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'secret' } })
    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }))
    expect(signIn).toHaveBeenCalledWith('test@example.com', 'secret')
  })

  it('submits_sign_up', async () => {
    getSession.mockResolvedValueOnce(null)
    render(
      <MemoryRouter>
        <AuthNav />
      </MemoryRouter>
    )
    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }))
    fireEvent.click(screen.getByRole('button', { name: 'Need an account?' }))
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'new@example.com' } })
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'secret' } })
    fireEvent.click(screen.getByRole('button', { name: 'Sign up' }))
    expect(signUp).toHaveBeenCalledWith('new@example.com', 'secret')
  })

  it('surfaces_error_on_failed_sign_in', async () => {
    getSession.mockResolvedValueOnce(null)
    signIn.mockResolvedValueOnce({ error: new Error('invalid credentials') })
    render(
      <MemoryRouter>
        <AuthNav />
      </MemoryRouter>
    )
    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }))
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } })
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'secret' } })
    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }))
    expect(await screen.findByRole('alert')).toHaveTextContent('invalid credentials')
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
  })

  it('closes_dropdown_on_successful_auth', async () => {
    getSession.mockResolvedValueOnce(null)
    render(
      <MemoryRouter>
        <AuthNav />
      </MemoryRouter>
    )
    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }))
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } })
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'secret' } })
    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }))
    await waitFor(() => {
      expect(screen.queryByLabelText('Email')).not.toBeInTheDocument()
    })
  })
})
