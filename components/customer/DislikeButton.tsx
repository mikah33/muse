'use client'

import { useState } from 'react'
import { ThumbsDown } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface DislikeButtonProps {
  photoId: string
  isDisliked: boolean
  onToggle: (photoId: string, isDisliked: boolean) => void
  size?: 'sm' | 'md' | 'lg'
}

export default function DislikeButton({
  photoId,
  isDisliked,
  onToggle,
  size = 'md',
}: DislikeButtonProps) {
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
    console.log('Dislike button clicked:', { photoId, isDisliked })

    try {
      if (isDisliked) {
        // Remove dislike
        console.log('Removing dislike...')
        const { data, error } = await supabase
          .from('dislikes')
          .delete()
          .eq('photo_id', photoId)

        console.log('Delete result:', { data, error })
        if (error) throw error
        onToggle(photoId, false)
        console.log('Dislike removed successfully')
      } else {
        // Add dislike
        const { data: { user } } = await supabase.auth.getUser()
        console.log('Current user:', user?.id)

        if (!user) throw new Error('Not authenticated')

        console.log('Adding dislike...')
        const { data, error } = await supabase
          .from('dislikes')
          .insert({
            customer_id: user.id,
            photo_id: photoId,
          })

        console.log('Insert result:', { data, error })
        if (error) throw error
        onToggle(photoId, true)
        console.log('Dislike added successfully')
      }
    } catch (error) {
      console.error('Error toggling dislike:', error)
      alert('Error: ' + (error as Error).message)
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
      aria-label={isDisliked ? 'Remove dislike' : 'Mark as disliked'}
    >
      <ThumbsDown
        className={`
          ${sizeClasses[size]}
          transition-all duration-200
          ${isDisliked ? 'fill-red-500 text-red-500' : 'text-gray-700'}
        `}
      />
    </button>
  )
}
