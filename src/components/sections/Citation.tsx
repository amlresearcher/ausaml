import SyntaxHighlighter from 'react-syntax-highlighter'
import { githubGist } from 'react-syntax-highlighter/dist/esm/styles/hljs'

const BIBTEX = `@misc{amlbench2025,
  title     = {AMLGen: A Synthetic AML Transaction Dataset for Graph Neural Networks},
  author    = {Kute, Dattatray},
  year      = {2025},
  url       = {https://github.com/dattatraykute/AMLBench},
  note      = {Synthetic banking dataset with 35 AML typology scenarios}
}`

export function Citation() {
  return (
    <section id="citation" className="py-20 px-6 bg-white">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-navy-900 mb-2">Citation</h2>
        <p className="text-slate-500 mb-6">If you use AMLGen in your research, please cite:</p>
        <div className="rounded-lg overflow-hidden border border-slate-200">
          <SyntaxHighlighter
            language="bibtex"
            style={githubGist}
            customStyle={{ margin: 0, padding: '1.25rem', fontSize: '0.8rem', fontFamily: 'JetBrains Mono, monospace' }}
          >
            {BIBTEX}
          </SyntaxHighlighter>
        </div>
      </div>
    </section>
  )
}
