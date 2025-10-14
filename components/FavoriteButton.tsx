'use client'

import { useState } from 'react'
import { Heart } from 'lucide-react'

interface FavoriteButtonProps {
  photoId: string
  initialFavorited: boolean
}

export function FavoriteButton({ photoId, initialFavorited }: FavoriteButtonProps) {
  const [isFavorited, setIsFavorited] = useState(initialFavorited)
  const [isLoading, setIsLoading] = useState(false)

  const toggleFavorite = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/customer/favorites/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ photoId })
      })

      if (!response.ok) throw new Error('Failed to toggle favorite')

      const data = await response.json()
      setIsFavorited(data.favorited)
    } catch (error) {
      console.error('Error toggling favorite:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={toggleFavorite}
      disabled={isLoading}
      className={`
        p-2 rounded-full backdrop-blur-sm transition-all
        ${isFavorited
          ? 'bg-red-500 text-white hover:bg-red-600'
          : 'bg-white/80 text-gray-600 hover:bg-white'
        }
        disabled:opacity-50 disabled:cursor-not-allowed
      `}
      aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Heart
        size={20}
        fill={isFavorited ? 'currentColor' : 'none'}
        className="transition-all"
      />
    </button>
  )
}
