import { useState } from 'react'
import type { TypologyMeta } from '../../data/types'

type Filter = 'all' | 'single' | 'cross'

export function TypologyOverview({ typologies }: { typologies: TypologyMeta[] }) {
  const [filter, setFilter] = useState<Filter>('all')

  const visible = typologies.filter(t => {
    if (filter === 'single') return !t.cross_bank
    if (filter === 'cross') return t.cross_bank
    return true
  })

  const tabs: { id: Filter; label: string }[] = [
    { id: 'all', label: `All (${typologies.length})` },
    { id: 'single', label: 'Single-Bank' },
    { id: 'cross', label: 'Cross-Bank' },
  ]

  return (
    <section id="typologies" className="py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-navy-900 mb-2">AML Typologies</h2>
        <p className="text-slate-500 mb-8">35 typology scenarios spanning cash structuring, crypto, trade-based, and cross-border patterns.</p>
        <div className="flex gap-2 mb-8">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${filter === tab.id ? 'bg-navy-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {visible.map(t => (
            <div key={t.name} className="border border-slate-200 rounded-lg p-4 hover:border-teal-500 transition-colors">
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="font-mono text-sm font-semibold text-navy-900">{t.name}</span>
                {t.cross_bank && (
                  <span className="shrink-0 bg-teal-100 text-teal-700 text-xs font-medium px-2 py-0.5 rounded-full">cross-bank</span>
                )}
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">{t.definition}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
