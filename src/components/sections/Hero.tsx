export function Hero() {
  return (
    <section className="bg-navy-900 text-white py-24 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-block bg-teal-600 text-white text-xs font-semibold px-3 py-1 rounded-full mb-6 tracking-wide uppercase">
          Benchmark Dataset
        </div>
        <h1 className="text-5xl font-bold tracking-tight mb-10">AMLGen</h1>
        <div className="flex flex-wrap gap-4 justify-center">
          <a
            href="https://github.com/dattatraykute/AMLBench"
            target="_blank"
            rel="noopener noreferrer"
            className="border border-slate-500 hover:border-slate-300 text-slate-300 hover:text-white font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            View on GitHub ↗
          </a>
        </div>
      </div>
    </section>
  )
}
