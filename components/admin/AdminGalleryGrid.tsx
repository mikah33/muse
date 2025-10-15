'use client'

import { useState } from 'react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'
import type { Photo } from '@/types/database'

interface AdminGalleryGridProps {
  photos: Photo[]
  galleryId: string
}

export default function AdminGalleryGrid({ photos: initialPhotos, galleryId }: AdminGalleryGridProps) {
  const router = useRouter()
  const supabase = createClient()
  const [photos, setPhotos] = useState(initialPhotos)
  const [deleting, setDeleting] = useState<string | null>(null)

  const handleDelete = async (photoId: string) => {
    if (!confirm('Are you sure you want to delete this photo?')) return

    setDeleting(photoId)
    try {
      const { error } = await supabase
        .from('photos')
        .delete()
        .eq('id', photoId)

      if (error) throw error

      setPhotos(prev => prev.filter(p => p.id !== photoId))
      router.refresh()
    } catch (err: any) {
      console.error('Error deleting photo:', err)
      alert('Failed to delete photo: ' + err.message)
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {photos.map((photo) => (
        <div
          key={photo.id}
          className="group relative aspect-square bg-gray-200 overflow-hidden"
        >
          <Image
            src={photo.thumbnail_url}
            alt={photo.title || 'Photo'}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />

          {/* Hover Overlay with Delete Button */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors duration-300 flex items-center justify-center">
            <button
              onClick={() => handleDelete(photo.id)}
              disabled={deleting === photo.id}
              className="opacity-0 group-hover:opacity-100 transition-opacity bg-red-600 text-white p-3 rounded-full hover:bg-red-700 disabled:bg-gray-400"
              aria-label="Delete photo"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>

          {/* Photo info */}
          {photo.title && (
            <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              <p className="text-white text-xs font-medium truncate">{photo.title}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
