import Link from 'next/link'
import { cn } from '@/lib/utils'

interface HeaderProps {
  className?: string
}

const navLinks = [
  { href: '/robots', label: 'Robots' },
  { href: '/jobs', label: 'Métiers' },
  { href: '/glossary', label: 'Glossaire' },
  { href: '/tracker', label: 'Tracker' },
]

export function Header({ className }: HeaderProps) {
  return (
    <header
      className={cn(
        'border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50',
        className
      )}
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-slate-900">
          Radaroid
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-slate-600 hover:text-slate-900 transition"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        {/* Mobile menu button - will add later */}
        <button
          className="md:hidden p-2 text-slate-600 hover:text-slate-900"
          aria-label="Menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
        </button>
      </div>
    </header>
  )
}
