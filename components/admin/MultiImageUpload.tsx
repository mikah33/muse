'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import Image from 'next/image'
import { X, Upload } from 'lucide-react'

interface UploadedImage {
  url: string
  name: string
}

interface MultiImageUploadProps {
  onImagesUploaded: (urls: string[]) => void
  maxFiles?: number
}

export default function MultiImageUpload({ onImagesUploaded, maxFiles = 20 }: MultiImageUploadProps) {
  const supabase = createClient()
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([])
  const [progress, setProgress] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    if (files.length > maxFiles) {
      setError(`Maximum ${maxFiles} files allowed`)
      return
    }

    setUploading(true)
    setError('')
    setProgress(`Uploading ${files.length} file(s)...`)

    const uploadedUrls: string[] = []
    const uploadedImagesList: UploadedImage[] = []

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        setProgress(`Uploading ${i + 1} of ${files.length}...`)

        // Validate file
        const validTypes = ['image/', '.cr2', '.cr3', '.nef', '.arw', '.dng', '.orf', '.rw2', '.pef', '.raf']
        const isValid = validTypes.some(type =>
          file.type.toLowerCase().includes(type) || file.name.toLowerCase().endsWith(type)
        )

        if (!isValid) {
          console.warn(`Skipping ${file.name} - not a valid image`)
          continue
        }

        if (file.size > 50 * 1024 * 1024) {
          console.warn(`Skipping ${file.name} - file too large`)
          continue
        }

        // Upload to storage
        const fileExt = file.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`

        const { error: uploadError } = await supabase.storage
          .from('blog-images')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false,
          })

        if (uploadError) {
          console.error(`Error uploading ${file.name}:`, uploadError)
          continue
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('blog-images')
          .getPublicUrl(fileName)

        uploadedUrls.push(publicUrl)
        uploadedImagesList.push({ url: publicUrl, name: file.name })
      }

      setUploadedImages(prev => [...prev, ...uploadedImagesList])
      setProgress(`Successfully uploaded ${uploadedUrls.length} image(s)`)
      onImagesUploaded(uploadedUrls)

      setTimeout(() => setProgress(''), 2000)

      // Clear file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (err: any) {
      console.error('Upload error:', err)
      setError(err.message || 'Failed to upload images')
    } finally {
      setUploading(false)
    }
  }

  const removeImage = (url: string) => {
    setUploadedImages(prev => prev.filter(img => img.url !== url))
    const remainingUrls = uploadedImages.filter(img => img.url !== url).map(img => img.url)
    onImagesUploaded(remainingUrls)
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      {progress && (
        <div className="p-4 bg-blue-50 border border-blue-200 text-blue-700 text-sm">
          {progress}
        </div>
      )}

      {/* Upload Area */}
      <div>
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
          className="w-full px-6 py-8 border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors disabled:opacity-50 text-center rounded-lg"
        >
          <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
          <p className="text-sm font-medium">
            {uploading ? progress : 'Click to select multiple images'}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            or drag and drop (up to {maxFiles} files)
          </p>
        </button>

        <p className="text-xs text-gray-500 mt-2">
          Max 50MB per file. Accepts JPG, PNG, and RAW formats.
        </p>
      </div>

      {/* Preview Grid */}
      {uploadedImages.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {uploadedImages.map((img, index) => (
            <div
              key={index}
              className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden group"
            >
              <Image
                src={img.url}
                alt={img.name}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
              />
              <button
                type="button"
                onClick={() => removeImage(img.url)}
                className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Remove image"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-white text-xs truncate">{img.name}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {uploadedImages.length > 0 && (
        <p className="text-sm text-gray-600">
          {uploadedImages.length} image(s) uploaded
        </p>
      )}
    </div>
  )
}
