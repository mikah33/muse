'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface CustomPage {
  id: string
  title: string
  slug: string
  show_in_header: boolean
  show_in_mobile_menu: boolean
  order_position: number
}

interface HeaderProps {
  customPages?: CustomPage[]
}

export default function Header({ customPages = [] }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [pagesDropdownOpen, setPagesDropdownOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const defaultNavItems = ['About', 'Services', 'Portfolio', 'Blog', 'Contact']
  const headerCustomPages = customPages.filter(p => p.show_in_header)
  const mobileCustomPages = customPages.filter(p => p.show_in_mobile_menu)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (pagesDropdownOpen) setPagesDropdownOpen(false)
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [pagesDropdownOpen])

  return (
    <header
      className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-500 ${
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-black/30 backdrop-blur-sm'
      }`}
    >
      <nav className="w-full max-w-7xl mx-auto px-4 md:px-6 lg:px-12">
        <div className="flex justify-between items-center h-20 lg:h-24">
          {/* Logo */}
          <Link href="/" className="block relative z-50">
            <img
              src="/images/logo-white.png"
              alt="Model Muse Studio"
              className="h-10 md:h-12 lg:h-16 w-auto transition-all duration-500"
              style={{
                filter: scrolled ? 'brightness(0) saturate(100%)' : 'brightness(0) invert(1)'
              }}
            />
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden lg:flex items-center space-x-4 xl:space-x-8">
            {defaultNavItems.map((item) => (
              <li key={item}>
                <Link
                  href={`/${item.toLowerCase()}`}
                  className={`text-xs xl:text-sm tracking-wider xl:tracking-widest uppercase transition-all duration-300 hover:opacity-70 whitespace-nowrap ${
                    scrolled ? 'text-black' : 'text-white'
                  }`}
                >
                  {item}
                </Link>
              </li>
            ))}

            {/* Pages Dropdown */}
            {headerCustomPages.length > 0 && (
              <li className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setPagesDropdownOpen(!pagesDropdownOpen)
                  }}
                  className={`text-xs xl:text-sm tracking-wider xl:tracking-widest uppercase transition-all duration-300 hover:opacity-70 whitespace-nowrap flex items-center gap-1 ${
                    scrolled ? 'text-black' : 'text-white'
                  }`}
                >
                  Pages
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ${
                      pagesDropdownOpen ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {pagesDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 min-w-[200px] bg-white shadow-lg rounded-md py-2 z-50">
                    {headerCustomPages.map((page) => (
                      <Link
                        key={page.id}
                        href={`/${page.slug}`}
                        className="block px-4 py-2 text-xs xl:text-sm tracking-wider uppercase text-black hover:bg-gray-100 transition-colors whitespace-nowrap"
                        onClick={() => setPagesDropdownOpen(false)}
                      >
                        {page.title}
                      </Link>
                    ))}
                  </div>
                )}
              </li>
            )}

            <li>
              <Link
                href="/login"
                className={`px-4 xl:px-6 py-2 text-xs xl:text-sm tracking-wider xl:tracking-widest uppercase border transition-all duration-300 whitespace-nowrap ${
                  scrolled
                    ? 'border-black text-black hover:bg-black hover:text-white'
                    : 'border-white text-white hover:bg-white hover:text-black'
                }`}
              >
                Model Login
              </Link>
            </li>
          </ul>

          {/* Mobile Menu Button */}
          <button
            className={`lg:hidden relative z-50 p-2 ${scrolled ? 'text-black' : 'text-white'}`}
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
      </nav>

      {/* Mobile Menu - Outside nav container */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed top-20 left-0 right-0 bg-white shadow-lg z-40 max-w-full">
          <ul className="flex flex-col py-4">
            {defaultNavItems.map((item) => (
              <li key={item}>
                <Link
                  href={`/${item.toLowerCase()}`}
                  className="block px-6 py-3 text-sm tracking-widest uppercase text-black hover:bg-gray-100"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item}
                </Link>
              </li>
            ))}
            {mobileCustomPages.map((page) => (
              <li key={page.id}>
                <Link
                  href={`/${page.slug}`}
                  className="block px-6 py-3 text-sm tracking-widest uppercase text-black hover:bg-gray-100"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {page.title}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/login"
                className="block px-6 py-3 text-sm tracking-widest uppercase text-black hover:bg-gray-100"
                onClick={() => setMobileMenuOpen(false)}
              >
                Model Login
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  )
}
