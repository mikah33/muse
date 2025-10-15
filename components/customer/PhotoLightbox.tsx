'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import type { Photo } from '@/types/database'
import FavoriteButton from './FavoriteButton'
import DislikeButton from './DislikeButton'

interface PhotoWithReactions extends Photo {
  is_favorited: boolean
  is_disliked: boolean
}

interface PhotoLightboxProps {
  photos: PhotoWithReactions[]
  currentIndex: number
  onClose: () => void
  onIndexChange: (index: number) => void
  onFavoriteToggle: (photoId: string, isFavorited: boolean) => void
  onDislikeToggle: (photoId: string, isDisliked: boolean) => void
}

export default function PhotoLightbox({
  photos,
  currentIndex,
  onClose,
  onIndexChange,
  onFavoriteToggle,
  onDislikeToggle,
}: PhotoLightboxProps) {
  const currentPhoto = photos[currentIndex]
  const hasPrevious = currentIndex > 0
  const hasNext = currentIndex < photos.length - 1

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      } else if (e.key === 'ArrowLeft' && hasPrevious) {
        onIndexChange(currentIndex - 1)
      } else if (e.key === 'ArrowRight' && hasNext) {
        onIndexChange(currentIndex + 1)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentIndex, hasPrevious, hasNext, onClose, onIndexChange])

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  const handleDownload = async () => {
    try {
      const response = await fetch(currentPhoto.photo_url)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = currentPhoto.title || `photo-${currentIndex + 1}.jpg`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error downloading photo:', error)
      // Fallback: open in new tab if fetch fails
      window.open(currentPhoto.photo_url, '_blank')
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-20 p-2 text-white hover:bg-white/10 rounded-full transition-colors"
        aria-label="Close lightbox"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Navigation Buttons */}
      {hasPrevious && (
        <button
          onClick={() => onIndexChange(currentIndex - 1)}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 text-white hover:bg-white/10 rounded-full transition-colors"
          aria-label="Previous photo"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>
      )}

      {hasNext && (
        <button
          onClick={() => onIndexChange(currentIndex + 1)}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 text-white hover:bg-white/10 rounded-full transition-colors"
          aria-label="Next photo"
        >
          <ChevronRight className="w-8 h-8" />
        </button>
      )}

      {/* Main Image Container */}
      <div
        className="absolute inset-0 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div
          className="relative max-w-7xl max-h-full w-full h-full"
          onClick={(e) => e.stopPropagation()}
        >
          <Image
            src={currentPhoto.photo_url}
            alt={currentPhoto.title || `Photo ${currentIndex + 1}`}
            fill
            className="object-contain"
            priority
            sizes="100vw"
          />
        </div>
      </div>

      {/* Bottom Controls Bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Photo Info */}
          <div className="text-white">
            <h3 className="text-lg font-medium mb-1">
              {currentPhoto.title || `Photo ${currentIndex + 1}`}
            </h3>
            {currentPhoto.description && (
              <p className="text-sm text-gray-300">{currentPhoto.description}</p>
            )}
            <p className="text-xs text-gray-400 mt-2">
              {currentIndex + 1} of {photos.length}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            {/* Download Button - Chrome Style */}
            <button
              onClick={handleDownload}
              className="p-3 bg-white/10 backdrop-blur-sm rounded hover:bg-white/20 transition-colors group"
              aria-label="Download photo"
              title="Download"
            >
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v12m0 0l-4-4m4 4l4-4M4 20h16"
                />
              </svg>
            </button>

            {/* Favorite Button */}
            <FavoriteButton
              photoId={currentPhoto.id}
              isFavorited={currentPhoto.is_favorited}
              onToggle={onFavoriteToggle}
              size="lg"
            />

            {/* Dislike Button */}
            <DislikeButton
              photoId={currentPhoto.id}
              isDisliked={currentPhoto.is_disliked}
              onToggle={onDislikeToggle}
              size="lg"
            />
          </div>
        </div>
      </div>

      {/* Thumbnail Strip (optional - for future enhancement) */}
      {/* You could add a thumbnail strip here showing all photos in the gallery */}
    </div>
  )
}
