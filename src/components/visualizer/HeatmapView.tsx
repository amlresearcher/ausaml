import type { HeatmapData } from '../../data/types'

function cellColor(count: number, max: number): string {
  if (count === 0) return '#f1f5f9'
  const intensity = count / Math.max(max, 1)
  if (intensity < 0.25) return '#ccfbf1'
  if (intensity < 0.5)  return '#5eead4'
  if (intensity < 0.75) return '#0d9488'
  return '#0f766e'
}

export function HeatmapView({ data }: { data: HeatmapData }) {
  const { banks, cells } = data
  const typologies = [...new Set(cells.map(c => c.typology))].sort()
  const maxCount = Math.max(...cells.map(c => c.count), 1)

  return (
    <div data-testid="heatmap-view" className="overflow-x-auto">
      <table className="text-xs border-collapse min-w-full">
        <thead>
          <tr>
            <th className="text-left px-3 py-2 font-semibold text-slate-500 border-b border-slate-200">Typology</th>
            {banks.map(bank => (
              <th key={bank} className="px-3 py-2 font-mono text-slate-500 border-b border-slate-200 text-center">{bank}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {typologies.map(typology => (
            <tr key={typology} className="hover:bg-slate-50">
              <td className="font-mono px-3 py-1.5 text-navy-800 border-b border-slate-100">{typology}</td>
              {banks.map(bank => {
                const cell = cells.find(c => c.typology === typology && c.bank === bank)
                const count = cell?.count ?? 0
                return (
                  <td key={bank} className="px-3 py-1.5 text-center border-b border-slate-100 font-medium"
                    style={{ backgroundColor: cellColor(count, maxCount) }}
                    title={`${typology} × ${bank}: ${count} scenarios`}>
                    {count > 0 ? count : '—'}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
