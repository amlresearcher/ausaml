import type { TypologyMeta } from '../../data/types'

export type VisualizerTab = 'graph' | 'timeline' | 'heatmap'

interface Props {
  typologies: TypologyMeta[]
  selected: string
  onSelect: (name: string) => void
  activeTab: VisualizerTab
  onTabChange: (tab: VisualizerTab) => void
  selectedInstance: number
  onInstanceChange: (instance: number) => void
}

const TABS: { id: VisualizerTab; label: string }[] = [
  { id: 'graph', label: 'Graph' },
  { id: 'timeline', label: 'Timeline' },
  { id: 'heatmap', label: 'Heatmap' },
]

export function TypologyControls({
  typologies, selected, onSelect,
  activeTab, onTabChange,
  selectedInstance, onInstanceChange,
}: Props) {
  const selectedMeta = typologies.find(t => t.name === selected)
  const instanceCount = selectedMeta?.instances_per_bank ?? 1

  return (
    <div className="flex flex-col gap-6">
      <div>
        <label htmlFor="typology-select" className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
          Typology
        </label>
        <select
          id="typology-select"
          value={selected}
          onChange={e => onSelect(e.target.value)}
          className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white text-navy-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          {typologies.map(t => (
            <option key={t.name} value={t.name}>{t.name}</option>
          ))}
        </select>
        {selectedMeta && <p className="mt-2 text-xs text-slate-500 leading-relaxed">{selectedMeta.definition}</p>}
        {selectedMeta?.cross_bank && (
          <span className="mt-2 inline-block bg-teal-100 text-teal-700 text-xs font-medium px-2 py-0.5 rounded-full">cross-bank</span>
        )}
      </div>

      <div>
        <label htmlFor="instance-select" className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
          Instance
        </label>
        <select
          id="instance-select"
          value={selectedInstance}
          onChange={e => onInstanceChange(Number(e.target.value))}
          className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white text-navy-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          {Array.from({ length: instanceCount }, (_, i) => i + 1).map(i => (
            <option key={i} value={i}>Instance {i}</option>
          ))}
        </select>
        <p className="mt-1 text-xs text-slate-400">{instanceCount} instance{instanceCount !== 1 ? 's' : ''} available</p>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">View</label>
        <div className="flex flex-col gap-1">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`text-left px-3 py-2 text-sm rounded-lg transition-colors ${activeTab === tab.id ? 'bg-navy-900 text-white font-medium' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-slate-200 pt-4">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Account Roles</p>
        <div className="space-y-1.5 text-xs">
          {[
            { color: '#0d9488', label: 'Depositor' },
            { color: '#dc2626', label: 'Mule' },
            { color: '#7c3aed', label: 'Controller' },
            { color: '#ea580c', label: 'Beneficiary' },
            { color: '#ca8a04', label: 'Intermediary' },
            { color: '#0284c7', label: 'Aggregator' },
            { color: '#16a34a', label: 'Source' },
            { color: '#db2777', label: 'Destination' },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: color }} />
              <span className="text-slate-600">{label}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
          <svg width="28" height="8" viewBox="0 0 28 8">
            <line x1="0" y1="4" x2="20" y2="4" stroke="#0d9488" strokeWidth="2" strokeOpacity="0.6" />
            <polygon points="20,0 28,4 20,8" fill="#0d9488" />
          </svg>
          <span>Transaction flow</span>
        </div>
      </div>
    </div>
  )
}
