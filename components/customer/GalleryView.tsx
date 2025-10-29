'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import type { Gallery, Photo, User } from '@/types/database'
import GalleryGrid from './GalleryGrid'
import PhotoLightbox from './PhotoLightbox'

interface PhotoWithReactions extends Photo {
  is_favorited: boolean
  is_disliked: boolean
}

interface GalleryViewProps {
  gallery: Gallery
  photos: PhotoWithReactions[]
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
  const [selectedPhotos, setSelectedPhotos] = useState<Set<string>>(new Set())
  const [isSelectionMode, setIsSelectionMode] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)

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

  const handleDislikeToggle = (photoId: string, isDisliked: boolean) => {
    setPhotosState((prev) =>
      prev.map((photo) =>
        photo.id === photoId ? { ...photo, is_disliked: isDisliked } : photo
      )
    )
  }

  const togglePhotoSelection = (photoId: string) => {
    setSelectedPhotos((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(photoId)) {
        newSet.delete(photoId)
      } else {
        newSet.add(photoId)
      }
      return newSet
    })
  }

  const selectAll = () => {
    setSelectedPhotos(new Set(photosState.map(p => p.id)))
  }

  const deselectAll = () => {
    setSelectedPhotos(new Set())
  }

  const downloadSelected = async () => {
    if (selectedPhotos.size === 0) return

    setIsDownloading(true)
    try {
      const selectedPhotoObjects = photosState.filter(p => selectedPhotos.has(p.id))

      if (selectedPhotoObjects.length === 1) {
        // Single download
        const photo = selectedPhotoObjects[0]
        const link = document.createElement('a')
        link.href = photo.full_res_url
        link.download = `${gallery.gallery_name}-${photo.id}.jpg`
        link.click()
      } else {
        // Multiple downloads using JSZip
        const JSZip = (await import('jszip')).default
        const zip = new JSZip()

        for (const photo of selectedPhotoObjects) {
          try {
            const response = await fetch(photo.full_res_url)
            const blob = await response.blob()
            zip.file(`${photo.id}.jpg`, blob)
          } catch (err) {
            console.error(`Failed to download ${photo.id}:`, err)
          }
        }

        const content = await zip.generateAsync({ type: 'blob' })
        const link = document.createElement('a')
        link.href = URL.createObjectURL(content)
        link.download = `${gallery.gallery_name}-${selectedPhotos.size}-photos.zip`
        link.click()
        URL.revokeObjectURL(link.href)
      }

      setIsDownloading(false)
      setIsSelectionMode(false)
      setSelectedPhotos(new Set())
    } catch (err) {
      console.error('Download failed:', err)
      alert('Failed to download photos. Please try again.')
      setIsDownloading(false)
    }
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
          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center space-x-8 text-sm text-gray-600">
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

            {/* Selection Mode Toggle */}
            <div className="flex items-center space-x-3">
              {!isSelectionMode ? (
                <button
                  onClick={() => setIsSelectionMode(true)}
                  className="px-4 py-2 bg-black text-white text-sm tracking-wider hover:bg-gray-800 transition-colors"
                >
                  SELECT PHOTOS
                </button>
              ) : (
                <>
                  <button
                    onClick={selectAll}
                    className="px-4 py-2 border border-gray-300 text-sm tracking-wider hover:bg-gray-50 transition-colors"
                  >
                    SELECT ALL
                  </button>
                  <button
                    onClick={deselectAll}
                    className="px-4 py-2 border border-gray-300 text-sm tracking-wider hover:bg-gray-50 transition-colors"
                  >
                    DESELECT ALL
                  </button>
                  <button
                    onClick={downloadSelected}
                    disabled={selectedPhotos.size === 0 || isDownloading}
                    className="px-4 py-2 bg-black text-white text-sm tracking-wider hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {isDownloading ? 'DOWNLOADING...' : `DOWNLOAD ${selectedPhotos.size > 0 ? `(${selectedPhotos.size})` : ''}`}
                  </button>
                  <button
                    onClick={() => {
                      setIsSelectionMode(false)
                      setSelectedPhotos(new Set())
                    }}
                    className="px-4 py-2 text-sm tracking-wider text-gray-600 hover:text-black transition-colors"
                  >
                    CANCEL
                  </button>
                </>
              )}
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
            onDislikeToggle={handleDislikeToggle}
            isSelectionMode={isSelectionMode}
            selectedPhotos={selectedPhotos}
            onPhotoSelect={togglePhotoSelection}
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
          onDislikeToggle={handleDislikeToggle}
        />
      )}
    </div>
  )
}
