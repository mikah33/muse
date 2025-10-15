import type { PageBlock } from '@/types/page-builder'
import HeroBlock from './blocks/HeroBlock'
import TextBlock from './blocks/TextBlock'
import ImageBlock from './blocks/ImageBlock'
import GalleryBlock from './blocks/GalleryBlock'
import CTABlock from './blocks/CTABlock'

interface BlockRendererProps {
  blocks: PageBlock[]
}

export default function BlockRenderer({ blocks }: BlockRendererProps) {
  // Sort blocks by order_position
  const sortedBlocks = [...blocks].sort((a, b) => a.order_position - b.order_position)

  const getSpacingClass = (size?: string): string => {
    const spacingMap = {
      none: '0',
      sm: '4',
      md: '8',
      lg: '16',
      xl: '24',
    }
    return spacingMap[size as keyof typeof spacingMap] || spacingMap.md
  }

  const renderBlock = (block: PageBlock) => {
    // Skip inactive blocks
    if (block.is_active === false) {
      return null
    }

    // Apply responsive visibility
    const visibilityClasses = []
    if (block.visibility?.mobile === false) visibilityClasses.push('hidden md:block')
    if (block.visibility?.tablet === false) visibilityClasses.push('md:hidden lg:block')
    if (block.visibility?.desktop === false) visibilityClasses.push('lg:hidden')

    // Apply spacing
    const spacing = block.spacing || { top: 'md', bottom: 'md' }
    const spacingClasses = [
      spacing.top ? `pt-${getSpacingClass(spacing.top)}` : '',
      spacing.bottom ? `pb-${getSpacingClass(spacing.bottom)}` : '',
      spacing.left ? `pl-${getSpacingClass(spacing.left)}` : '',
      spacing.right ? `pr-${getSpacingClass(spacing.right)}` : '',
    ].filter(Boolean).join(' ')

    let BlockComponent

    switch (block.block_type) {
      case 'hero':
        BlockComponent = HeroBlock
        break
      case 'text':
        BlockComponent = TextBlock
        break
      case 'image':
        BlockComponent = ImageBlock
        break
      case 'gallery':
        BlockComponent = GalleryBlock
        break
      case 'cta':
        BlockComponent = CTABlock
        break
      default:
        console.warn(`Unknown block type: ${block.block_type}`)
        return null
    }

    return (
      <div
        key={block.id}
        className={`${visibilityClasses.join(' ')} ${spacingClasses}`}
      >
        <BlockComponent block={block} />
      </div>
    )
  }

  return (
    <div className="w-full">
      {sortedBlocks.map(renderBlock)}
    </div>
  )
}
