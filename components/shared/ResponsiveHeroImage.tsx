'use client'

import { ProcessedImages } from '@/lib/image-processing/types'

interface ResponsiveHeroImageProps {
  heroData: ProcessedImages | { url: string } | string
  alt: string
  className?: string
  priority?: boolean
}

export default function ResponsiveHeroImage({
  heroData,
  alt,
  className = '',
  priority = true
}: ResponsiveHeroImageProps) {
  // Handle legacy format (single URL string)
  if (typeof heroData === 'string') {
    return (
      <img
        src={heroData}
        alt={alt}
        className={className}
        loading={priority ? 'eager' : 'lazy'}
      />
    )
  }

  // Handle old format (object with url property)
  if ('url' in heroData && !('variants' in heroData)) {
    return (
      <img
        src={heroData.url}
        alt={alt}
        className={className}
        loading={priority ? 'eager' : 'lazy'}
      />
    )
  }

  // Handle new format with responsive variants
  const { variants } = heroData as ProcessedImages

  return (
    <picture>
      {/* Mobile Portrait (< 768px) */}
      <source
        media="(max-width: 767px)"
        srcSet={variants.mobile.avif.url}
        type="image/avif"
      />
      <source
        media="(max-width: 767px)"
        srcSet={variants.mobile.webp.url}
        type="image/webp"
      />
      <source
        media="(max-width: 767px)"
        srcSet={variants.mobile.jpg.url}
        type="image/jpeg"
      />

      {/* Tablet (768px - 1024px) */}
      <source
        media="(min-width: 768px) and (max-width: 1023px)"
        srcSet={variants.tablet.avif.url}
        type="image/avif"
      />
      <source
        media="(min-width: 768px) and (max-width: 1023px)"
        srcSet={variants.tablet.webp.url}
        type="image/webp"
      />
      <source
        media="(min-width: 768px) and (max-width: 1023px)"
        srcSet={variants.tablet.jpg.url}
        type="image/jpeg"
      />

      {/* Desktop (≥ 1024px) */}
      <source
        media="(min-width: 1024px)"
        srcSet={variants.desktop.avif.url}
        type="image/avif"
      />
      <source
        media="(min-width: 1024px)"
        srcSet={variants.desktop.webp.url}
        type="image/webp"
      />
      <source
        media="(min-width: 1024px)"
        srcSet={variants.desktop.jpg.url}
        type="image/jpeg"
      />

      {/* Fallback for older browsers */}
      <img
        src={variants.desktop.jpg.url}
        alt={alt}
        className={className}
        loading={priority ? 'eager' : 'lazy'}
        // @ts-ignore - fetchpriority is valid but TypeScript doesn't recognize it yet
        fetchpriority={priority ? 'high' : 'auto'}
      />
    </picture>
  )
}
