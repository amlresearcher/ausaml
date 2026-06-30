import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import { Hero } from './Hero'

describe('Hero', () => {
  it('renders headline', () => {
    render(<MemoryRouter><Hero /></MemoryRouter>)
    expect(screen.getByRole('heading', { name: /AMLGen/i })).toBeInTheDocument()
  })

it('renders View on GitHub CTA', () => {
    render(<MemoryRouter><Hero /></MemoryRouter>)
    expect(screen.getByRole('link', { name: /view on github/i })).toBeInTheDocument()
  })
})
