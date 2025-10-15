'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { ThumbsDown } from 'lucide-react'

interface DislikeWithDetails {
  id: string
  photo_id: string
  disliked_at: string
  photo: {
    id: string
    photo_url: string
    thumbnail_url: string
    title: string | null
    description: string | null
    gallery_id: string | null
    gallery: {
      id: string
      gallery_name: string
    } | null
  }
}

interface CustomerDislikesViewProps {
  customerId: string
}

export default function CustomerDislikesView({ customerId }: CustomerDislikesViewProps) {
  const [dislikes, setDislikes] = useState<DislikeWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null)

  useEffect(() => {
    fetchDislikes()
  }, [customerId])

  const fetchDislikes = async () => {
    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()

      const { data, error: fetchError } = await supabase
        .from('customer_dislikes')
        .select(`
          id,
          photo_id,
          disliked_at,
          photos!inner (
            id,
            photo_url,
            thumbnail_url,
            title,
            description,
            gallery_id,
            galleries (
              id,
              gallery_name
            )
          )
        `)
        .eq('customer_id', customerId)
        .order('disliked_at', { ascending: false })

      if (fetchError) throw fetchError

      // Transform the data to match our interface
      const transformedData = (data || []).map((item: any) => ({
        id: item.id,
        photo_id: item.photo_id,
        disliked_at: item.disliked_at,
        photo: {
          id: item.photos.id,
          photo_url: item.photos.photo_url,
          thumbnail_url: item.photos.thumbnail_url,
          title: item.photos.title,
          description: item.photos.description,
          gallery_id: item.photos.gallery_id,
          gallery: item.photos.galleries
        }
      }))

      setDislikes(transformedData)
    } catch (err: any) {
      console.error('Error fetching dislikes:', err)
      setError(err.message || 'Failed to load dislikes')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-8">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-8">
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded">
          {error}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b">
        <div className="flex items-center gap-3">
          <ThumbsDown className="w-6 h-6 text-gray-600" />
          <h2 className="text-2xl font-semibold">Customer Dislikes</h2>
        </div>
        <div className="px-4 py-2 bg-gray-100 rounded-full">
          <span className="text-sm font-medium text-gray-700">
            {dislikes.length} {dislikes.length === 1 ? 'dislike' : 'dislikes'}
          </span>
        </div>
      </div>

      {/* Empty State */}
      {dislikes.length === 0 ? (
        <div className="text-center py-12">
          <ThumbsDown className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No dislikes yet</p>
          <p className="text-gray-400 text-sm mt-2">
            This customer has not disliked any photos
          </p>
        </div>
      ) : (
        /* Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {dislikes.map((dislike) => (
            <div
              key={dislike.id}
              className="group relative aspect-square bg-gray-200 rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-gray-600 transition-all"
              onClick={() => setSelectedPhoto(dislike.photo.photo_url)}
            >
              <Image
                src={dislike.photo.thumbnail_url}
                alt={dislike.photo.title || 'Disliked photo'}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-colors duration-300">
                <div className="absolute inset-0 flex flex-col justify-end p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  {dislike.photo.title && (
                    <p className="text-white font-medium text-sm truncate">
                      {dislike.photo.title}
                    </p>
                  )}
                  {dislike.photo.gallery && (
                    <p className="text-white/80 text-xs truncate">
                      {dislike.photo.gallery.gallery_name}
                    </p>
                  )}
                  <p className="text-white/60 text-xs mt-1">
                    Disliked: {formatDate(dislike.disliked_at)}
                  </p>
                </div>
              </div>

              {/* Dislike indicator */}
              <div className="absolute top-2 right-2">
                <ThumbsDown className="w-5 h-5 text-gray-600 fill-gray-600" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Photo Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="relative max-w-7xl max-h-[90vh] w-full h-full">
            <Image
              src={selectedPhoto}
              alt="Full size photo"
              fill
              className="object-contain"
              sizes="90vw"
            />
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 text-white bg-black/50 hover:bg-black/70 rounded-full p-3 transition-colors"
              aria-label="Close modal"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
