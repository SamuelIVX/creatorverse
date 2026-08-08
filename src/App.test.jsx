import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from './App.jsx'

function renderAt(path) {
  render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  )
}

describe('routes', () => {
  it('routes_render_pages: / renders ShowCreators', () => {
    renderAt('/')
    expect(screen.getByRole('heading', { name: /creators/i })).toBeInTheDocument()
  })

  it('routes_render_pages: /creator/:id renders ViewCreator', () => {
    renderAt('/creator/7')
    expect(screen.getByRole('heading', { name: /creator 7/i })).toBeInTheDocument()
  })

  it('routes_render_pages: /add renders AddCreator', () => {
    renderAt('/add')
    expect(screen.getByRole('heading', { name: /add creator/i })).toBeInTheDocument()
  })

  it('routes_render_pages: /edit/:id renders EditCreator', () => {
    renderAt('/edit/9')
    expect(screen.getByRole('heading', { name: /edit creator 9/i })).toBeInTheDocument()
  })

  it('id_param_readable: ViewCreator reads the id from useParams', () => {
    renderAt('/creator/42')
    expect(screen.getByRole('heading', { name: /creator 42/i })).toBeInTheDocument()
  })

  it('id_param_readable: EditCreator reads the id from useParams', () => {
    renderAt('/edit/42')
    expect(screen.getByRole('heading', { name: /edit creator 42/i })).toBeInTheDocument()
  })
})
