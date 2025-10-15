'use client'

import Link from 'next/link'
import { useState } from 'react'
import type { PageBlock, CTABlockProps } from '@/types/page-builder'

interface CTABlockComponentProps {
  block: PageBlock
}

export default function CTABlock({ block }: CTABlockComponentProps) {
  const props = block.props as CTABlockProps
  const [modalOpen, setModalOpen] = useState(false)

  const variants = {
    default: {
      bgClass: 'bg-white',
      textClass: 'text-black',
      accentClass: 'text-gray-600',
      buttonPrimary: 'bg-black text-white hover:bg-gray-800',
      buttonSecondary: 'border-2 border-black text-black hover:bg-black hover:text-white',
    },
    dark: {
      bgClass: 'bg-pure-black',
      textClass: 'text-pure-white',
      accentClass: 'text-gray-400',
      buttonPrimary: 'bg-white text-black hover:bg-gray-100',
      buttonSecondary: 'border-2 border-white text-white hover:bg-white hover:text-black',
    },
    gradient: {
      bgClass: 'bg-gradient-to-b from-gray-900 to-black',
      textClass: 'text-white',
      accentClass: 'text-gray-300',
      buttonPrimary: 'bg-white text-black hover:bg-gray-100',
      buttonSecondary: 'border-2 border-white text-white hover:bg-white hover:text-black',
    },
  }

  const variant = props.variant || 'default'
  const style = variants[variant]

  const handlePrimaryClick = (e: React.MouseEvent) => {
    if (props.ctaAction === 'modal') {
      e.preventDefault()
      setModalOpen(true)
    } else if (props.ctaAction === 'scroll' && props.ctaTarget) {
      e.preventDefault()
      const element = document.querySelector(props.ctaTarget)
      element?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const primaryButton = props.ctaAction === 'link' && props.ctaLink ? (
    <Link
      href={props.ctaLink}
      className={`px-12 py-4 tracking-widest uppercase text-sm transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${style.buttonPrimary}`}
    >
      {props.ctaText}
    </Link>
  ) : (
    <button
      onClick={handlePrimaryClick}
      className={`px-12 py-4 tracking-widest uppercase text-sm transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${style.buttonPrimary}`}
    >
      {props.ctaText}
    </button>
  )

  return (
    <section
      className={`py-20 lg:py-32 ${style.bgClass} ${block.background_color || ''}`}
      style={block.background_color?.startsWith('#') ? { backgroundColor: block.background_color } : undefined}
    >
      <div className={`max-w-4xl mx-auto px-6 lg:px-12 text-center ${block.alignment === 'center' ? 'text-center' : block.alignment === 'right' ? 'text-right' : 'text-left'}`}>
        <h2 className={`font-serif text-4xl lg:text-5xl mb-6 ${style.textClass}`}>
          {props.heading}
        </h2>
        {props.description && (
          <p className={`text-lg lg:text-xl mb-12 tracking-wide font-light ${style.accentClass}`}>
            {props.description}
          </p>
        )}
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          {primaryButton}
          {props.secondaryCtaText && props.secondaryCtaLink && (
            <Link
              href={props.secondaryCtaLink}
              className={`px-12 py-4 tracking-widest uppercase text-sm transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${style.buttonSecondary}`}
            >
              {props.secondaryCtaText}
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}
