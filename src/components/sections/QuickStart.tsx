import { useState } from 'react'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { githubGist } from 'react-syntax-highlighter/dist/esm/styles/hljs'

type Tab = 'dry-run' | 'full-run' | 'resume' | 'validate'

const SNIPPETS: Record<Tab, { label: string; lang: string; code: string }> = {
  'dry-run': {
    label: 'Dry Run',
    lang: 'bash',
    code: `# Clone and install
git clone https://github.com/dattatraykute/AMLBench.git
cd AMLBench
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env

# Dry run: 100 customers, ~1-2 min
python pipeline/orchestrator.py --dry-run`,
  },
  'full-run': {
    label: 'Full Run',
    lang: 'bash',
    code: `# Full run (15,000 customers, ~30-60 min depending on hardware)
python pipeline/orchestrator.py --config config/configuration.yaml`,
  },
  'resume': {
    label: 'Resume',
    lang: 'bash',
    code: `# Resume from a failed stage
python pipeline/orchestrator.py --resume 16 --runid RUN_20250401_120000`,
  },
  'validate': {
    label: 'Validate',
    lang: 'bash',
    code: `python validation/check_data_quality.py \\
  --db output/duckdb/aml_synthetic.duckdb \\
  --config config/configuration.yaml \\
  --output output/shared/quality_report.json

# Exit code 0 = pass/warn, 1 = at least one FAIL`,
  },
}

export function QuickStart() {
  const [active, setActive] = useState<Tab>('dry-run')
  const snippet = SNIPPETS[active]

  return (
    <section id="quickstart" className="py-20 px-6 bg-slate-50">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-navy-900 mb-2">Quick Start</h2>
        <p className="text-slate-500 mb-8">Get the benchmark running in minutes.</p>
        <div className="flex gap-2 mb-0">
          {(Object.keys(SNIPPETS) as Tab[]).map(tab => (
            <button
              key={tab}
              onClick={() => setActive(tab)}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${active === tab ? 'bg-navy-900 text-white' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'}`}
            >
              {SNIPPETS[tab].label}
            </button>
          ))}
        </div>
        <div className="rounded-b-lg rounded-tr-lg overflow-hidden border border-slate-200">
          <SyntaxHighlighter
            language={snippet.lang}
            style={githubGist}
            customStyle={{ margin: 0, padding: '1.25rem', fontSize: '0.8rem', fontFamily: 'JetBrains Mono, monospace' }}
          >
            {snippet.code}
          </SyntaxHighlighter>
        </div>
      </div>
    </section>
  )
}
