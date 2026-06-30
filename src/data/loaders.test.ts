import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fetchDatasetStats, fetchTypologies, fetchScenario } from './loaders'
import type { DatasetStats, ScenarioData } from './types'

const mockStats: DatasetStats = {
  total_customers: 15000, total_accounts: 33786, total_transactions: 9839252,
  aml_customers: 1047, aml_ratio: 0.07, num_typologies: 35, num_banks: 5,
  date_range: { start: '2025-07-01', end: '2025-12-31' },
}

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn())
})

describe('fetchDatasetStats', () => {
  it('returns parsed DatasetStats on success', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => mockStats,
    } as Response)
    const stats = await fetchDatasetStats()
    expect(stats.total_customers).toBe(15000)
  })

  it('throws on non-ok response', async () => {
    vi.mocked(fetch).mockResolvedValue({ ok: false, status: 404 } as Response)
    await expect(fetchDatasetStats()).rejects.toThrow('Failed to load dataset_stats.json')
  })
})

describe('fetchScenario', () => {
  it('fetches scenario by typology name', async () => {
    const mockScenario: ScenarioData = {
      typology: 'smurfing', scenario_id: 'SCN_0001',
      nodes: [], edges: [], timeline: [],
    }
    vi.mocked(fetch).mockResolvedValue({ ok: true, json: async () => mockScenario } as Response)
    const data = await fetchScenario('smurfing')
    expect(data.typology).toBe('smurfing')
  })
})

describe('fetchTypologies', () => {
  it('returns array of typology metadata', async () => {
    vi.mocked(fetch).mockResolvedValue({ ok: true, json: async () => [] } as Response)
    const data = await fetchTypologies()
    expect(Array.isArray(data)).toBe(true)
  })
})
