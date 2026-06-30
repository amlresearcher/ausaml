import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import { TypologyOverview } from './TypologyOverview'
import type { TypologyMeta } from '../../data/types'

const mockTypologies: TypologyMeta[] = [
  { name: 'smurfing', cross_bank: false, definition: 'Coordinated cash deposits below CTR threshold', instances_per_bank: 5 },
  { name: 'funnel_account', cross_bank: false, definition: 'Rapid forwarding from many sources', instances_per_bank: 5 },
  { name: 'layering', cross_bank: true, definition: 'Transfers across jurisdictions', instances_per_bank: 5 },
]

describe('TypologyOverview', () => {
  it('renders all typology names', () => {
    render(<TypologyOverview typologies={mockTypologies} />)
    expect(screen.getByText('smurfing')).toBeInTheDocument()
    expect(screen.getByText('funnel_account')).toBeInTheDocument()
    expect(screen.getByText('layering')).toBeInTheDocument()
  })

  it('shows cross-bank badge on cross_bank typologies', () => {
    render(<TypologyOverview typologies={mockTypologies} />)
    expect(screen.getByText('cross-bank')).toBeInTheDocument()
  })

  it('filters to single-bank only when tab selected', async () => {
    render(<TypologyOverview typologies={mockTypologies} />)
    await userEvent.click(screen.getByRole('button', { name: /single-bank/i }))
    expect(screen.getByText('smurfing')).toBeInTheDocument()
    expect(screen.queryByText('layering')).not.toBeInTheDocument()
  })
})
