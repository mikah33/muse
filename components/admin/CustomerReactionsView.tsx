'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Heart, ThumbsDown, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface Photo {
  id: string
  photo_url: string
  thumbnail_url: string
  title: string | null
  description: string | null
  gallery_id: string
}

interface PhotoWithGallery extends Photo {
  galleries: {
    gallery_name: string
  }
  reaction_date: string
}

interface CustomerReactionsViewProps {
  customerId: string
  initialFavorites?: PhotoWithGallery[]
  initialDislikes?: PhotoWithGallery[]
}

export default function CustomerReactionsView({
  customerId,
  initialFavorites = [],
  initialDislikes = []
}: CustomerReactionsViewProps) {
  const [activeTab, setActiveTab] = useState<'favorites' | 'dislikes'>('favorites')
  const [favorites, setFavorites] = useState<PhotoWithGallery[]>(initialFavorites)
  const [dislikes, setDislikes] = useState<PhotoWithGallery[]>(initialDislikes)
  const [loading, setLoading] = useState(false)
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoWithGallery | null>(null)
  const supabase = createClient()

  useEffect(() => {
    // Only fetch if no initial data provided
    if (initialFavorites.length === 0 && initialDislikes.length === 0) {
      fetchReactions()
    }
  }, [customerId])

  const fetchReactions = async () => {
    setLoading(true)
    try {
      // Fetch favorites with photo details (favorites table doesn't have created_at)
      const { data: favoritesData, error: favError } = await supabase
        .from('favorites')
        .select('photo_id')
        .eq('customer_id', customerId)

      console.log('Favorites data:', favoritesData)
      console.log('Favorites error details:', JSON.stringify(favError, null, 2))

      // Fetch dislikes with photo details
      const { data: dislikesData, error: disError } = await supabase
        .from('dislikes')
        .select('created_at, photo_id')
        .eq('customer_id', customerId)
        .order('created_at', { ascending: false })

      console.log('Dislikes data:', dislikesData, 'Error:', disError)

      // Get all photo IDs
      const favoritePhotoIds = favoritesData?.map(f => f.photo_id) || []
      const dislikePhotoIds = dislikesData?.map(d => d.photo_id) || []

      // Fetch photo details for favorites
      let formattedFavorites: PhotoWithGallery[] = []
      if (favoritePhotoIds.length > 0) {
        const { data: favoritePhotos } = await supabase
          .from('photos')
          .select('id, photo_url, thumbnail_url, title, description, gallery_id, galleries(gallery_name)')
          .in('id', favoritePhotoIds)

        formattedFavorites = (favoritePhotos || []).map((photo: any) => ({
          ...photo,
          galleries: photo.galleries,
          reaction_date: new Date().toISOString(), // Favorites table doesn't have timestamp
        }))
      }

      // Fetch photo details for dislikes
      let formattedDislikes: PhotoWithGallery[] = []
      if (dislikePhotoIds.length > 0) {
        const { data: dislikePhotos } = await supabase
          .from('photos')
          .select('id, photo_url, thumbnail_url, title, description, gallery_id, galleries(gallery_name)')
          .in('id', dislikePhotoIds)

        formattedDislikes = (dislikePhotos || []).map((photo: any) => ({
          ...photo,
          galleries: photo.galleries,
          reaction_date: dislikesData?.find(d => d.photo_id === photo.id)?.created_at || '',
        }))
      }

      console.log('Formatted favorites:', formattedFavorites)
      console.log('Formatted dislikes:', formattedDislikes)

      setFavorites(formattedFavorites)
      setDislikes(formattedDislikes)
    } catch (error) {
      console.error('Error fetching reactions:', error)
    } finally {
      setLoading(false)
    }
  }

  const currentPhotos = activeTab === 'favorites' ? favorites : dislikes

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex">
          <button
            onClick={() => setActiveTab('favorites')}
            className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
              activeTab === 'favorites'
                ? 'border-b-2 border-black text-black'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Heart className="w-4 h-4" />
              <span>Favorites</span>
              <span className="px-2 py-0.5 bg-gray-100 rounded-full text-xs">
                {favorites.length}
              </span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('dislikes')}
            className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
              activeTab === 'dislikes'
                ? 'border-b-2 border-black text-black'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <ThumbsDown className="w-4 h-4" />
              <span>Dislikes</span>
              <span className="px-2 py-0.5 bg-gray-100 rounded-full text-xs">
                {dislikes.length}
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
          </div>
        ) : currentPhotos.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-2">
              {activeTab === 'favorites' ? (
                <Heart className="w-12 h-12 mx-auto" />
              ) : (
                <ThumbsDown className="w-12 h-12 mx-auto" />
              )}
            </div>
            <p className="text-gray-500">
              No {activeTab} yet
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {currentPhotos.map((photo) => (
              <div
                key={photo.id}
                className="group relative aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setSelectedPhoto(photo)}
              >
                <Image
                  src={photo.thumbnail_url}
                  alt={photo.title || 'Photo'}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                    <p className="text-xs font-medium truncate">
                      {photo.title || 'Untitled'}
                    </p>
                    <p className="text-xs text-gray-300 truncate">
                      {photo.galleries.gallery_name}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(photo.reaction_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                {/* Reaction Indicator */}
                <div className="absolute top-2 right-2">
                  <div className="bg-white/90 backdrop-blur-sm rounded-full p-1.5">
                    {activeTab === 'favorites' ? (
                      <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                    ) : (
                      <ThumbsDown className="w-4 h-4 fill-red-500 text-red-500" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Photo Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300"
            >
              <X className="w-6 h-6" />
            </button>
            <Image
              src={selectedPhoto.photo_url}
              alt={selectedPhoto.title || 'Photo'}
              width={1200}
              height={800}
              className="max-w-full max-h-[80vh] object-contain"
            />
            <div className="mt-4 text-white text-center">
              <p className="font-medium">{selectedPhoto.title || 'Untitled'}</p>
              <p className="text-sm text-gray-300">{selectedPhoto.galleries.gallery_name}</p>
              <p className="text-xs text-gray-400 mt-1">
                {activeTab === 'favorites' ? 'Favorited' : 'Disliked'} on{' '}
                {new Date(selectedPhoto.reaction_date).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
