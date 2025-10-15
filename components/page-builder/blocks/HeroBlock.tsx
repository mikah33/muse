import Image from 'next/image'
import Link from 'next/link'
import type { PageBlock, HeroBlockProps } from '@/types/page-builder'

interface HeroBlockComponentProps {
  block: PageBlock
}

export default function HeroBlock({ block }: HeroBlockComponentProps) {
  const props = block.props as HeroBlockProps

  const heightClasses = {
    small: 'min-h-[50vh]',
    medium: 'min-h-[70vh]',
    large: 'min-h-[85vh]',
    full: 'min-h-screen',
  }

  const overlayClasses = {
    none: '',
    light: 'bg-white/30',
    dark: 'bg-black/40',
    gradient: 'bg-gradient-to-b from-black/20 via-transparent to-black/40',
  }

  const height = props.height || 'full'
  const overlay = props.overlay || 'gradient'
  const textColor = props.textColor || 'text-white'

  return (
    <section
      className={`relative w-full overflow-hidden ${heightClasses[height]} ${block.background_color || ''}`}
      style={block.background_color?.startsWith('#') ? { backgroundColor: block.background_color } : undefined}
    >
      {/* Background image with Ken Burns effect */}
      {props.backgroundImage && (
        <div className="absolute inset-0 scale-110 animate-ken-burns">
          <Image
            src={props.backgroundImage}
            alt={props.title}
            fill
            className="object-cover"
            priority
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
          />
        </div>
      )}

      {/* Gradient overlay */}
      <div className={`absolute inset-0 ${overlayClasses[overlay]}`} />

      {/* Content */}
      <div className={`relative ${heightClasses[height]} flex items-center justify-center py-24 md:py-32`}>
        <div className={`text-center max-w-4xl px-6 ${block.alignment === 'center' ? 'text-center' : block.alignment === 'right' ? 'text-right' : 'text-left'}`}>
          <h1 className={`font-serif text-4xl sm:text-5xl md:text-7xl lg:text-8xl leading-tight md:leading-none tracking-tight mb-6 animate-fade-in-up ${textColor}`}>
            {props.title}
            {props.subtitle && (
              <span className="block italic font-light mt-2">{props.subtitle}</span>
            )}
          </h1>

          {(props.ctaText || props.secondaryCtaText) && (
            <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center mt-8 animate-fade-in-up animation-delay-200">
              {props.ctaText && props.ctaLink && (
                <Link
                  href={props.ctaLink}
                  className="px-6 md:px-8 py-3 md:py-4 bg-white text-black tracking-widest uppercase text-xs md:text-sm hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
                >
                  {props.ctaText}
                </Link>
              )}
              {props.secondaryCtaText && props.secondaryCtaLink && (
                <Link
                  href={props.secondaryCtaLink}
                  className="px-6 md:px-8 py-3 md:py-4 border-2 border-white text-white tracking-widest uppercase text-xs md:text-sm hover:bg-white hover:text-black transition-all duration-300 transform hover:scale-105"
                >
                  {props.secondaryCtaText}
                </Link>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Scroll indicator - hide on mobile */}
      {height === 'full' && (
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
      )}
    </section>
  )
}
