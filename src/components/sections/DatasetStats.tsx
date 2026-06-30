const METRICS = [
  'Primary Customers',
  'Accounts',
  'Transactions',
  'AML Customers',
  'AML Ratio',
  'Scenarios',
  'Typologies',
] as const

type Metric = typeof METRICS[number]
type Row = [string, string, string, string, string]

const SMALL: Record<Metric, Row> = {
  'Primary Customers': ['12,500',     '12,500',     '12,500',     '12,500',     '50,000'],
  'Accounts':          ['28,140',     '28,174',     '28,248',     '28,058',     '112,620'],
  'Transactions':      ['8,885,318',  '8,866,551',  '8,921,294',  '8,881,725',  '35,554,888'],
  'AML Customers':     ['655',        '612',        '596',        '639',        '2,502'],
  'AML Ratio':         ['2.73%',      '2.54%',      '2.48%',      '2.67%',      '5.00%'],
  'Scenarios':         ['196',        '180',        '183',        '181',        '740'],
  'Typologies':        ['29',         '27',         '27',         '29',         '29'],
}

const LARGE: Record<Metric, Row> = {
  'Primary Customers': ['62,500',     '62,500',     '62,500',     '62,500',     '250,000'],
  'Accounts':          ['141,699',    '142,237',    '141,557',    '141,322',    '566,815'],
  'Transactions':      ['41.91M',     '41.90M',     '41.81M',     '41.72M',     '167.34M'],
  'AML Customers':     ['1,333',      '1,345',      '1,259',      '1,288',      '5,225'],
  'AML Ratio':         ['1.9%',       '1.9%',       '1.8%',       '1.8%',       '1.9%'],
  'Scenarios':         ['553',        '563',        '533',        '548',        '2,197'],
  'Typologies':        ['35',         '35',         '35',         '35',         '35'],
}

const COLS = ['Yellow', 'Red', 'White', 'Orange', 'Combined'] as const
type Col = typeof COLS[number]

const DOT: Record<Col, string> = {
  Yellow:   'bg-yellow-400',
  Red:      'bg-red-500',
  White:    'border border-slate-300 bg-white',
  Orange:   'bg-orange-400',
  Combined: 'bg-teal-500',
}

const HEAD: Record<Col, string> = {
  Yellow:   'text-yellow-700',
  Red:      'text-red-600',
  White:    'text-slate-500',
  Orange:   'text-orange-600',
  Combined: 'text-teal-700',
}

function DataTable({ data }: { data: Record<Metric, Row> }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-b-2 border-slate-200">
            <th className="text-left py-3 pr-4 font-semibold text-navy-900 w-40">Metric</th>
            {COLS.map((col) => (
              <th
                key={col}
                className={`text-right py-3 px-3 font-semibold ${HEAD[col]} ${col === 'Combined' ? 'border-l border-slate-200' : ''}`}
              >
                <div className="flex items-center justify-end gap-1.5">
                  <span className={`inline-block w-2.5 h-2.5 rounded-full shrink-0 ${DOT[col]}`} />
                  {col}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {METRICS.map((metric, i) => (
            <tr key={metric} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}>
              <td className="py-2.5 pr-4 font-medium text-navy-800">{metric}</td>
              {data[metric].map((val, j) => (
                <td
                  key={j}
                  className={`py-2.5 px-3 text-right tabular-nums text-navy-700 ${j === 4 ? 'border-l border-slate-200 font-semibold text-navy-900' : ''}`}
                >
                  {val}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function DatasetStats() {
  return (
    <section id="stats" className="py-20 px-6 bg-slate-50">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-10">
          <div>
            <h2 className="text-3xl font-bold text-navy-900 mb-2">AusAML Dataset Summary</h2>
            <p className="text-slate-500">
              Four bank colour groups (Yellow · Red · White · Orange) across two dataset scales
            </p>
          </div>
          <a
            href="https://huggingface.co/datasets/DVK2026/AMLBench"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-slate-900 text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm-1 14.5v-9l7 4.5-7 4.5z"/>
            </svg>
            Download on Hugging Face
          </a>
        </div>

        <div className="space-y-8">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-5">
              <span className="bg-slate-100 text-slate-700 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide">
                Small Dataset
              </span>
              <span className="text-slate-400 text-sm">50,000 primary customers · 35.5M transactions</span>
            </div>
            <DataTable data={SMALL} />
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-5">
              <span className="bg-navy-900 text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide">
                Large Dataset
              </span>
              <span className="text-slate-400 text-sm">250,000 primary customers · 167.34M transactions</span>
            </div>
            <DataTable data={LARGE} />
          </div>
        </div>
      </div>
    </section>
  )
}
