'use client'

import Link from 'next/link'
import ContactModal from './ContactModal'
import ResponsiveHeroImage from './ResponsiveHeroImage'
import { useState, useEffect } from 'react'
import type { ProcessedImages } from '@/lib/image-processing/types'

interface HeroProps {
  title?: string
  subtitle?: string
  showButtons?: boolean
}

export default function Hero({
  title: propTitle,
  subtitle: propSubtitle,
  showButtons = true
}: HeroProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const [heroData, setHeroData] = useState<ProcessedImages | { url: string } | string>('/images/hero-backup.jpg')
  const [isLoading, setIsLoading] = useState(false) // Start with false to show placeholder immediately
  const [content, setContent] = useState({
    title: propTitle || "Professional Photography",
    subtitle: propSubtitle || "Headshots & Portfolios",
    tagline: "EXPERT MODELING PORTFOLIOS, ACTOR HEADSHOTS & CREATIVE PORTRAITS",
    description: "Premium studio photography services for models, actors, and professionals seeking exceptional headshots and portfolio imagery",
    primaryButton: "Book Photography Session",
    secondaryButton: "View Professional Portfolio"
  })

  useEffect(() => {
    // Load hero image and content in parallel
    const imagePromise = fetch('/api/settings/hero-image')
      .then(res => res.json())
      .then(imageData => {
        if (imageData.url) {
          try {
            const parsed = typeof imageData.url === 'string' ? JSON.parse(imageData.url) : imageData.url
            setHeroData(parsed)
          } catch {
            setHeroData(imageData.url)
          }
        }
      })

    const contentPromise = fetch('/api/admin/homepage')
      .then(res => res.json())
      .then(homepageData => {
        if (homepageData.hero) {
          setContent(homepageData.hero)
        }
      })

    // Don't wait for both, load independently
    Promise.allSettled([imagePromise, contentPromise]).catch(err => {
      console.error('Failed to load hero data:', err)
    })
  }, [])

  return (
    <section className="relative min-h-screen w-full overflow-hidden">
      {/* Background image with Ken Burns effect */}
      <div className="absolute inset-0 scale-110 animate-ken-burns bg-gray-900">
        <ResponsiveHeroImage
          heroData={heroData}
          alt="Professional photography headshots studio creative artistic modeling portfolio"
          className="absolute inset-0 w-full h-full object-cover object-center"
          priority={true}
        />
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />

      {/* Content */}
      <div className="relative min-h-screen flex items-center justify-center py-24 md:py-32">
        <div className="text-center text-white max-w-4xl px-6">
          <h1 className="font-serif text-4xl sm:text-5xl md:text-7xl lg:text-8xl leading-tight md:leading-none tracking-tight mb-6 animate-fade-in-up">
            {content.title}
            <span className="block italic font-light mt-2">{content.subtitle}</span>
          </h1>
          <p className="text-base md:text-xl tracking-wider mb-4 animate-fade-in-up animation-delay-200 font-light">
            {content.tagline}
          </p>
          <p className="text-sm md:text-lg tracking-wide mb-8 md:mb-12 animate-fade-in-up animation-delay-300 font-light max-w-3xl mx-auto opacity-90">
            {content.description}
          </p>
          {showButtons && (
            <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center animate-fade-in-up animation-delay-400">
              <button
                onClick={() => setModalOpen(true)}
                className="px-6 md:px-8 py-3 md:py-4 bg-white text-black tracking-widest uppercase text-xs md:text-sm hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
              >
                {content.primaryButton}
              </button>
              <Link
                href="/portfolio"
                className="px-6 md:px-8 py-3 md:py-4 border-2 border-white text-white tracking-widest uppercase text-xs md:text-sm hover:bg-white hover:text-black transition-all duration-300 transform hover:scale-105"
              >
                {content.secondaryButton}
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
