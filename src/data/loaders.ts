import type { DatasetStats, TypologyMeta, ScenarioData, HeatmapData } from './types'

// Fallback for test environment where import.meta.env.BASE_URL may be undefined
const BASE = (typeof import.meta !== 'undefined' && (import.meta as { env?: { BASE_URL?: string } }).env?.BASE_URL) || '/'

async function load<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}data/${path}`)
  if (!res.ok) throw new Error(`Failed to load ${path}`)
  return res.json() as Promise<T>
}

export const fetchDatasetStats = (): Promise<DatasetStats> =>
  load<DatasetStats>('dataset_stats.json')

export const fetchTypologies = (): Promise<TypologyMeta[]> =>
  load<TypologyMeta[]>('typologies.json')

export async function fetchScenario(name: string, instance = 1): Promise<ScenarioData> {
  if (instance > 1) {
    try {
      return await load<ScenarioData>(`scenarios/${name}_${instance}.json`)
    } catch {
      // fall through to default file
    }
  }
  return load<ScenarioData>(`scenarios/${name}.json`)
}

export const fetchHeatmap = (): Promise<HeatmapData> =>
  load<HeatmapData>('heatmap.json')
