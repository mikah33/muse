'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import type { PageBlock } from '@/types/page-blocks'
import {
  createHeroBlock,
  createTextBlock,
  createImageBlock,
  createGalleryBlock,
  createCTABlock,
} from '@/types/page-blocks'
import { PAGE_TEMPLATES } from '@/lib/page-templates'

interface PageBuilderEditorProps {
  initialBlocks: PageBlock[]
  onBlocksChange: (blocks: PageBlock[]) => void
}

export default function PageBuilderEditor({
  initialBlocks,
  onBlocksChange,
}: PageBuilderEditorProps) {
  const supabase = createClient()
  const [blocks, setBlocks] = useState<PageBlock[]>(initialBlocks)
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({})

  const updateBlocks = (newBlocks: PageBlock[]) => {
    setBlocks(newBlocks)
    onBlocksChange(newBlocks)
  }

  const addBlock = (type: PageBlock['type']) => {
    let newBlock: PageBlock

    switch (type) {
      case 'hero':
        newBlock = createHeroBlock()
        break
      case 'text':
        newBlock = createTextBlock()
        break
      case 'image':
        newBlock = createImageBlock()
        break
      case 'gallery':
        newBlock = createGalleryBlock()
        break
      case 'cta':
        newBlock = createCTABlock()
        break
      default:
        return
    }

    updateBlocks([...blocks, newBlock])
    setSelectedBlockId(newBlock.id)
  }

  const removeBlock = (id: string) => {
    updateBlocks(blocks.filter((block) => block.id !== id))
    if (selectedBlockId === id) {
      setSelectedBlockId(null)
    }
  }

  const moveBlock = (id: string, direction: 'up' | 'down') => {
    const index = blocks.findIndex((block) => block.id === id)
    if (index === -1) return

    const newBlocks = [...blocks]
    const targetIndex = direction === 'up' ? index - 1 : index + 1

    if (targetIndex < 0 || targetIndex >= newBlocks.length) return

    ;[newBlocks[index], newBlocks[targetIndex]] = [
      newBlocks[targetIndex],
      newBlocks[index],
    ]

    updateBlocks(newBlocks)
  }

  const updateBlock = (id: string, updates: any) => {
    updateBlocks(
      blocks.map((block) =>
        block.id === id ? ({ ...block, ...updates } as PageBlock) : block
      )
    )
  }

  // Template loading
  const loadTemplate = (templateId: string) => {
    const template = PAGE_TEMPLATES.find((t) => t.id === templateId)
    if (!template) return

    // Confirm if blocks already exist
    if (blocks.length > 0) {
      if (
        !confirm(
          'Loading a template will replace all current blocks. Continue?'
        )
      ) {
        return
      }
    }

    // Convert template blocks with new IDs
    const newBlocks: PageBlock[] = template.blocks.map((block) => {
      const baseProps = {
        id: crypto.randomUUID(),
        settings: {
          background:
            (block.content.backgroundColor === '#000000'
              ? 'black'
              : block.content.backgroundColor === '#f5f5f5' ||
                block.content.backgroundColor === '#1a1a1a'
              ? 'gray-50'
              : 'white') as PageBlock['settings']['background'],
          padding: 'md' as PageBlock['settings']['padding'],
          alignment: (block.content.alignment ||
            'left') as PageBlock['settings']['alignment'],
        },
      }

      switch (block.type) {
        case 'hero':
          return createHeroBlock({
            ...baseProps,
            content: {
              backgroundImage: block.content.imageUrl || '',
              title: block.content.title || '',
              subtitle: block.content.subtitle || '',
              button: block.content.buttonText
                ? {
                    text: block.content.buttonText,
                    href: block.content.buttonLink || '',
                    variant: 'primary' as const,
                  }
                : undefined,
              overlayOpacity: 50,
            },
          })

        case 'text':
          return createTextBlock({
            ...baseProps,
            content: {
              heading: block.content.title,
              body: block.content.body || '',
              isHtml: false,
            },
          })

        case 'image':
          return createImageBlock({
            ...baseProps,
            content: {
              image: {
                url: block.content.imageUrl || '',
                alt: block.content.imageAlt || '',
              },
              maxWidth: 'full',
            },
          })

        case 'cta':
          return createCTABlock({
            ...baseProps,
            content: {
              heading: block.content.title || '',
              description: block.content.subtitle,
              button: {
                text: block.content.buttonText || '',
                href: block.content.buttonLink || '',
                variant: 'primary' as const,
              },
            },
          })

        default:
          return createTextBlock(baseProps)
      }
    })

    updateBlocks(newBlocks as PageBlock[])
    setError('')
  }

  // Image upload handler
  const handleImageUpload = async (
    blockId: string,
    file: File,
    field: 'backgroundImage' | 'url'
  ) => {
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file')
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
      const filePath = `${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('blog-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        })

      if (uploadError) throw uploadError

      const {
        data: { publicUrl },
      } = supabase.storage.from('blog-images').getPublicUrl(filePath)

      // Update the block with the new image URL
      const block = blocks.find((b) => b.id === blockId)
      if (!block) return

      if (block.type === 'hero' && field === 'backgroundImage') {
        updateBlock(blockId, {
          content: {
            ...(block.content as any),
            backgroundImage: publicUrl,
          },
        } as any)
      } else if (block.type === 'image' && field === 'url') {
        updateBlock(blockId, {
          content: {
            ...(block.content as any),
            image: {
              ...(block.content as any).image,
              url: publicUrl,
            },
          },
        } as any)
      }
    } catch (err: any) {
      console.error('Error uploading image:', err)
      setError(err.message || 'Failed to upload image')
    } finally {
      setUploading(false)
    }
  }

  // Gallery image upload handler
  const handleGalleryImageUpload = async (blockId: string, file: File) => {
    const block = blocks.find((b) => b.id === blockId)
    if (!block || block.type !== 'gallery') return

    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file')
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
      const filePath = `${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('blog-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        })

      if (uploadError) throw uploadError

      const {
        data: { publicUrl },
      } = supabase.storage.from('blog-images').getPublicUrl(filePath)

      updateBlock(blockId, {
        content: {
          ...(block.content as any),
          images: [
            ...(block.content as any).images,
            { url: publicUrl, alt: '', caption: '' },
          ],
        },
      } as any)
    } catch (err: any) {
      console.error('Error uploading image:', err)
      setError(err.message || 'Failed to upload image')
    } finally {
      setUploading(false)
    }
  }

  const selectedBlock = blocks.find((block) => block.id === selectedBlockId)

  return (
    <div className="space-y-4">
      {/* Error Display */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded">
          {error}
        </div>
      )}

      {/* Header with Template Selector and Preview Toggle */}
      <div className="bg-gray-50 p-4 rounded-lg space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">Page Builder</h3>
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="px-3 py-2 text-xs border border-gray-300 bg-white hover:bg-gray-50"
          >
            {showPreview ? 'Hide' : 'Show'} Preview
          </button>
        </div>

        {/* Template Selector */}
        <div>
          <label className="block text-xs font-medium mb-1">
            Load from Template
          </label>
          <select
            onChange={(e) => {
              if (e.target.value) {
                loadTemplate(e.target.value)
                e.target.value = '' // Reset selector
              }
            }}
            className="w-full px-3 py-2 border border-gray-300 text-sm focus:border-black focus:outline-none bg-white"
            defaultValue=""
          >
            <option value="" disabled>
              Choose a template...
            </option>
            {PAGE_TEMPLATES.map((template) => (
              <option key={template.id} value={template.id}>
                {template.name} - {template.description}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6 min-h-[600px]">
        {/* Block List */}
        <div className="col-span-8 space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium mb-3">Add Block</h3>
            <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => addBlock('hero')}
              className="px-3 py-2 bg-white border border-gray-300 text-sm hover:bg-gray-50 transition-colors"
            >
              + Hero
            </button>
            <button
              type="button"
              onClick={() => addBlock('text')}
              className="px-3 py-2 bg-white border border-gray-300 text-sm hover:bg-gray-50 transition-colors"
            >
              + Text
            </button>
            <button
              type="button"
              onClick={() => addBlock('image')}
              className="px-3 py-2 bg-white border border-gray-300 text-sm hover:bg-gray-50 transition-colors"
            >
              + Image
            </button>
            <button
              type="button"
              onClick={() => addBlock('gallery')}
              className="px-3 py-2 bg-white border border-gray-300 text-sm hover:bg-gray-50 transition-colors"
            >
              + Gallery
            </button>
            <button
              type="button"
              onClick={() => addBlock('cta')}
              className="px-3 py-2 bg-white border border-gray-300 text-sm hover:bg-gray-50 transition-colors"
            >
              + CTA
            </button>
          </div>
        </div>

        {blocks.length === 0 ? (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center text-gray-500">
            No blocks yet. Add your first block above.
          </div>
        ) : (
          <div className="space-y-3">
            {blocks.map((block, index) => (
              <div
                key={block.id}
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  selectedBlockId === block.id
                    ? 'border-black bg-gray-50'
                    : 'border-gray-300 bg-white hover:border-gray-400'
                }`}
                onClick={() => setSelectedBlockId(block.id)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-medium uppercase text-gray-500">
                      {block.type}
                    </span>
                    <p className="text-sm mt-1">
                      {block.type === 'hero' && block.content.title}
                      {block.type === 'text' && block.content.heading}
                      {block.type === 'image' && block.content.image.alt}
                      {block.type === 'gallery' &&
                        `${block.content.images.length} images`}
                      {block.type === 'cta' && block.content.heading}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        moveBlock(block.id, 'up')
                      }}
                      disabled={index === 0}
                      className="px-2 py-1 text-xs border border-gray-300 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        moveBlock(block.id, 'down')
                      }}
                      disabled={index === blocks.length - 1}
                      className="px-2 py-1 text-xs border border-gray-300 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        removeBlock(block.id)
                      }}
                      className="px-2 py-1 text-xs border border-red-300 text-red-600 hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Block Editor */}
      <div className="col-span-4">
        <div className="sticky top-4">
          {selectedBlock ? (
            <div className="bg-white border border-gray-300 rounded-lg p-4">
              <h3 className="text-sm font-medium mb-4">
                Edit {selectedBlock.type} Block
              </h3>
              <BlockEditor
                block={selectedBlock}
                onChange={(updates) => updateBlock(selectedBlock.id, updates)}
                onImageUpload={(file, field) =>
                  handleImageUpload(selectedBlock.id, file, field)
                }
                onGalleryImageUpload={(file) =>
                  handleGalleryImageUpload(selectedBlock.id, file)
                }
                uploading={uploading}
              />
            </div>
          ) : (
            <div className="bg-gray-50 border border-gray-300 rounded-lg p-8 text-center text-sm text-gray-500">
              Select a block to edit its properties
            </div>
          )}
        </div>
      </div>

      {/* Preview Section */}
      {showPreview && blocks.length > 0 && (
        <div className="border-t pt-4">
          <h3 className="text-sm font-medium mb-3 text-gray-700">Preview</h3>
          <div className="bg-white border border-gray-300 rounded overflow-hidden">
            <div className="text-xs text-gray-500 p-4 text-center">
              Preview functionality coming soon - blocks will render here
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  )
}

interface BlockEditorProps {
  block: PageBlock
  onChange: (updates: Partial<PageBlock>) => void
  onImageUpload?: (file: File, field: 'backgroundImage' | 'url') => void
  onGalleryImageUpload?: (file: File) => void
  uploading?: boolean
}

function BlockEditor({
  block,
  onChange,
  onImageUpload,
  onGalleryImageUpload,
  uploading,
}: BlockEditorProps) {
  const heroImageRef = useRef<HTMLInputElement>(null)
  const imageRef = useRef<HTMLInputElement>(null)
  const galleryRef = useRef<HTMLInputElement>(null)

  const updateContent = (updates: any) => {
    onChange({
      content: { ...(block.content as any), ...updates },
    } as any)
  }

  const updateSettings = (updates: Partial<PageBlock['settings']>) => {
    onChange({
      settings: { ...block.settings, ...updates },
    })
  }

  return (
    <div className="space-y-4">
      {/* Common Settings */}
      <div>
        <label className="block text-xs font-medium mb-1">Background</label>
        <select
          value={block.settings.background}
          onChange={(e) =>
            updateSettings({
              background: e.target.value as PageBlock['settings']['background'],
            })
          }
          className="w-full px-3 py-2 border border-gray-300 text-sm focus:border-black focus:outline-none"
        >
          <option value="white">White</option>
          <option value="gray-50">Gray</option>
          <option value="black">Black</option>
        </select>
      </div>

      <div>
        <label className="block text-xs font-medium mb-1">Padding</label>
        <select
          value={block.settings.padding}
          onChange={(e) =>
            updateSettings({
              padding: e.target.value as PageBlock['settings']['padding'],
            })
          }
          className="w-full px-3 py-2 border border-gray-300 text-sm focus:border-black focus:outline-none"
        >
          <option value="none">None</option>
          <option value="sm">Small</option>
          <option value="md">Medium</option>
          <option value="lg">Large</option>
          <option value="xl">Extra Large</option>
        </select>
      </div>

      <div>
        <label className="block text-xs font-medium mb-1">Alignment</label>
        <select
          value={block.settings.alignment}
          onChange={(e) =>
            updateSettings({
              alignment: e.target.value as PageBlock['settings']['alignment'],
            })
          }
          className="w-full px-3 py-2 border border-gray-300 text-sm focus:border-black focus:outline-none"
        >
          <option value="left">Left</option>
          <option value="center">Center</option>
          <option value="right">Right</option>
        </select>
      </div>

      <div className="border-t pt-4 mt-4">
        {/* Block-specific content editors */}
        {block.type === 'hero' && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium mb-1">Title *</label>
              <input
                type="text"
                value={block.content.title}
                onChange={(e) => updateContent({ title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 text-sm focus:border-black focus:outline-none"
                placeholder="Hero title"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Subtitle</label>
              <input
                type="text"
                value={block.content.subtitle || ''}
                onChange={(e) => updateContent({ subtitle: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 text-sm focus:border-black focus:outline-none"
                placeholder="Hero subtitle"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">
                Background Image
              </label>
              {block.content.backgroundImage && (
                <div className="relative w-full h-24 mb-2 rounded overflow-hidden bg-gray-100">
                  <Image
                    src={block.content.backgroundImage}
                    alt="Background preview"
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => updateContent({ backgroundImage: '' })}
                    className="absolute top-1 right-1 px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                  >
                    Remove
                  </button>
                </div>
              )}
              <input
                ref={heroImageRef}
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file && onImageUpload) {
                    onImageUpload(file, 'backgroundImage')
                  }
                }}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => heroImageRef.current?.click()}
                disabled={uploading}
                className="w-full px-3 py-2 border-2 border-dashed border-gray-300 hover:border-gray-400 text-sm disabled:opacity-50 mb-2"
              >
                {uploading ? 'Uploading...' : 'Upload Image'}
              </button>
              <input
                type="url"
                value={block.content.backgroundImage}
                onChange={(e) =>
                  updateContent({ backgroundImage: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 text-sm focus:border-black focus:outline-none"
                placeholder="Or paste image URL"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">
                CTA Button Text
              </label>
              <input
                type="text"
                value={block.content.button?.text || ''}
                onChange={(e) =>
                  updateContent({
                    button: {
                      text: e.target.value,
                      href: block.content.button?.href || '',
                      variant: 'primary',
                    },
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 text-sm focus:border-black focus:outline-none"
                placeholder="Learn More"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">
                CTA Button Link
              </label>
              <input
                type="text"
                value={block.content.button?.href || ''}
                onChange={(e) =>
                  updateContent({
                    button: {
                      text: block.content.button?.text || '',
                      href: e.target.value,
                      variant: 'primary',
                    },
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 text-sm focus:border-black focus:outline-none"
                placeholder="/contact"
              />
            </div>
          </div>
        )}

        {block.type === 'text' && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium mb-1">Heading</label>
              <input
                type="text"
                value={block.content.heading || ''}
                onChange={(e) => updateContent({ heading: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 text-sm focus:border-black focus:outline-none"
                placeholder="Section heading"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Body *</label>
              <textarea
                value={block.content.body}
                onChange={(e) => updateContent({ body: e.target.value })}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 text-sm focus:border-black focus:outline-none"
                placeholder="Text content"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id={`html-${block.id}`}
                checked={block.content.isHtml || false}
                onChange={(e) => updateContent({ isHtml: e.target.checked })}
                className="w-4 h-4"
              />
              <label htmlFor={`html-${block.id}`} className="text-xs">
                Contains HTML
              </label>
            </div>
          </div>
        )}

        {block.type === 'image' && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium mb-1">
                Image *
              </label>
              {block.content.image.url && (
                <div className="relative w-full h-32 mb-2 rounded overflow-hidden bg-gray-100">
                  <Image
                    src={block.content.image.url}
                    alt={block.content.image.alt || 'Preview'}
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      updateContent({
                        image: { ...block.content.image, url: '' },
                      })
                    }
                    className="absolute top-1 right-1 px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                  >
                    Remove
                  </button>
                </div>
              )}
              <input
                ref={imageRef}
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file && onImageUpload) {
                    onImageUpload(file, 'url')
                  }
                }}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => imageRef.current?.click()}
                disabled={uploading}
                className="w-full px-3 py-2 border-2 border-dashed border-gray-300 hover:border-gray-400 text-sm disabled:opacity-50 mb-2"
              >
                {uploading ? 'Uploading...' : 'Upload Image'}
              </button>
              <input
                type="url"
                value={block.content.image.url}
                onChange={(e) =>
                  updateContent({
                    image: { ...block.content.image, url: e.target.value },
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 text-sm focus:border-black focus:outline-none"
                placeholder="Or paste image URL"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">
                Alt Text *
              </label>
              <input
                type="text"
                value={block.content.image.alt}
                onChange={(e) =>
                  updateContent({
                    image: { ...block.content.image, alt: e.target.value },
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 text-sm focus:border-black focus:outline-none"
                placeholder="Image description"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Caption</label>
              <input
                type="text"
                value={block.content.image.caption || ''}
                onChange={(e) =>
                  updateContent({
                    image: { ...block.content.image, caption: e.target.value },
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 text-sm focus:border-black focus:outline-none"
                placeholder="Optional caption"
              />
            </div>
          </div>
        )}

        {block.type === 'gallery' && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium mb-1">
                Gallery Title
              </label>
              <input
                type="text"
                value={block.content.title || ''}
                onChange={(e) => updateContent({ title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 text-sm focus:border-black focus:outline-none"
                placeholder="Gallery title"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Columns</label>
              <select
                value={block.content.columns}
                onChange={(e) =>
                  updateContent({ columns: parseInt(e.target.value) as 2 | 3 | 4 })
                }
                className="w-full px-3 py-2 border border-gray-300 text-sm focus:border-black focus:outline-none"
              >
                <option value="2">2 columns</option>
                <option value="3">3 columns</option>
                <option value="4">4 columns</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-2">Images</label>
              <div className="space-y-2 mb-2">
                {block.content.images.map((img, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 p-2 border border-gray-200 rounded"
                  >
                    {img.url && (
                      <div className="relative w-12 h-12 flex-shrink-0">
                        <Image
                          src={img.url}
                          alt={img.alt || `Image ${idx + 1}`}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                    )}
                    <div className="flex-1 text-xs text-gray-600 truncate">
                      {img.alt || `Image ${idx + 1}`}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const newImages = block.content.images.filter(
                          (_, i) => i !== idx
                        )
                        updateContent({ images: newImages })
                      }}
                      className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
              <input
                ref={galleryRef}
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file && onGalleryImageUpload) {
                    onGalleryImageUpload(file)
                  }
                }}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => galleryRef.current?.click()}
                disabled={uploading}
                className="w-full px-3 py-2 border-2 border-dashed border-gray-300 hover:border-gray-400 text-sm disabled:opacity-50"
              >
                {uploading ? 'Uploading...' : 'Add Image to Gallery'}
              </button>
            </div>
          </div>
        )}

        {block.type === 'cta' && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium mb-1">
                Heading *
              </label>
              <input
                type="text"
                value={block.content.heading}
                onChange={(e) => updateContent({ heading: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 text-sm focus:border-black focus:outline-none"
                placeholder="CTA heading"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">
                Description
              </label>
              <textarea
                value={block.content.description || ''}
                onChange={(e) => updateContent({ description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 text-sm focus:border-black focus:outline-none"
                placeholder="Supporting text"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">
                Button Text *
              </label>
              <input
                type="text"
                value={block.content.button.text}
                onChange={(e) =>
                  updateContent({
                    button: { ...block.content.button, text: e.target.value },
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 text-sm focus:border-black focus:outline-none"
                placeholder="Click here"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">
                Button Link
              </label>
              <input
                type="url"
                value={block.content.button.href}
                onChange={(e) =>
                  updateContent({
                    button: { ...block.content.button, href: e.target.value },
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 text-sm focus:border-black focus:outline-none"
                placeholder="/contact or https://..."
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
