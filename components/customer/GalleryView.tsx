'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import type { Gallery, Photo, User } from '@/types/database'
import GalleryGrid from './GalleryGrid'
import PhotoLightbox from './PhotoLightbox'

interface PhotoWithFavorite extends Photo {
  is_favorited: boolean
}

interface GalleryViewProps {
  gallery: Gallery
  photos: PhotoWithFavorite[]
  user: User
}

export default function GalleryView({
  gallery,
  photos,
  user,
}: GalleryViewProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)
  const [photosState, setPhotosState] = useState(photos)

  const handlePhotoClick = (index: number) => {
    setCurrentPhotoIndex(index)
    setLightboxOpen(true)
  }

  const handleFavoriteToggle = (photoId: string, isFavorited: boolean) => {
    setPhotosState((prev) =>
      prev.map((photo) =>
        photo.id === photoId ? { ...photo, is_favorited: isFavorited } : photo
      )
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link
              href="/portal"
              className="flex items-center space-x-2 text-gray-600 hover:text-black transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm tracking-wider">BACK TO GALLERIES</span>
            </Link>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">{user.full_name}</span>
              <Link
                href="/portal"
                className="px-4 py-2 text-sm border border-gray-300 hover:bg-gray-50 transition-colors"
              >
                Portal
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Gallery Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl md:text-5xl font-serif mb-4">
            {gallery.gallery_name}
          </h1>
          {gallery.description && (
            <p className="text-lg text-gray-600 mb-4">{gallery.description}</p>
          )}
          {gallery.shoot_date && (
            <p className="text-sm text-gray-500">
              {new Date(gallery.shoot_date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          )}
          <div className="mt-6 flex items-center space-x-8 text-sm text-gray-600">
            <div>
              <span className="font-medium">{photosState.length}</span> photos
            </div>
            <div>
              <span className="font-medium">
                {photosState.filter((p) => p.is_favorited).length}
              </span>{' '}
              favorited
            </div>
          </div>
        </div>
      </div>

      {/* Photos Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {photosState.length === 0 ? (
          <div className="text-center py-20">
            <h2 className="text-2xl font-serif mb-4">No Photos Yet</h2>
            <p className="text-gray-600">
              Photos will be uploaded to this gallery soon.
            </p>
          </div>
        ) : (
          <GalleryGrid
            photos={photosState}
            onPhotoClick={handlePhotoClick}
            onFavoriteToggle={handleFavoriteToggle}
          />
        )}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <PhotoLightbox
          photos={photosState}
          currentIndex={currentPhotoIndex}
          onClose={() => setLightboxOpen(false)}
          onIndexChange={setCurrentPhotoIndex}
          onFavoriteToggle={handleFavoriteToggle}
        />
      )}
    </div>
  )
}
