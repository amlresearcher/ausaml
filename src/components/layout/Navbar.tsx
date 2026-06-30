import { Link } from 'react-router-dom'

const ANCHOR_LINKS = [
  { href: '#about',      label: 'About'      },
  { href: '#stats',      label: 'Dataset'    },
  { href: '#typologies', label: 'Typologies' },
  { href: '#validation', label: 'Validation' },
]

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-navy-900 text-white shadow-md">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link to="/" className="font-semibold text-lg tracking-tight hover:text-teal-500 transition-colors shrink-0">
          AMLGen
        </Link>
        <div className="flex items-center gap-5 text-sm font-medium overflow-x-auto">
          {ANCHOR_LINKS.map(({ href, label }) => (
            <a key={href} href={href} className="text-slate-300 hover:text-white transition-colors whitespace-nowrap">
              {label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  )
}
