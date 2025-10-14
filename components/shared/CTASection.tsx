'use client'

import Link from 'next/link'
import { useState } from 'react'
import ContactModal from './ContactModal'

interface CTASectionProps {
  variant?: 'default' | 'dark' | 'gradient'
  location?: string
}

export default function CTASection({ variant = 'default', location }: CTASectionProps) {
  const [modalOpen, setModalOpen] = useState(false)

  const locationText = location ? ` in ${location}` : ''

  const variants = {
    default: {
      bgClass: 'bg-white',
      textClass: 'text-black',
      accentClass: 'text-gray-600',
      buttonPrimary: 'bg-black text-white hover:bg-gray-800',
      buttonSecondary: 'border-2 border-black text-black hover:bg-black hover:text-white'
    },
    dark: {
      bgClass: 'bg-pure-black',
      textClass: 'text-pure-white',
      accentClass: 'text-gray-400',
      buttonPrimary: 'bg-white text-black hover:bg-gray-100',
      buttonSecondary: 'border-2 border-white text-white hover:bg-white hover:text-black'
    },
    gradient: {
      bgClass: 'bg-pure-black',
      textClass: 'text-pure-white',
      accentClass: 'text-gray-400',
      buttonPrimary: 'bg-white text-black hover:bg-gray-100',
      buttonSecondary: 'border-2 border-white text-white hover:bg-white hover:text-black'
    }
  }

  const style = variants[variant]

  return (
    <>
      <section className={`py-20 lg:py-32 ${style.bgClass}`}>
        <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center">
          <h2 className={`font-serif text-4xl lg:text-5xl mb-6 ${style.textClass}`}>
            Ready to Elevate Your
            <span className="block italic font-light mt-2">Portfolio?</span>
          </h2>
          <p className={`text-lg lg:text-xl mb-12 tracking-wide font-light ${style.accentClass}`}>
            Book your professional photography session{locationText} and take the first step toward capturing your best self.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button
              onClick={() => setModalOpen(true)}
              className={`px-12 py-4 tracking-widest uppercase text-sm transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${style.buttonPrimary}`}
            >
              Contact Us
            </button>
            <Link
              href="/services"
              className={`px-12 py-4 tracking-widest uppercase text-sm transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${style.buttonSecondary}`}
            >
              View Services
            </Link>
          </div>
        </div>
      </section>

      <ContactModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  )
}
