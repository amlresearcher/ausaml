export function About() {
  return (
    <section id="about" className="py-20 px-6 bg-white">
      <div className="max-w-4xl mx-auto space-y-12">

        <div>
          <div className="inline-block bg-navy-900 text-white text-xs font-semibold px-3 py-1 rounded-full mb-4 tracking-wide uppercase">
            The Generator
          </div>
          <h2 className="text-3xl font-bold text-navy-900 mb-4">AMLGen</h2>
          <div className="text-navy-700 space-y-4 text-base leading-relaxed">
            <p>
              AMLGen is a synthetic banking data generator that produces realistic Australian transaction
              datasets with embedded anti-money laundering typology scenarios. It is designed for researchers
              and practitioners building graph-based AML detection models, generating fully labelled banking
              data at configurable scale — from small prototype runs to large multi-bank datasets.
            </p>
            <p>
              The pipeline targets the Australian banking system (AUD, BSB/account format)
              by default, but the architecture supports US, GB, SG, NZ, and CA jurisdictions via
              configurable country profiles. Output is exportable to Parquet/CSV, Neo4j, and PyTorch Geometric
              formats.
            </p>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-12">
          <div className="inline-block bg-teal-600 text-white text-xs font-semibold px-3 py-1 rounded-full mb-4 tracking-wide uppercase">
            The Benchmark Dataset
          </div>
          <h2 className="text-3xl font-bold text-navy-900 mb-4">AusAML</h2>
          <div className="text-navy-700 space-y-4 text-base leading-relaxed">
            <p>
              AusAML (Australian Synthetic AML) is the benchmark dataset produced by AMLGen. It contains
              ground-truth-labelled transaction graphs across{' '}
              <strong>35 AML typology types</strong> that spans across structuring, layering and integration
              layers of money laundering.
            </p>
            <p>
              The dataset is released in two scales: a <strong>Small</strong> variant (50,000 customers,
              35.5M transactions) suitable for rapid prototyping and ablation studies, and a{' '}
              <strong>Large</strong> variant (250,000 customers, 167M transactions) for full-scale
              model training and evaluation. Both variants span four bank colour groups — Yellow, Red,
              White, and Orange — enabling cross-bank and intrabank detection experiments.
            </p>
          </div>
        </div>

      </div>
    </section>
  )
}
