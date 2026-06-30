import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { GraphView } from './GraphView'
import type { ScenarioData } from '../../data/types'

const mockScenario: ScenarioData = {
  typology: 'smurfing',
  scenario_id: 'SCN_0001',
  nodes: [
    { id: 'c1', type: 'customer', role: 'depositor', label: 'Customer A' },
    { id: 'a1', type: 'account', role: 'mule', label: 'ACC-001' },
  ],
  edges: [
    { source: 'c1', target: 'a1', amount: 9800, datetime: '2025-11-25T10:00:00', tx_type: 'cash_deposit' },
  ],
  timeline: [],
}

describe('GraphView', () => {
  it('renders an SVG container', () => {
    render(<GraphView scenario={mockScenario} />)
    expect(document.querySelector('svg')).toBeInTheDocument()
  })

  it('renders a node for each graph node', () => {
    render(<GraphView scenario={mockScenario} />)
    const circles = document.querySelectorAll('circle')
    expect(circles.length).toBeGreaterThanOrEqual(mockScenario.nodes.length)
  })
})
