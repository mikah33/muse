'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface PortfolioItem {
  id?: string
  title: string
  slug: string
  description: string
  image_url: string
  category: string
  order_position: number
  is_featured: boolean
  published: boolean
}

interface PortfolioItemFormProps {
  item?: PortfolioItem
}

export default function PortfolioItemForm({ item }: PortfolioItemFormProps) {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    title: item?.title || '',
    slug: item?.slug || '',
    description: item?.description || '',
    image_url: item?.image_url || '',
    category: item?.category || '',
    order_position: item?.order_position || 0,
    is_featured: item?.is_featured || false,
    published: item?.published ?? true,
  })

  // Auto-generate slug from title
  const handleTitleChange = (title: string) => {
    setFormData((prev) => ({
      ...prev,
      title,
      slug: title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, ''),
    }))
  }

  // Upload multiple images to Supabase Storage
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    // For single item form, only take the first file
    const file = files[0]

    // Accept image files and RAW formats
    const validTypes = ['image/', '.cr2', '.cr3', '.nef', '.arw', '.dng', '.orf', '.rw2', '.pef', '.raf']
    const isValid = validTypes.some(type =>
      file.type.toLowerCase().includes(type) || file.name.toLowerCase().endsWith(type)
    )

    if (!isValid) {
      setError('Please upload an image file (JPG, PNG, RAW formats accepted)')
      return
    }

    if (file.size > 50 * 1024 * 1024) {
      setError('Image must be less than 50MB')
      return
    }

    setUploading(true)
    setError('')

    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('blog-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
        })

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('blog-images')
        .getPublicUrl(fileName)

      setFormData((prev) => ({
        ...prev,
        image_url: publicUrl,
      }))
    } catch (err: any) {
      console.error('Error uploading image:', err)
      setError(err.message || 'Failed to upload image')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (item?.id) {
        const { error: updateError } = await supabase
          .from('portfolio_items')
          .update(formData)
          .eq('id', item.id)

        if (updateError) throw updateError
      } else {
        const { error: insertError } = await supabase
          .from('portfolio_items')
          .insert(formData)

        if (insertError) throw insertError
      }

      router.push('/admin/portfolio')
      router.refresh()
    } catch (err: any) {
      console.error('Error saving item:', err)
      setError(err?.message || 'Failed to save portfolio item')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!item?.id) return
    if (!confirm('Are you sure you want to delete this portfolio item?')) return

    setLoading(true)
    try {
      const { error: deleteError } = await supabase
        .from('portfolio_items')
        .delete()
        .eq('id', item.id)

      if (deleteError) throw deleteError

      router.push('/admin/portfolio')
      router.refresh()
    } catch (err: any) {
      console.error('Error deleting item:', err)
      setError(err.message || 'Failed to delete item')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-8">
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium mb-2">Title *</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none"
            placeholder="Portfolio piece title"
          />
        </div>

        {/* Slug */}
        <div>
          <label className="block text-sm font-medium mb-2">Slug (URL) *</label>
          <input
            type="text"
            value={formData.slug}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, slug: e.target.value }))
            }
            required
            className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none"
            placeholder="portfolio-piece-url"
          />
          <p className="text-sm text-gray-500 mt-1">
            URL: /portfolio/{formData.slug || 'portfolio-piece-url'}
          </p>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium mb-2">Category</label>
          <input
            type="text"
            value={formData.category}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, category: e.target.value }))
            }
            className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none"
            placeholder="Fashion, Beauty, Editorial..."
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium mb-2">Image *</label>

          {formData.image_url && (
            <div className="relative w-full h-96 mb-4 rounded-lg overflow-hidden bg-gray-100">
              <Image
                src={formData.image_url}
                alt="Portfolio image preview"
                fill
                className="object-cover"
              />
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({ ...prev, image_url: '' }))
                }
                className="absolute top-2 right-2 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
              >
                Remove
              </button>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.cr2,.cr3,.nef,.arw,.dng,.orf,.rw2,.pef,.raf"
            multiple
            onChange={handleImageUpload}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="w-full px-4 py-3 border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors disabled:opacity-50"
          >
            {uploading ? 'Uploading...' : formData.image_url ? 'Change Image' : 'Upload Image'}
          </button>
          <p className="text-sm text-gray-500 mt-1">
            Max 50MB per file. Accepts JPG, PNG, and RAW formats. Select multiple files to upload (first file will be used for this portfolio item)
          </p>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, description: e.target.value }))
            }
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none"
            placeholder="Short description of this piece..."
          />
        </div>

        {/* Order Position */}
        <div>
          <label className="block text-sm font-medium mb-2">Order Position</label>
          <input
            type="number"
            value={formData.order_position}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                order_position: parseInt(e.target.value) || 0,
              }))
            }
            className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none"
            placeholder="0"
          />
          <p className="text-sm text-gray-500 mt-1">
            Lower numbers appear first
          </p>
        </div>

        {/* Checkboxes */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="published"
              checked={formData.published}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, published: e.target.checked }))
              }
              className="w-5 h-5"
            />
            <label htmlFor="published" className="text-sm font-medium">
              Published (visible to public)
            </label>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="featured"
              checked={formData.is_featured}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, is_featured: e.target.checked }))
              }
              className="w-5 h-5"
            />
            <label htmlFor="featured" className="text-sm font-medium">
              Featured
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 pt-6 border-t">
          <button
            type="submit"
            disabled={loading || !formData.image_url}
            className="px-8 py-3 bg-black text-white tracking-wider hover:bg-gray-900 transition-colors disabled:bg-gray-400"
          >
            {loading ? 'SAVING...' : item?.id ? 'UPDATE ITEM' : 'ADD TO PORTFOLIO'}
          </button>

          <button
            type="button"
            onClick={() => router.push('/admin/portfolio')}
            className="px-8 py-3 border border-gray-300 tracking-wider hover:bg-gray-50 transition-colors"
          >
            CANCEL
          </button>

          {item?.id && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={loading}
              className="ml-auto px-8 py-3 bg-red-600 text-white tracking-wider hover:bg-red-700 transition-colors disabled:bg-gray-400"
            >
              DELETE
            </button>
          )}
        </div>
      </div>
    </form>
  )
}
