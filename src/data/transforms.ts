import type { TimelineEntry, NodeRole } from './types'

export interface TimelineSeries {
  accountId: string
  data: { datetime: string; amount: number; direction: 'credit' | 'debit' }[]
}

export function toTimelineSeries(entries: TimelineEntry[]): TimelineSeries[] {
  const map = new Map<string, TimelineSeries>()
  for (const e of entries) {
    if (!map.has(e.account_id)) {
      map.set(e.account_id, { accountId: e.account_id, data: [] })
    }
    map.get(e.account_id)!.data.push({
      datetime: e.datetime,
      amount: e.amount,
      direction: e.direction,
    })
  }
  for (const series of map.values()) {
    series.data.sort((a, b) => a.datetime.localeCompare(b.datetime))
  }
  return Array.from(map.values())
}

const ROLE_COLORS: Record<NodeRole, string> = {
  depositor:    '#0d9488',
  mule:         '#dc2626',
  controller:   '#7c3aed',
  beneficiary:  '#ea580c',
  intermediary: '#ca8a04',
  aggregator:   '#0284c7',
  source:       '#16a34a',
  destination:  '#db2777',
  unknown:      '#94a3b8',
}

export function nodeColor(role: NodeRole): string {
  return ROLE_COLORS[role] ?? ROLE_COLORS.unknown
}
