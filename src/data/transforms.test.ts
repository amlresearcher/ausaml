import { describe, it, expect } from 'vitest'
import { toTimelineSeries, nodeColor } from './transforms'
import type { TimelineEntry, NodeRole } from './types'

describe('toTimelineSeries', () => {
  it('groups timeline entries by account_id and sorts by datetime', () => {
    const entries: TimelineEntry[] = [
      { account_id: 'a1', datetime: '2025-11-25T12:00:00', amount: 5000, direction: 'credit' },
      { account_id: 'a2', datetime: '2025-11-24T09:00:00', amount: 3000, direction: 'credit' },
      { account_id: 'a1', datetime: '2025-11-24T08:00:00', amount: 2000, direction: 'credit' },
    ]
    const series = toTimelineSeries(entries)
    expect(series).toHaveLength(2)
    const a1 = series.find(s => s.accountId === 'a1')!
    expect(a1.data).toHaveLength(2)
    expect(a1.data[0].datetime).toBe('2025-11-24T08:00:00')
    expect(a1.data[1].datetime).toBe('2025-11-25T12:00:00')
  })

  it('returns empty array for empty input', () => {
    expect(toTimelineSeries([])).toEqual([])
  })
})

describe('nodeColor', () => {
  it('returns distinct colors for different roles', () => {
    const roles: NodeRole[] = ['depositor', 'mule', 'controller', 'beneficiary']
    const colors = roles.map(nodeColor)
    expect(new Set(colors).size).toBe(roles.length)
  })
})
