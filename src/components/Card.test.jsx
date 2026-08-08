import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Card from './Card.jsx'

function renderCard(props) {
  return render(
    <MemoryRouter>
      <Card {...props} />
    </MemoryRouter>,
  )
}

const baseProps = {
  id: 1,
  name: 'Tech With Tim',
  url: 'https://youtube.com/@techwithtim',
  description: 'Programming tutorials',
  imageURL: null,
}

describe('Card', () => {
  it('card_accepts_props: renders given the five props', () => {
    renderCard(baseProps)
    expect(screen.getByText('Tech With Tim')).toBeInTheDocument()
  })

  it('renders_name_description', () => {
    renderCard(baseProps)
    expect(
      screen.getByRole('heading', { name: /tech with tim/i }),
    ).toBeInTheDocument()
    expect(screen.getByText('Programming tutorials')).toBeInTheDocument()
  })

  it('channel_link_uses_url', () => {
    renderCard(baseProps)
    expect(screen.getByRole('link', { name: 'Visit channel' })).toHaveAttribute(
      'href',
      'https://youtube.com/@techwithtim',
    )
  })

  it('detail_link_uses_id', () => {
    renderCard(baseProps)
    expect(screen.getByRole('link', { name: 'View details' })).toHaveAttribute(
      'href',
      '/creator/1',
    )
  })

  it('image_conditional: renders the image when imageURL is provided', () => {
    renderCard({ ...baseProps, imageURL: 'https://example.com/avatar.jpg' })
    expect(screen.getByRole('img', { name: /tech with tim/i })).toHaveAttribute(
      'src',
      'https://example.com/avatar.jpg',
    )
  })

  it('image_conditional: renders no image when imageURL is absent', () => {
    renderCard(baseProps)
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })
})
