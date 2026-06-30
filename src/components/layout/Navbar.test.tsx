import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import { Navbar } from './Navbar'

describe('Navbar', () => {
  const renderNav = () => render(<MemoryRouter><Navbar /></MemoryRouter>)

  it('renders site name', () => {
    renderNav()
    expect(screen.getByText('AMLGen')).toBeInTheDocument()
  })

  it('renders Typology Explorer link', () => {
    renderNav()
    expect(screen.getByRole('link', { name: /typology explorer/i })).toBeInTheDocument()
  })

  it('renders GitHub link', () => {
    renderNav()
    const ghLink = screen.getByRole('link', { name: /github/i })
    expect(ghLink).toHaveAttribute('href', 'https://github.com/dattatraykute/AMLBench')
  })
})
