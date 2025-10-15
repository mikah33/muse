'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { X, Upload } from 'lucide-react'

interface UploadedImage {
  file: File
  url: string
  title: string
  category: string
  published: boolean
}

export default function BulkPortfolioUpload() {
  const router = useRouter()
  const supabase = createClient()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [images, setImages] = useState<UploadedImage[]>([])
  const [defaultCategory, setDefaultCategory] = useState('')

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    setError('')
    const newImages: UploadedImage[] = []

    for (const file of files) {
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

      // Create preview URL
      const url = URL.createObjectURL(file)

      // Generate title from filename
      const title = file.name
        .replace(/\.[^/.]+$/, '') // Remove extension
        .replace(/[-_]/g, ' ') // Replace dashes/underscores with spaces
        .replace(/\b\w/g, l => l.toUpperCase()) // Capitalize words

      newImages.push({
        file,
        url,
        title,
        category: defaultCategory,
        published: true
      })
    }

    setImages(prev => [...prev, ...newImages])

    // Clear file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const removeImage = (index: number) => {
    setImages(prev => {
      const newImages = [...prev]
      URL.revokeObjectURL(newImages[index].url)
      newImages.splice(index, 1)
      return newImages
    })
  }

  const updateImage = (index: number, field: keyof UploadedImage, value: string | boolean) => {
    setImages(prev => {
      const newImages = [...prev]
      newImages[index] = { ...newImages[index], [field]: value }
      return newImages
    })
  }

  const handleSubmit = async () => {
    if (images.length === 0) {
      setError('Please select at least one image')
      return
    }

    setUploading(true)
    setError('')

    try {
      let successCount = 0

      for (let i = 0; i < images.length; i++) {
        const img = images[i]

        // Upload to storage
        const fileExt = img.file.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`

        const { error: uploadError } = await supabase.storage
          .from('blog-images')
          .upload(fileName, img.file, {
            cacheControl: '3600',
            upsert: false,
          })

        if (uploadError) {
          console.error(`Error uploading ${img.file.name}:`, uploadError)
          continue
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('blog-images')
          .getPublicUrl(fileName)

        // Generate slug from title
        const slug = img.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '')

        // Create portfolio item
        const { error: insertError } = await supabase
          .from('portfolio_items')
          .insert({
            title: img.title,
            slug: `${slug}-${Date.now()}`, // Add timestamp to ensure uniqueness
            description: '',
            image_url: publicUrl,
            category: img.category,
            order_position: i,
            is_featured: false,
            published: img.published,
          })

        if (insertError) {
          console.error(`Error creating portfolio item for ${img.title}:`, insertError)
          continue
        }

        successCount++
      }

      if (successCount === images.length) {
        router.push('/admin/portfolio')
        router.refresh()
      } else {
        setError(`Uploaded ${successCount} of ${images.length} images. Some failed - check console for details.`)
        setUploading(false)
      }
    } catch (err: any) {
      console.error('Bulk upload error:', err)
      setError(err.message || 'Failed to upload images')
      setUploading(false)
    }
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Default Category */}
      <div className="bg-white rounded-lg shadow p-6">
        <label className="block text-sm font-medium mb-2">Default Category (optional)</label>
        <input
          type="text"
          value={defaultCategory}
          onChange={(e) => setDefaultCategory(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none"
          placeholder="Fashion, Beauty, Editorial..."
        />
        <p className="text-sm text-gray-500 mt-1">
          This category will be applied to all uploaded images
        </p>
      </div>

      {/* File Upload */}
      <div className="bg-white rounded-lg shadow p-6">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,.cr2,.cr3,.nef,.arw,.dng,.orf,.rw2,.pef,.raf"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="w-full px-6 py-8 border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors disabled:opacity-50 text-center rounded-lg"
        >
          <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
          <p className="text-sm font-medium">Click to select multiple images</p>
          <p className="text-xs text-gray-500 mt-1">
            Max 50MB per file. Accepts JPG, PNG, and RAW formats
          </p>
        </button>
      </div>

      {/* Images Grid */}
      {images.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">
            Selected Images ({images.length})
          </h2>

          <div className="space-y-4">
            {images.map((img, index) => (
              <div
                key={index}
                className="flex gap-4 p-4 border border-gray-200 rounded-lg"
              >
                {/* Image Preview */}
                <div className="relative w-32 h-32 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                  <Image
                    src={img.url}
                    alt={img.title}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Form Fields */}
                <div className="flex-1 space-y-3">
                  <div>
                    <label className="block text-xs font-medium mb-1">Title *</label>
                    <input
                      type="text"
                      value={img.title}
                      onChange={(e) => updateImage(index, 'title', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 focus:border-black focus:outline-none text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium mb-1">Category</label>
                    <input
                      type="text"
                      value={img.category}
                      onChange={(e) => updateImage(index, 'category', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 focus:border-black focus:outline-none text-sm"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={`published-${index}`}
                      checked={img.published}
                      onChange={(e) => updateImage(index, 'published', e.target.checked)}
                      className="w-4 h-4"
                    />
                    <label htmlFor={`published-${index}`} className="text-xs font-medium">
                      Published
                    </label>
                  </div>
                </div>

                {/* Remove Button */}
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded"
                  aria-label="Remove image"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 mt-6 pt-6 border-t">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={uploading}
              className="px-8 py-3 bg-black text-white tracking-wider hover:bg-gray-900 transition-colors disabled:bg-gray-400"
            >
              {uploading ? 'UPLOADING...' : `UPLOAD ${images.length} ITEM${images.length > 1 ? 'S' : ''}`}
            </button>

            <button
              type="button"
              onClick={() => router.push('/admin/portfolio')}
              className="px-8 py-3 border border-gray-300 tracking-wider hover:bg-gray-50 transition-colors"
            >
              CANCEL
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
