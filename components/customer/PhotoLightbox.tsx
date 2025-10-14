'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight, Download } from 'lucide-react'
import type { Photo } from '@/types/database'
import FavoriteButton from './FavoriteButton'

interface PhotoWithFavorite extends Photo {
  is_favorited: boolean
}

interface PhotoLightboxProps {
  photos: PhotoWithFavorite[]
  currentIndex: number
  onClose: () => void
  onIndexChange: (index: number) => void
  onFavoriteToggle: (photoId: string, isFavorited: boolean) => void
}

export default function PhotoLightbox({
  photos,
  currentIndex,
  onClose,
  onIndexChange,
  onFavoriteToggle,
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

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = currentPhoto.photo_url
    link.download = currentPhoto.title || `photo-${currentIndex + 1}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
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
            <FavoriteButton
              photoId={currentPhoto.id}
              isFavorited={currentPhoto.is_favorited}
              onToggle={onFavoriteToggle}
              size="lg"
            />
            <button
              onClick={handleDownload}
              className="p-2.5 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white hover:scale-110 transition-all duration-200 shadow-lg"
              aria-label="Download photo"
            >
              <Download className="w-6 h-6 text-gray-700" />
            </button>
          </div>
        </div>
      </div>

      {/* Thumbnail Strip (optional - for future enhancement) */}
      {/* You could add a thumbnail strip here showing all photos in the gallery */}
    </div>
  )
}
