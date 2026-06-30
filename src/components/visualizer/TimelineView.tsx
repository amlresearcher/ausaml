import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import type { TimelineEntry, GraphNode } from '../../data/types'
import { toTimelineSeries } from '../../data/transforms'

const LINE_COLORS = ['#0d9488', '#7c3aed', '#ea580c', '#0284c7', '#ca8a04', '#dc2626']

interface Props {
  timeline: TimelineEntry[]
  nodes?: GraphNode[]
}

export function TimelineView({ timeline, nodes = [] }: Props) {
  if (timeline.length === 0) {
    return (
      <div data-testid="timeline-view" className="flex items-center justify-center h-64 text-slate-400 text-sm">
        No timeline data available for this scenario.
      </div>
    )
  }

  const labelMap = new Map(nodes.map(n => [n.id, n.label]))

  const series = toTimelineSeries(timeline.filter(e => e.direction === 'credit'))
  const allDates = [...new Set(timeline.map(e => e.datetime))].sort()

  // Use account label as the data key so the legend shows it directly
  const getKey = (accountId: string) => labelMap.get(accountId) ?? accountId.slice(0, 8)

  const chartData = allDates.map(dt => {
    const row: Record<string, string | number> = { datetime: dt.replace('T', ' ').slice(0, 16) }
    for (const s of series) {
      const match = s.data.find(d => d.datetime === dt)
      row[getKey(s.accountId)] = match ? match.amount : 0
    }
    return row
  })

  return (
    <div data-testid="timeline-view" className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 30, right: 20, left: 10, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="datetime" tick={{ fontSize: 10 }} angle={-45} textAnchor="end" interval="preserveStartEnd" />
          <YAxis tick={{ fontSize: 10 }} tickFormatter={v => `$${(v as number).toLocaleString()}`} />
          <Tooltip formatter={(value: number) => [`$${value.toLocaleString()}`, 'Amount']} />
          <Legend verticalAlign="top" wrapperStyle={{ fontSize: 11, paddingBottom: 8 }} />
          {series.map((s, i) => (
            <Line key={s.accountId} type="monotone" dataKey={getKey(s.accountId)}
              stroke={LINE_COLORS[i % LINE_COLORS.length]} dot={false} strokeWidth={2} />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
