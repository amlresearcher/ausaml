interface Check {
  id: string
  name: string
  threshold: string
  interpretation: string
}

interface Category {
  label: string
  checks: Check[]
}

const CATEGORIES: Category[] = [
  {
    label: 'Statistical Fidelity',
    checks: [
      {
        id: 'C1.1',
        name: "Benford's Law Conformance",
        threshold: 'MAD < 0.015',
        interpretation: 'MAD=0.0115 — first-digit distribution conforms to Benford\'s Law.',
      },
      {
        id: 'C1.2',
        name: 'Transaction Amount Heavy Tail',
        threshold: 'P90/P10 > 10',
        interpretation: 'P90=$1,114.68, P10=$10.86, ratio=102.64 — heavy tail confirmed.',
      },
      {
        id: 'C1.3',
        name: 'Income Distribution Skewness',
        threshold: 'skewness > 0.5',
        interpretation: 'Skewness=4.407 — right-skewed income distribution consistent with real data.',
      },
      {
        id: 'C1.4',
        name: 'Cash Transaction Proportion',
        threshold: '5%–20%',
        interpretation: '829,750 / 8,840,512 = 9.39% — within expected AU cash usage range.',
      },
      {
        id: 'C1.5',
        name: 'International Wire Proportion',
        threshold: '0.5%–5%',
        interpretation: '159,279 / 8,840,512 = 1.80% — within expected range.',
      },
    ],
  },
  {
    label: 'Temporal Fidelity',
    checks: [
      {
        id: 'C2.1',
        name: 'Weekday vs Weekend Volume Ratio',
        threshold: 'weekday avg ≥ 1.5× weekend avg',
        interpretation: 'Avg weekday=50,840 txns/day, weekend=19,589 txns/day — ratio=2.60× confirmed.',
      },
      {
        id: 'C2.2',
        name: 'Business Hours Concentration',
        threshold: '≥ 60% between 07:00–22:00',
        interpretation: '80.0% of POS/ATM transactions in business hours — realistic daytime concentration.',
      },
      {
        id: 'C2.3',
        name: 'Monthly Volume Coefficient of Variation',
        threshold: 'CV > 0.08',
        interpretation: 'Monthly CV=0.382 across 7 months — sufficient seasonal variation.',
      },
      {
        id: 'C2.4',
        name: 'Payroll Periodicity',
        threshold: 'median gap std-dev ≤ 5 days',
        interpretation: 'Median payroll gap std-dev=0.00 days across 10,105 customers — regular cycle confirmed.',
      },
      {
        id: 'C2.5',
        name: 'Intraday Rhythm',
        threshold: 'peak/trough hourly ratio > 2.0',
        interpretation: 'Peak=473,967 txns, trough=188,787 txns, ratio=2.51 — realistic intraday variation.',
      },
    ],
  },
  {
    label: 'AML Signal',
    checks: [
      {
        id: 'C4.1',
        name: 'AML Transaction Velocity Spike',
        threshold: 'median ratio > 1.2×',
        interpretation: 'Median scenario-window / pre-window velocity=1.447× across 200 AML accounts — expected spike confirmed.',
      },
      {
        id: 'C4.2',
        name: 'Structuring Signal in Smurfing Scenarios',
        threshold: 'fraction > 0.35 (amounts 70–99% of CTR threshold)',
        interpretation: '35/64 smurfing deposits just below CTR threshold = 54.69% — strong structuring signal.',
      },
      {
        id: 'C4.3',
        name: 'Hard Negative Proximity',
        threshold: 'clean LR < AML LR; clean risk < suspected risk',
        interpretation: 'LR: clean=0.041, AML=0.095. KYC risk: clean=23.1, suspected=79.2 — clean separation confirmed.',
      },
    ],
  },
]

const SUMMARY = { total: 13, passed: 13 }

export function SRVValidation() {
  return (
    <section id="srv-validation" className="py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
          <div>
            <h2 className="text-3xl font-bold text-navy-900">Synthetic Realism Validation</h2>
            <p className="text-slate-500 mt-2">
              {SUMMARY.total} checks verifying statistical, temporal, and AML signal realism
              against established real-world banking benchmarks.
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Results shown for <span className="font-medium text-slate-500">Yellow Bank · Small Dataset</span>
            </p>
          </div>
          <span className="shrink-0 bg-green-100 text-green-700 text-sm font-semibold px-4 py-2 rounded-full">
            All {SUMMARY.total} checks passed
          </span>
        </div>

        <div className="space-y-10 mt-10">
          {CATEGORIES.map(cat => (
            <div key={cat.label}>
              <h3 className="text-lg font-semibold text-navy-900 mb-4 flex items-center gap-3">
                {cat.label}
                <span className="text-xs font-medium bg-green-100 text-green-700 px-2.5 py-1 rounded-full">
                  {cat.checks.length}/{cat.checks.length} passed
                </span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {cat.checks.map(check => (
                  <div key={check.id} className="border border-green-200 bg-green-50 rounded-lg p-4">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="font-mono text-xs text-slate-400 shrink-0 mt-0.5">{check.id}</span>
                      <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-0.5 rounded-full shrink-0">
                        PASS
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-navy-900 mb-1 leading-snug">{check.name}</p>
                    <p className="text-xs text-slate-500 mb-2">Threshold: {check.threshold}</p>
                    <p className="text-xs text-slate-600 leading-relaxed">{check.interpretation}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
