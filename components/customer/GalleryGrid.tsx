'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Heart } from 'lucide-react'
import type { Photo } from '@/types/database'
import FavoriteButton from './FavoriteButton'
import DislikeButton from './DislikeButton'

interface PhotoWithReactions extends Photo {
  is_favorited: boolean
  is_disliked: boolean
}

interface GalleryGridProps {
  photos: PhotoWithReactions[]
  onPhotoClick: (index: number) => void
  onFavoriteToggle: (photoId: string, isFavorited: boolean) => void
  onDislikeToggle: (photoId: string, isDisliked: boolean) => void
  isSelectionMode?: boolean
  selectedPhotos?: Set<string>
  onPhotoSelect?: (photoId: string) => void
}

export default function GalleryGrid({
  photos,
  onPhotoClick,
  onFavoriteToggle,
  onDislikeToggle,
  isSelectionMode = false,
  selectedPhotos = new Set(),
  onPhotoSelect,
}: GalleryGridProps) {
  const handleDownload = async (e: React.MouseEvent, photo: Photo, index: number) => {
    e.stopPropagation() // Prevent opening lightbox

    try {
      const response = await fetch(photo.photo_url)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = photo.title || `photo-${index + 1}.jpg`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error downloading photo:', error)
      // Fallback: open in new tab if fetch fails
      window.open(photo.photo_url, '_blank')
    }
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {photos.map((photo, index) => {
        const isSelected = selectedPhotos.has(photo.id)
        return (
        <div
          key={photo.id}
          className={`group relative aspect-square bg-gray-200 overflow-hidden cursor-pointer ${isSelected ? 'ring-4 ring-black' : ''}`}
          onClick={() => isSelectionMode && onPhotoSelect ? onPhotoSelect(photo.id) : onPhotoClick(index)}
        >
          {/* Selection Checkbox */}
          {isSelectionMode && (
            <div className="absolute top-3 left-3 z-20">
              <div className={`w-6 h-6 rounded border-2 flex items-center justify-center ${isSelected ? 'bg-black border-black' : 'bg-white/90 border-gray-300'}`}>
                {isSelected && (
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </div>
          )}

          {/* Photo Image */}
          <Image
            src={photo.thumbnail_url}
            alt={photo.title || `Photo ${index + 1}`}
            fill
            className={`object-cover group-hover:scale-105 transition-transform duration-300 ${isSelected ? 'opacity-80' : ''}`}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300" />

          {/* Action Buttons - Top right (hide in selection mode) */}
          {!isSelectionMode && (
            <div className="absolute top-3 right-3 z-10 flex gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
              {/* Download Button */}
              <button
                onClick={(e) => handleDownload(e, photo, index)}
                className="p-2 bg-white/90 backdrop-blur-sm rounded hover:bg-white transition-colors shadow-lg"
                aria-label="Download photo"
                title="Download"
              >
                <svg
                  className="w-5 h-5 text-gray-700"
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
                photoId={photo.id}
                isFavorited={photo.is_favorited}
                onToggle={onFavoriteToggle}
              />

              {/* Dislike Button */}
              <DislikeButton
                photoId={photo.id}
                isDisliked={photo.is_disliked}
                onToggle={onDislikeToggle}
              />
            </div>
          )}

          {/* Photo Title - Shows on hover */}
          {photo.title && (
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              <p className="text-white text-sm font-medium">{photo.title}</p>
            </div>
          )}

          {/* Favorite Indicator */}
          {!isSelectionMode && photo.is_favorited && (
            <div className="absolute bottom-3 left-3">
              <div className="bg-white/90 backdrop-blur-sm rounded-full p-1.5">
                <Heart className="w-4 h-4 fill-red-500 text-red-500" />
              </div>
            </div>
          )}
        </div>
        )
      })}
    </div>
  )
}
