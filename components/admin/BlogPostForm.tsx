'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface BlogPost {
  id?: string
  title: string
  slug: string
  excerpt: string
  content: string
  featured_image: string
  category: string
  published: boolean
}

interface BlogPostFormProps {
  post?: BlogPost
}

export default function BlogPostForm({ post }: BlogPostFormProps) {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    title: post?.title || '',
    slug: post?.slug || '',
    excerpt: post?.excerpt || '',
    content: post?.content || '',
    featured_image: post?.featured_image || '',
    category: post?.category || '',
    published: post?.published || false,
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

  // Upload featured image to Supabase Storage
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file')
      return
    }

    // Check file size (max 50MB for high-res photos)
    if (file.size > 50 * 1024 * 1024) {
      setError('Image must be less than 50MB')
      return
    }

    setUploading(true)
    setError('')

    try {
      // Generate unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `${fileName}`

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('blog-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        })

      if (uploadError) throw uploadError

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('blog-images')
        .getPublicUrl(filePath)

      // Update form data with image URL
      setFormData((prev) => ({
        ...prev,
        featured_image: publicUrl,
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
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        throw new Error('Not authenticated')
      }

      if (post?.id) {
        // Update existing post
        const { data, error: updateError } = await supabase
          .from('blog_posts')
          .update({
            ...formData,
            published_at: formData.published ? new Date().toISOString() : null,
          })
          .eq('id', post.id)

        console.log('Update result:', { data, error: updateError })
        if (updateError) throw updateError
      } else {
        // Create new post
        const { data, error: insertError } = await supabase
          .from('blog_posts')
          .insert({
            ...formData,
            published_at: formData.published ? new Date().toISOString() : null,
          })

        console.log('Insert result:', { data, error: insertError })
        console.log('Full error details:', JSON.stringify(insertError, null, 2))
        if (insertError) {
          setError(`Insert failed: ${insertError.message || insertError.code || 'Unknown error'}`)
          throw insertError
        }
      }

      router.push('/admin/blog')
      router.refresh()
    } catch (err: any) {
      console.error('Error saving post:', err)
      setError(err?.message || JSON.stringify(err) || 'Failed to save post')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!post?.id) return
    if (!confirm('Are you sure you want to delete this post?')) return

    setLoading(true)
    try {
      const { error: deleteError } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', post.id)

      if (deleteError) throw deleteError

      router.push('/admin/blog')
      router.refresh()
    } catch (err: any) {
      console.error('Error deleting post:', err)
      setError(err.message || 'Failed to delete post')
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
            placeholder="Enter post title"
          />
        </div>

        {/* Slug */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Slug (URL) *
          </label>
          <input
            type="text"
            value={formData.slug}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, slug: e.target.value }))
            }
            required
            className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none"
            placeholder="post-url-slug"
          />
          <p className="text-sm text-gray-500 mt-1">
            URL: /blog/{formData.slug || 'post-url-slug'}
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
            placeholder="Fashion, Tutorial, Industry..."
          />
        </div>

        {/* Featured Image */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Featured Image
          </label>

          {/* Image Preview */}
          {formData.featured_image && (
            <div className="relative w-full h-64 mb-4 rounded-lg overflow-hidden bg-gray-100">
              <Image
                src={formData.featured_image}
                alt="Featured image preview"
                fill
                className="object-cover"
              />
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({ ...prev, featured_image: '' }))
                }
                className="absolute top-2 right-2 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
              >
                Remove
              </button>
            </div>
          )}

          {/* Upload Button */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="w-full px-4 py-3 border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors disabled:opacity-50"
          >
            {uploading ? 'Uploading...' : formData.featured_image ? 'Change Image' : 'Upload Featured Image'}
          </button>
          <p className="text-sm text-gray-500 mt-1">
            Max 50MB. Recommended: 800x1000px (4:5 ratio)
          </p>

          {/* Manual URL Input */}
          <div className="mt-4">
            <label className="block text-xs text-gray-500 mb-1">
              Or paste image URL
            </label>
            <input
              type="url"
              value={formData.featured_image}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  featured_image: e.target.value,
                }))
              }
              className="w-full px-4 py-2 border border-gray-300 focus:border-black focus:outline-none text-sm"
              placeholder="https://..."
            />
          </div>
        </div>

        {/* Excerpt */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Excerpt (Short Description)
          </label>
          <textarea
            value={formData.excerpt}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, excerpt: e.target.value }))
            }
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none"
            placeholder="Short description for the blog listing..."
          />
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Content (HTML) *
          </label>
          <textarea
            value={formData.content}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, content: e.target.value }))
            }
            required
            rows={15}
            className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none font-mono text-sm"
            placeholder="<p>Your blog content here...</p>"
          />
          <p className="text-sm text-gray-500 mt-1">
            You can use HTML: &lt;p&gt;, &lt;h2&gt;, &lt;img&gt;, etc.
          </p>
        </div>

        {/* Published */}
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
            Publish immediately (visible to public)
          </label>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 pt-6 border-t">
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 bg-black text-white tracking-wider hover:bg-gray-900 transition-colors disabled:bg-gray-400"
          >
            {loading ? 'SAVING...' : post?.id ? 'UPDATE POST' : 'CREATE POST'}
          </button>

          <button
            type="button"
            onClick={() => router.push('/admin/blog')}
            className="px-8 py-3 border border-gray-300 tracking-wider hover:bg-gray-50 transition-colors"
          >
            CANCEL
          </button>

          {post?.id && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={loading}
              className="ml-auto px-8 py-3 bg-red-600 text-white tracking-wider hover:bg-red-700 transition-colors disabled:bg-gray-400"
            >
              DELETE POST
            </button>
          )}
        </div>
      </div>
    </form>
  )
}
