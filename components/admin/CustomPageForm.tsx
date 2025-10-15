'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import PageBuilderEditor from '@/components/page-builder/PageBuilderEditor'
import type { PageBlock } from '@/types/page-blocks'

interface CustomPage {
  id?: string
  title: string
  slug: string
  content: string
  content_version?: 'html' | 'blocks'
  blocks?: string
  published: boolean
  show_in_header: boolean
  show_in_mobile_menu: boolean
  order_position: number
}

interface CustomPageFormProps {
  page?: CustomPage
}

export default function CustomPageForm({ page }: CustomPageFormProps) {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Editor mode state
  const [useBlockEditor, setUseBlockEditor] = useState(page?.content_version === 'blocks')
  const [useHtml, setUseHtml] = useState(false)

  // Blocks state for PageBuilder
  const [blocks, setBlocks] = useState<PageBlock[]>(() => {
    if (page?.blocks) {
      try {
        const parsed = typeof page.blocks === 'string'
          ? JSON.parse(page.blocks)
          : page.blocks
        // Blocks are stored as a direct array, not wrapped in an object
        return Array.isArray(parsed) ? parsed : []
      } catch {
        return []
      }
    }
    return []
  })

  const [formData, setFormData] = useState({
    title: page?.title || '',
    slug: page?.slug || '',
    content: page?.content || '',
    published: page?.published ?? false,
    show_in_header: page?.show_in_header ?? true,
    show_in_mobile_menu: page?.show_in_mobile_menu ?? true,
    order_position: page?.order_position || 0,
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Prepare page data based on editor mode
      const pageData = {
        ...formData,
        content_version: useBlockEditor ? 'blocks' : 'html',
        blocks: useBlockEditor ? blocks : null,
        content: !useBlockEditor ? formData.content : '',
      }

      if (page?.id) {
        // Update existing page
        const { error: updateError } = await supabase
          .from('custom_pages')
          .update(pageData)
          .eq('id', page.id)

        if (updateError) throw updateError
      } else {
        // Create new page
        const { error: insertError } = await supabase
          .from('custom_pages')
          .insert(pageData)
          .select()

        if (insertError) throw insertError
      }

      router.push('/admin/pages')
      router.refresh()
    } catch (err: any) {
      console.error('Error saving page:', err)
      setError(err?.message || err?.error_description || err?.code || 'Failed to save page')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!page?.id) return
    if (!confirm('Are you sure you want to delete this page?')) return

    setLoading(true)
    try {
      const { error: deleteError } = await supabase
        .from('custom_pages')
        .delete()
        .eq('id', page.id)

      if (deleteError) throw deleteError

      router.push('/admin/pages')
      router.refresh()
    } catch (err: any) {
      console.error('Error deleting page:', err)
      setError(err.message || 'Failed to delete page')
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
          <label className="block text-sm font-medium mb-2">Page Title *</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none"
            placeholder="About Us"
          />
        </div>

        {/* Slug */}
        <div>
          <label className="block text-sm font-medium mb-2">URL Slug *</label>
          <input
            type="text"
            value={formData.slug}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, slug: e.target.value }))
            }
            required
            className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none"
            placeholder="about-us"
          />
          <p className="text-sm text-gray-500 mt-1">
            Page URL: /{formData.slug || 'page-url'}
          </p>
        </div>

        {/* Content Editor */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-medium">Content *</label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setUseBlockEditor(!useBlockEditor)
                  if (!useBlockEditor && blocks.length === 0) {
                    // Show helpful message when switching to empty block editor
                    setError('')
                  }
                }}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Switch to {useBlockEditor ? 'HTML Editor' : 'Visual Builder'}
              </button>
            </div>
          </div>

          {useBlockEditor ? (
            <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
              <PageBuilderEditor
                initialBlocks={blocks}
                onBlocksChange={setBlocks}
              />
              <p className="text-sm text-gray-500 mt-4">
                Visual block editor - Build your page with drag-and-drop blocks
              </p>
            </div>
          ) : (
            <>
              <div className="mb-2">
                <button
                  type="button"
                  onClick={() => setUseHtml(!useHtml)}
                  className="text-xs text-blue-600 hover:text-blue-800"
                >
                  Switch to {useHtml ? 'Plain Text' : 'HTML'} Mode
                </button>
              </div>

              {!useHtml ? (
                <>
                  <textarea
                    value={formData.content}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, content: e.target.value }))
                    }
                    required={!useBlockEditor}
                    rows={15}
                    className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none"
                    placeholder="Write your page content here..."
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Plain text mode - text will be displayed as-is
                  </p>
                </>
              ) : (
                <>
                  <textarea
                    value={formData.content}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, content: e.target.value }))
                    }
                    required={!useBlockEditor}
                    rows={15}
                    className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none font-mono text-sm"
                    placeholder="<div>Your HTML content...</div>"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    HTML mode - Full HTML support
                  </p>
                </>
              )}
            </>
          )}
        </div>

        {/* Order Position */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Menu Order Position
          </label>
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
            Lower numbers appear first in navigation
          </p>
        </div>

        {/* Display Options */}
        <div className="space-y-3">
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
              id="show_in_header"
              checked={formData.show_in_header}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  show_in_header: e.target.checked,
                }))
              }
              className="w-5 h-5"
            />
            <label htmlFor="show_in_header" className="text-sm font-medium">
              Show in desktop header navigation
            </label>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="show_in_mobile_menu"
              checked={formData.show_in_mobile_menu}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  show_in_mobile_menu: e.target.checked,
                }))
              }
              className="w-5 h-5"
            />
            <label htmlFor="show_in_mobile_menu" className="text-sm font-medium">
              Show in mobile hamburger menu
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 pt-6 border-t">
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 bg-black text-white tracking-wider hover:bg-gray-900 transition-colors disabled:bg-gray-400"
          >
            {loading ? 'SAVING...' : page?.id ? 'UPDATE PAGE' : 'CREATE PAGE'}
          </button>

          <button
            type="button"
            onClick={() => router.push('/admin/pages')}
            className="px-8 py-3 border border-gray-300 tracking-wider hover:bg-gray-50 transition-colors"
          >
            CANCEL
          </button>

          {page?.id && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={loading}
              className="ml-auto px-8 py-3 bg-red-600 text-white tracking-wider hover:bg-red-700 transition-colors disabled:bg-gray-400"
            >
              DELETE PAGE
            </button>
          )}
        </div>
      </div>
    </form>
  )
}
