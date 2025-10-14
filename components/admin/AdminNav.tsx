'use client'

import Link from 'next/link'
import { useState } from 'react'
import { usePathname } from 'next/navigation'

interface AdminNavProps {
  userEmail?: string | null
}

export default function AdminNav({ userEmail }: AdminNavProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  const navLinks = [
    { href: '/admin', label: 'Dashboard' },
    { href: '/admin/blog', label: 'Blog' },
    { href: '/admin/portfolio', label: 'Portfolio' },
    { href: '/admin/customers', label: 'Customers' },
    { href: '/admin/settings', label: 'Settings' },
  ]

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin'
    }
    return pathname?.startsWith(href)
  }

  return (
    <nav className="bg-charcoal text-white border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="font-serif text-lg md:text-xl tracking-widest hover:text-gray-300 relative z-50">
            MODEL MUSE
            <span className="block text-[8px] tracking-[0.3em]">STUDIO</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex gap-6 text-sm">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`hover:text-gray-300 transition-colors ${
                    isActive(link.href) ? 'text-white font-semibold' : 'text-gray-400'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-4 text-sm">
              {userEmail && <span className="text-gray-400 hidden lg:block">{userEmail}</span>}
              <form action="/api/auth/signout" method="post">
                <button
                  type="submit"
                  className="px-4 py-2 border border-gray-600 hover:bg-gray-800 transition-colors text-xs md:text-sm"
                >
                  Sign Out
                </button>
              </form>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden relative z-50 p-2 text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed top-[73px] left-0 right-0 bg-charcoal border-b border-gray-700 z-40 max-w-full">
          <ul className="flex flex-col">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`block px-6 py-3 text-sm hover:bg-gray-800 transition-colors ${
                    isActive(link.href) ? 'bg-gray-800 text-white font-semibold' : 'text-gray-400'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="border-t border-gray-700 px-6 py-3">
              {userEmail && (
                <div className="text-xs text-gray-400 mb-3">{userEmail}</div>
              )}
              <form action="/api/auth/signout" method="post">
                <button
                  type="submit"
                  className="w-full px-4 py-2 border border-gray-600 hover:bg-gray-800 transition-colors text-sm"
                >
                  Sign Out
                </button>
              </form>
            </li>
          </ul>
        </div>
      )}
    </nav>
  )
}
