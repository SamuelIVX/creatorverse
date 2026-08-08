import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Card from './Card.jsx'

describe('Card', () => {
  it('card_accepts_props: renders without error given the five props', () => {
    render(
      <Card
        id={1}
        name="Tech With Tim"
        url="https://youtube.com/@techwithtim"
        description="Programming tutorials"
        imageURL={null}
      />,
    )
    expect(screen.getByText('Tech With Tim')).toBeInTheDocument()
  })
})
