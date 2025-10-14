'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface GalleryPhotoUploadProps {
  galleryId: string
}

export default function GalleryPhotoUpload({ galleryId }: GalleryPhotoUploadProps) {
  const router = useRouter()
  const supabase = createClient()
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [progress, setProgress] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    setUploading(true)
    setError('')
    setProgress(`Uploading ${files.length} file(s)...`)

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        setProgress(`Uploading ${i + 1} of ${files.length}...`)

        // Upload to storage
        const fileExt = file.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`

        const { error: uploadError } = await supabase.storage
          .from('blog-images')
          .upload(fileName, file)

        if (uploadError) throw uploadError

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('blog-images')
          .getPublicUrl(fileName)

        // Create photo record
        const { error: dbError } = await supabase
          .from('photos')
          .insert({
            gallery_id: galleryId,
            photo_url: publicUrl,
            thumbnail_url: publicUrl,
            file_size: file.size,
            order_position: i,
          })

        if (dbError) throw dbError
      }

      setProgress('Upload complete!')
      setTimeout(() => {
        setProgress('')
        router.refresh()
      }, 1500)

      // Clear file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (err: any) {
      console.error('Upload error:', err)
      setError(err.message || 'Failed to upload photos')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      {progress && (
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 text-blue-700 text-sm">
          {progress}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,.cr2,.cr3,.nef,.arw,.dng,.orf,.rw2,.pef,.raf"
        multiple
        onChange={handleFileUpload}
        disabled={uploading}
        className="hidden"
      />

      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        className="w-full px-6 py-4 border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors disabled:opacity-50 text-center"
      >
        {uploading ? progress : 'Click to Upload Photos (or drag and drop)'}
      </button>

      <p className="text-sm text-gray-500 mt-2">
        Max 50MB per file. Accepts JPG, PNG, and RAW formats. Select multiple files to upload at once.
      </p>
    </div>
  )
}
