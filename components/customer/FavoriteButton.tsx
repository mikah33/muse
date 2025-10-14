'use client'

import { useState } from 'react'
import { Heart } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface FavoriteButtonProps {
  photoId: string
  isFavorited: boolean
  onToggle: (photoId: string, isFavorited: boolean) => void
  size?: 'sm' | 'md' | 'lg'
}

export default function FavoriteButton({
  photoId,
  isFavorited,
  onToggle,
  size = 'md',
}: FavoriteButtonProps) {
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  }

  const buttonSizeClasses = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-2.5',
  }

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation()

    if (loading) return

    setLoading(true)

    try {
      if (isFavorited) {
        // Remove favorite
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('photo_id', photoId)

        if (error) throw error
        onToggle(photoId, false)
      } else {
        // Add favorite
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) throw new Error('Not authenticated')

        const { error } = await supabase
          .from('favorites')
          .insert({
            customer_id: user.id,
            photo_id: photoId,
          })

        if (error) throw error
        onToggle(photoId, true)
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
      // Optionally show an error toast here
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`
        ${buttonSizeClasses[size]}
        bg-white/90 backdrop-blur-sm rounded-full
        hover:bg-white hover:scale-110
        transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        shadow-lg
      `}
      aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Heart
        className={`
          ${sizeClasses[size]}
          transition-all duration-200
          ${isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-700'}
        `}
      />
    </button>
  )
}
