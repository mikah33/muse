'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface DeleteButtonProps {
  id: string
  type: 'blog' | 'portfolio' | 'customer' | 'gallery' | 'photo'
  label?: string
  onSuccess?: () => void
  className?: string
}

export default function DeleteButton({
  id,
  type,
  label = 'DELETE',
  onSuccess,
  className = ''
}: DeleteButtonProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    const confirmMessage = {
      blog: 'Are you sure you want to delete this blog post?',
      portfolio: 'Are you sure you want to delete this portfolio item?',
      customer: 'Are you sure you want to delete this customer? All their galleries will also be deleted.',
      gallery: 'Are you sure you want to delete this gallery? All photos in it will also be deleted.',
      photo: 'Are you sure you want to delete this photo?'
    }

    if (!confirm(confirmMessage[type])) {
      return
    }

    setIsDeleting(true)

    try {
      const endpoints = {
        blog: '/api/admin/blog/delete',
        portfolio: '/api/admin/portfolio/delete',
        customer: '/api/admin/delete-customer',
        gallery: '/api/admin/gallery/delete',
        photo: '/api/admin/gallery/photo/delete'
      }

      const response = await fetch(endpoints[type], {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Delete error:', errorData)
        throw new Error(errorData.error || 'Failed to delete')
      }

      if (onSuccess) {
        onSuccess()
      } else {
        // For customer delete, redirect to customers list
        if (type === 'customer') {
          router.push('/admin/customers')
        } else {
          router.refresh()
        }
      }
    } catch (error) {
      console.error('Error deleting:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete. Please try again.'
      alert(errorMessage)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className={`px-4 py-2 border border-red-300 text-red-600 text-xs md:text-sm tracking-wider hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {isDeleting ? 'DELETING...' : label}
    </button>
  )
}
