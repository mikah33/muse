'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Heart } from 'lucide-react'
import type { Photo } from '@/types/database'
import FavoriteButton from './FavoriteButton'

interface PhotoWithFavorite extends Photo {
  is_favorited: boolean
}

interface GalleryGridProps {
  photos: PhotoWithFavorite[]
  onPhotoClick: (index: number) => void
  onFavoriteToggle: (photoId: string, isFavorited: boolean) => void
}

export default function GalleryGrid({
  photos,
  onPhotoClick,
  onFavoriteToggle,
}: GalleryGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {photos.map((photo, index) => (
        <div
          key={photo.id}
          className="group relative aspect-square bg-gray-200 overflow-hidden cursor-pointer"
          onClick={() => onPhotoClick(index)}
        >
          {/* Photo Image */}
          <Image
            src={photo.thumbnail_url}
            alt={photo.title || `Photo ${index + 1}`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300" />

          {/* Favorite Button - Always visible on mobile, on hover for desktop */}
          <div className="absolute top-3 right-3 z-10 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
            <FavoriteButton
              photoId={photo.id}
              isFavorited={photo.is_favorited}
              onToggle={onFavoriteToggle}
            />
          </div>

          {/* Photo Title - Shows on hover */}
          {photo.title && (
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              <p className="text-white text-sm font-medium">{photo.title}</p>
            </div>
          )}

          {/* Favorite Indicator */}
          {photo.is_favorited && (
            <div className="absolute bottom-3 left-3">
              <div className="bg-white/90 backdrop-blur-sm rounded-full p-1.5">
                <Heart className="w-4 h-4 fill-red-500 text-red-500" />
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
