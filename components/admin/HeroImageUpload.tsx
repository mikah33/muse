'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface HeroImageUploadProps {
  currentImage: string
}

export default function HeroImageUpload({ currentImage }: HeroImageUploadProps) {
  const router = useRouter()
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [resetting, setResetting] = useState(false)

  const handleReset = async () => {
    if (!confirm('Reset hero image to default? This will remove your custom image.')) {
      return
    }

    setResetting(true)
    try {
      const response = await fetch('/api/admin/settings/hero-image/reset', {
        method: 'POST',
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Reset failed')
      }

      alert('Hero image reset to default!')
      router.refresh()
    } catch (error) {
      console.error('Reset error:', error)
      alert(error instanceof Error ? error.message : 'Failed to reset image')
    } finally {
      setResetting(false)
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB')
      return
    }

    // Show preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(file)

    // Upload
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/admin/settings/hero-image', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Upload failed')
      }

      const data = await response.json()
      alert('Hero image updated successfully!')
      router.refresh()
    } catch (error) {
      console.error('Upload error:', error)
      alert(error instanceof Error ? error.message : 'Failed to upload image')
      setPreview(null)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      {/* Image Size Guide */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 md:p-4 mb-4">
        <h3 className="text-sm font-semibold text-blue-900 mb-2">📐 Recommended Image Size</h3>
        <ul className="text-xs md:text-sm text-blue-800 space-y-1">
          <li><strong>Dimensions:</strong> 1920 x 1080 pixels (16:9 ratio)</li>
          <li><strong>Format:</strong> JPG, PNG, or WebP</li>
          <li><strong>Max file size:</strong> 5MB</li>
          <li><strong>Tip:</strong> High-quality landscape images work best</li>
        </ul>
      </div>

      {preview && (
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Preview:</h3>
          <div className="relative w-full aspect-video bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <label className="cursor-pointer">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading || resetting}
            className="hidden"
          />
          <span className="inline-block px-4 md:px-6 py-2 md:py-3 bg-black text-white text-xs md:text-sm tracking-wider hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            {uploading ? 'UPLOADING...' : 'CHOOSE NEW IMAGE'}
          </span>
        </label>

        <button
          onClick={handleReset}
          disabled={uploading || resetting}
          className="px-4 md:px-6 py-2 md:py-3 border-2 border-gray-300 text-gray-700 text-xs md:text-sm tracking-wider hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {resetting ? 'RESETTING...' : 'RESET TO DEFAULT'}
        </button>

        {(uploading || resetting) && (
          <span className="text-sm text-gray-600">
            {uploading ? 'Uploading...' : 'Resetting...'}
          </span>
        )}
      </div>

      <p className="text-xs text-gray-500 mt-3">
        Your image will be uploaded to Supabase Storage and displayed on the homepage.
      </p>
    </div>
  )
}
