import { useEffect, useState } from 'react'
import { TypologyControls } from '../components/visualizer/TypologyControls'
import type { VisualizerTab } from '../components/visualizer/TypologyControls'
import { GraphView } from '../components/visualizer/GraphView'
import { TimelineView } from '../components/visualizer/TimelineView'
import { HeatmapView } from '../components/visualizer/HeatmapView'
import { fetchTypologies, fetchScenario, fetchHeatmap } from '../data/loaders'
import type { TypologyMeta, ScenarioData, HeatmapData } from '../data/types'

export function TypologyExplorer() {
  const [typologies, setTypologies] = useState<TypologyMeta[]>([])
  const [selected, setSelected] = useState<string>('')
  const [selectedInstance, setSelectedInstance] = useState<number>(1)
  const [scenario, setScenario] = useState<ScenarioData | null>(null)
  const [heatmap, setHeatmap] = useState<HeatmapData | null>(null)
  const [activeTab, setActiveTab] = useState<VisualizerTab>('graph')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchTypologies()
      .then(t => {
        const enabled = t.filter(x => (x as TypologyMeta & { enabled?: boolean }).enabled !== false)
        setTypologies(enabled)
        if (enabled.length > 0) setSelected(enabled[0].name)
      })
      .catch(() => setError('Failed to load typology list.'))

    fetchHeatmap().then(setHeatmap).catch(() => {})
  }, [])

  useEffect(() => {
    if (!selected) return
    setSelectedInstance(1)
  }, [selected])

  useEffect(() => {
    if (!selected) return
    setLoading(true)
    setError(null)
    fetchScenario(selected, selectedInstance)
      .then(setScenario)
      .catch(() => setError(`No sample data available for "${selected}" instance ${selectedInstance}.`))
      .finally(() => setLoading(false))
  }, [selected, selectedInstance])

  return (
    <div className="flex h-[calc(100vh-3.5rem)]">
      <aside className="w-64 shrink-0 bg-white border-r border-slate-200 p-5 overflow-y-auto">
        <h1 className="text-base font-bold text-navy-900 mb-5">Typology Explorer</h1>
        <TypologyControls
          typologies={typologies}
          selected={selected}
          onSelect={setSelected}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          selectedInstance={selectedInstance}
          onInstanceChange={setSelectedInstance}
        />
      </aside>
      <main className="flex-1 overflow-auto bg-slate-50 p-6">
        {loading && (
          <div className="flex items-center justify-center h-64 text-slate-400 text-sm">Loading scenario data…</div>
        )}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">{error}</div>
        )}
        {!loading && !error && scenario && activeTab === 'graph' && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden" style={{ height: '70vh' }}>
            <div className="px-4 py-3 border-b border-slate-100 text-sm font-semibold text-navy-900">
              Transaction Flow — <span className="font-mono text-teal-600">{scenario.typology}</span>
              <span className="ml-2 text-xs text-slate-400 font-normal">{scenario.scenario_id}</span>
              <span className="ml-2 text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-normal">
                Instance {selectedInstance}
              </span>
            </div>
            <GraphView scenario={scenario} />
          </div>
        )}
        {!loading && !error && scenario && activeTab === 'timeline' && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-sm font-semibold text-navy-900 mb-4">
              Transaction Timeline — <span className="font-mono text-teal-600">{scenario.typology}</span>
            </h2>
            <TimelineView timeline={scenario.timeline} nodes={scenario.nodes} />
          </div>
        )}
        {!loading && activeTab === 'heatmap' && heatmap && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-sm font-semibold text-navy-900 mb-2">Typology × Bank Instance Count</h2>
            <p className="text-xs text-slate-400 mb-4">Darker = more scenario instances in that bank.</p>
            <HeatmapView data={heatmap} />
          </div>
        )}
      </main>
    </div>
  )
}
