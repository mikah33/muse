import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-12 py-4 md:py-6">
        {/* Main Content - All in one row */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 md:gap-8">
          {/* Brand */}
          <div className="flex-shrink-0">
            <img
              src="/images/logo-white.png"
              alt="Model Muse Studio"
              className="h-8 md:h-10 w-auto mb-2"
            />
            <p className="text-gray-400 text-xs max-w-[200px]">
              Elevating careers through exceptional imagery.
            </p>
          </div>

          {/* Navigation Sections - Horizontal on Desktop */}
          <div className="flex flex-wrap gap-8 md:gap-12 lg:gap-16">
            {/* Quick Links */}
            <div>
              <h4 className="text-xs tracking-[0.2em] mb-2">EXPLORE</h4>
              <ul className="space-y-1 text-xs text-gray-400">
                <li>
                  <Link href="/about" className="hover:text-white transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/services" className="hover:text-white transition-colors">
                    Services
                  </Link>
                </li>
                <li>
                  <Link href="/portfolio" className="hover:text-white transition-colors">
                    Portfolio
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="hover:text-white transition-colors">
                    Blog
                  </Link>
                </li>
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="text-xs tracking-[0.2em] mb-2">SERVICES</h4>
              <ul className="space-y-1 text-xs text-gray-400">
                <li>Model Portfolios</li>
                <li>Actor Headshots</li>
                <li>Comp Cards</li>
                <li>Digitals</li>
              </ul>
            </div>

            {/* Social & Admin */}
            <div>
              <h4 className="text-xs tracking-[0.2em] mb-2">CONNECT</h4>
              <div className="flex space-x-2 mb-3">
                <a
                  href="https://www.instagram.com/modelmusestudio"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-7 h-7 border border-gray-700 flex items-center justify-center hover:border-white hover:bg-white group transition-all"
                  aria-label="Instagram"
                >
                  <svg className="w-3 h-3 fill-current group-hover:text-black" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a
                  href="https://www.facebook.com/modelmusestudio"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-7 h-7 border border-gray-700 flex items-center justify-center hover:border-white hover:bg-white group transition-all"
                  aria-label="Facebook"
                >
                  <svg className="w-3 h-3 fill-current group-hover:text-black" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
              </div>
              <Link
                href="/admin/login"
                className="inline-block px-3 py-1 border border-gray-700 text-xs tracking-widest hover:border-white hover:bg-white hover:text-black transition-all"
              >
                ADMIN
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 mt-4 md:mt-6 pt-3 md:pt-4 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-500 tracking-wider gap-2">
          <p className="text-center sm:text-left">© 2024 MODEL MUSE STUDIO</p>
          <div className="flex space-x-3 md:space-x-4">
            <Link href="/privacy" className="hover:text-white transition-colors">
              PRIVACY
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              TERMS
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
