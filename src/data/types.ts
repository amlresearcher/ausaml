export interface DatasetStats {
  total_customers: number
  total_accounts: number
  total_transactions: number
  aml_customers: number
  aml_ratio: number
  num_typologies: number
  num_banks: number
  date_range: { start: string; end: string }
}

export interface TypologyMeta {
  name: string
  cross_bank: boolean
  definition: string
  instances_per_bank: number
}

export type NodeType = 'customer' | 'account'
export type NodeRole =
  | 'depositor' | 'mule' | 'controller' | 'beneficiary'
  | 'intermediary' | 'aggregator' | 'source' | 'destination' | 'unknown'

export interface GraphNode {
  id: string
  type: NodeType
  role: NodeRole
  label: string
}

export interface GraphEdge {
  source: string
  target: string
  amount: number
  datetime: string
  tx_type: string
}

export interface TimelineEntry {
  account_id: string
  datetime: string
  amount: number
  direction: 'credit' | 'debit'
}

export interface ScenarioData {
  typology: string
  scenario_id: string
  nodes: GraphNode[]
  edges: GraphEdge[]
  timeline: TimelineEntry[]
}

export interface HeatmapCell {
  typology: string
  bank: string
  count: number
}

export interface HeatmapData {
  banks: string[]
  cells: HeatmapCell[]
}
