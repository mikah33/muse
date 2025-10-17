import BlockRenderer from '@/components/page-builder/BlockRenderer'
import { PAGE_TEMPLATES, type PageBlock as TemplateBlock } from '@/lib/page-templates'
import type { PageBlock, BlockType } from '@/types/page-builder'

/**
 * Convert template block format to database schema format
 * Templates use: { type, content, order }
 * Database uses: { block_type, props, order_position }
 */
function convertTemplateToBlocks(templateBlocks: TemplateBlock[]): PageBlock[] {
  // Filter out unsupported block types
  const supportedTypes: BlockType[] = ['hero', 'text', 'image', 'gallery', 'cta', 'spacer', 'divider', 'columns', 'quote', 'video']

  return templateBlocks
    .filter((block) => {
      if (!supportedTypes.includes(block.type as BlockType)) {
        console.warn(`Skipping unsupported block type: ${block.type}`)
        return false
      }
      return true
    })
    .map((block) => {
    const { id, type, content, order } = block

    // Map old content properties to new props structure
    let props: Record<string, any> = {}

    switch (type) {
      case 'hero':
        props = {
          title: content.title || '',
          subtitle: content.subtitle,
          backgroundImage: content.imageUrl,
          height: content.height || 'medium',
          textColor: content.textColor,
          overlay: 'dark',
        }
        break

      case 'text':
        props = {
          heading: content.title,
          headingLevel: 'h2' as const,
          body: content.body || '',
          isHtml: false,
          maxWidth: 'lg' as const,
        }
        break

      case 'image':
        props = {
          url: content.imageUrl || '',
          alt: content.imageAlt || '',
          aspectRatio: '16/9' as const,
          fit: 'cover' as const,
        }
        break

      case 'cta':
        props = {
          heading: content.title || '',
          description: content.subtitle,
          ctaText: content.buttonText || '',
          ctaLink: content.buttonLink,
          ctaAction: 'link' as const,
          variant: 'default' as const,
        }
        break

      case 'gallery':
        // Gallery blocks need special handling
        props = {
          images: [],
          columns: 3,
          gap: 'md' as const,
          aspectRatio: '1/1' as const,
        }
        break

      default:
        console.warn(`Unknown block type: ${type}`)
    }

    return {
      id,
      page_id: 'test-page',
      block_type: type as BlockType,
      order_position: order,
      props,
      spacing: {
        top: 'md',
        bottom: 'md',
      },
      alignment: content.alignment as 'left' | 'center' | 'right' | undefined,
      background_color: content.backgroundColor,
      visibility: {
        mobile: true,
        tablet: true,
        desktop: true,
      },
      is_active: true,
    }
  })
}

export default function TestBlocksPage() {
  // Get the About template
  const aboutTemplate = PAGE_TEMPLATES.find(t => t.id === 'about-page')

  if (!aboutTemplate) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Block Renderer Test</h1>
        <p className="text-red-600">About template not found</p>
      </div>
    )
  }

  // Convert template blocks to database schema format
  const blocks = convertTemplateToBlocks(aboutTemplate.blocks)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 py-4 px-6 mb-8">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold text-gray-900">Block Renderer Test</h1>
          <p className="text-gray-600 mt-1">
            Testing: <span className="font-semibold">{aboutTemplate.name}</span>
          </p>
          <p className="text-sm text-gray-500 mt-2">
            {aboutTemplate.description}
          </p>
        </div>
      </div>

      <div className="container mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">Template Info</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Template ID:</span>
              <span className="ml-2 font-mono text-gray-900">{aboutTemplate.id}</span>
            </div>
            <div>
              <span className="text-gray-600">Category:</span>
              <span className="ml-2 font-mono text-gray-900">{aboutTemplate.category}</span>
            </div>
            <div>
              <span className="text-gray-600">Total Blocks:</span>
              <span className="ml-2 font-mono text-gray-900">{blocks.length}</span>
            </div>
            <div>
              <span className="text-gray-600">Block Types:</span>
              <span className="ml-2 font-mono text-gray-900">
                {Array.from(new Set(blocks.map(b => b.block_type))).join(', ')}
              </span>
            </div>
          </div>
        </div>
      </div>

      <BlockRenderer blocks={blocks} />

      <div className="container mx-auto mt-8 mb-8">
        <div className="bg-gray-100 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">Converted Blocks JSON</h2>
          <pre className="bg-white p-4 rounded border border-gray-200 overflow-x-auto text-xs">
            {JSON.stringify(blocks, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  )
}
