import Link from 'next/link'
import { cn } from '@/lib/utils'

interface FooterProps {
  className?: string
}

const footerLinks = [
  { href: '/glossary', label: 'Glossaire' },
  { href: '/tracker', label: 'Deployment Tracker' },
  { href: '/llms.txt', label: 'llms.txt', external: true },
]

export function Footer({ className }: FooterProps) {
  const currentYear = new Date().getFullYear()

  return (
    <footer className={cn('border-t bg-slate-50', className)}>
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-slate-600 text-sm">
            © {currentYear} Radaroid. Le DXOMARK des Robots.
          </div>
          <div className="flex gap-6 text-sm">
            {footerLinks.map((link) =>
              link.external ? (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-slate-600 hover:text-slate-900"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-slate-600 hover:text-slate-900"
                >
                  {link.label}
                </Link>
              )
            )}
          </div>
        </div>
      </div>
    </footer>
  )
}
