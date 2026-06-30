import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { DatasetStats } from './DatasetStats'

describe('DatasetStats', () => {
  it('renders small dataset combined customer count', () => {
    render(<DatasetStats />)
    expect(screen.getAllByText('50,000').length).toBeGreaterThan(0)
  })

  it('renders large dataset combined customer count', () => {
    render(<DatasetStats />)
    expect(screen.getAllByText('250,000').length).toBeGreaterThan(0)
  })

  it('renders small dataset transaction count', () => {
    render(<DatasetStats />)
    expect(screen.getByText('35,554,888')).toBeInTheDocument()
  })

  it('renders large dataset transaction count', () => {
    render(<DatasetStats />)
    expect(screen.getByText('167.34M')).toBeInTheDocument()
  })

  it('renders both dataset headings', () => {
    render(<DatasetStats />)
    expect(screen.getByText('Small Dataset')).toBeInTheDocument()
    expect(screen.getByText('Large Dataset')).toBeInTheDocument()
  })
})
