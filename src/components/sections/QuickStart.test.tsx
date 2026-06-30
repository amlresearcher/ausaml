import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import { QuickStart } from './QuickStart'

describe('QuickStart', () => {
  it('renders Dry Run tab by default', () => {
    render(<QuickStart />)
    expect(screen.getByRole('button', { name: /dry run/i })).toBeInTheDocument()
  })

  it('shows full run code when Full Run tab is clicked', async () => {
    render(<QuickStart />)
    await userEvent.click(screen.getByRole('button', { name: /full run/i }))
    expect(screen.getByText(/configuration\.yaml/)).toBeInTheDocument()
  })
})
