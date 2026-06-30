import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { HeatmapView } from './HeatmapView'
import type { HeatmapData } from '../../data/types'

const mockData: HeatmapData = {
  banks: ['bank_cba', 'bank_anz'],
  cells: [
    { typology: 'smurfing', bank: 'bank_cba', count: 5 },
    { typology: 'smurfing', bank: 'bank_anz', count: 4 },
    { typology: 'layering', bank: 'bank_cba', count: 5 },
    { typology: 'layering', bank: 'bank_anz', count: 5 },
  ],
}

describe('HeatmapView', () => {
  it('renders without crashing', () => {
    render(<HeatmapView data={mockData} />)
    expect(screen.getByTestId('heatmap-view')).toBeInTheDocument()
  })

  it('renders bank column headers', () => {
    render(<HeatmapView data={mockData} />)
    expect(screen.getByText('bank_cba')).toBeInTheDocument()
    expect(screen.getByText('bank_anz')).toBeInTheDocument()
  })

  it('renders typology row labels', () => {
    render(<HeatmapView data={mockData} />)
    expect(screen.getByText('smurfing')).toBeInTheDocument()
    expect(screen.getByText('layering')).toBeInTheDocument()
  })
})
