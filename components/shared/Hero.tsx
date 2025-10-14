'use client'

import Link from 'next/link'
import Image from 'next/image'
import ContactModal from './ContactModal'
import { useState, useEffect } from 'react'

interface HeroProps {
  title?: string
  subtitle?: string
  showButtons?: boolean
}

export default function Hero({
  title = "Professional Photography",
  subtitle = "Headshots & Portfolios",
  showButtons = true
}: HeroProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const [heroImage, setHeroImage] = useState('/images/hero-image.jpg')

  useEffect(() => {
    // Fetch current hero image from settings
    fetch('/api/settings/hero-image')
      .then(res => res.json())
      .then(data => {
        if (data.url) {
          setHeroImage(data.url)
        }
      })
      .catch(err => console.error('Failed to load hero image:', err))
  }, [])

  return (
    <section className="relative min-h-screen w-full overflow-hidden">
      {/* Background image with Ken Burns effect */}
      <div className="absolute inset-0 scale-110 animate-ken-burns">
        <Image
          src={heroImage}
          alt="Professional photography headshots studio creative artistic modeling portfolio"
          fill
          className="object-cover"
          priority
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
        />
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />

      {/* Content */}
      <div className="relative min-h-screen flex items-center justify-center py-24 md:py-32">
        <div className="text-center text-white max-w-4xl px-6">
          <h1 className="font-serif text-4xl sm:text-5xl md:text-7xl lg:text-8xl leading-tight md:leading-none tracking-tight mb-6 animate-fade-in-up">
            {title}
            <span className="block italic font-light mt-2">{subtitle}</span>
          </h1>
          <p className="text-base md:text-xl tracking-wider mb-4 animate-fade-in-up animation-delay-200 font-light">
            EXPERT MODELING PORTFOLIOS, ACTOR HEADSHOTS & CREATIVE PORTRAITS
          </p>
          <p className="text-sm md:text-lg tracking-wide mb-8 md:mb-12 animate-fade-in-up animation-delay-300 font-light max-w-3xl mx-auto opacity-90">
            Premium studio photography services for models, actors, and professionals seeking exceptional headshots and portfolio imagery
          </p>
          {showButtons && (
            <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center animate-fade-in-up animation-delay-400">
              <button
                onClick={() => setModalOpen(true)}
                className="px-6 md:px-8 py-3 md:py-4 bg-white text-black tracking-widest uppercase text-xs md:text-sm hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
              >
                Book Photography Session
              </button>
              <Link
                href="/portfolio"
                className="px-6 md:px-8 py-3 md:py-4 border-2 border-white text-white tracking-widest uppercase text-xs md:text-sm hover:bg-white hover:text-black transition-all duration-300 transform hover:scale-105"
              >
                View Professional Portfolio
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Scroll indicator - hide on mobile */}
      <div className="hidden md:block absolute bottom-8 left-1/2 -translate-x-1/2 text-white animate-bounce">
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </div>

      <ContactModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </section>
  )
}
