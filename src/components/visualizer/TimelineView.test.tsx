import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { TimelineView } from './TimelineView'
import type { TimelineEntry } from '../../data/types'

const entries: TimelineEntry[] = [
  { account_id: 'a1', datetime: '2025-11-24T08:00:00', amount: 2000, direction: 'credit' },
  { account_id: 'a1', datetime: '2025-11-25T10:00:00', amount: 5000, direction: 'credit' },
]

describe('TimelineView', () => {
  it('renders without crashing', () => {
    render(<TimelineView timeline={entries} />)
    expect(screen.getByTestId('timeline-view')).toBeInTheDocument()
  })

  it('renders empty state when no entries', () => {
    render(<TimelineView timeline={[]} />)
    expect(screen.getByText(/no timeline data/i)).toBeInTheDocument()
  })
})
