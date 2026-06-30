import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { TypologyControls } from './TypologyControls'
import type { TypologyMeta } from '../../data/types'

const typologies: TypologyMeta[] = [
  { name: 'smurfing', cross_bank: false, definition: 'desc', instances_per_bank: 5 },
  { name: 'layering', cross_bank: true, definition: 'desc', instances_per_bank: 5 },
]

describe('TypologyControls', () => {
  const defaultProps = {
    typologies,
    selected: 'smurfing',
    onSelect: vi.fn(),
    activeTab: 'graph' as const,
    onTabChange: vi.fn(),
    selectedInstance: 1,
    onInstanceChange: vi.fn(),
  }

  it('renders typology dropdown', () => {
    render(<TypologyControls {...defaultProps} />)
    expect(screen.getAllByRole('combobox').length).toBeGreaterThanOrEqual(1)
  })

  it('calls onSelect when typology changes', async () => {
    const onSelect = vi.fn()
    render(<TypologyControls {...defaultProps} onSelect={onSelect} />)
    await userEvent.selectOptions(screen.getByLabelText(/typology/i), 'layering')
    expect(onSelect).toHaveBeenCalledWith('layering')
  })

  it('renders Graph, Timeline, and Heatmap tab buttons', () => {
    render(<TypologyControls {...defaultProps} />)
    expect(screen.getByRole('button', { name: /graph/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /timeline/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /heatmap/i })).toBeInTheDocument()
  })

  it('calls onTabChange when tab clicked', async () => {
    const onTabChange = vi.fn()
    render(<TypologyControls {...defaultProps} onTabChange={onTabChange} />)
    await userEvent.click(screen.getByRole('button', { name: /timeline/i }))
    expect(onTabChange).toHaveBeenCalledWith('timeline')
  })
})
