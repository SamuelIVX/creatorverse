import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, useNavigate, useParams } from 'react-router-dom'

function RouterProbe() {
  const navigate = useNavigate()
  const params = useParams()
  return (
    <div>
      <span data-testid="navigate-available">{typeof navigate === 'function' ? 'yes' : 'no'}</span>
      <span data-testid="params-available">{typeof params === 'object' && params !== null ? 'yes' : 'no'}</span>
    </div>
  )
}

describe('router context', () => {
  it('makes useNavigate and useParams available to descendants', () => {
    render(
      <MemoryRouter>
        <RouterProbe />
      </MemoryRouter>,
    )
    expect(screen.getByTestId('navigate-available')).toHaveTextContent('yes')
    expect(screen.getByTestId('params-available')).toHaveTextContent('yes')
  })
})
