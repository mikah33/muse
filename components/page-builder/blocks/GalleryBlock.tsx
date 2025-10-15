import Image from 'next/image'
import type { PageBlock, GalleryBlockProps } from '@/types/page-builder'

interface GalleryBlockComponentProps {
  block: PageBlock
}

export default function GalleryBlock({ block }: GalleryBlockComponentProps) {
  const props = block.props as GalleryBlockProps

  // Don't render if there are no images or all images are empty
  if (!props.images || props.images.length === 0 || props.images.every(img => !img.url || img.url.trim() === '')) {
    return null
  }

  const columnClasses = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  }

  const gapClasses = {
    none: 'gap-0',
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8',
  }

  const aspectRatioClasses = {
    '16/9': 'aspect-video',
    '4/3': 'aspect-4/3',
    '1/1': 'aspect-square',
    '3/2': 'aspect-3/2',
    'auto': '',
  }

  const columns = props.columns || 3
  const gap = props.gap || 'md'
  const aspectRatio = props.aspectRatio || '1/1'

  return (
    <div
      className={`grid ${columnClasses[columns]} ${gapClasses[gap]} ${block.background_color || ''}`}
      style={block.background_color?.startsWith('#') ? { backgroundColor: block.background_color } : undefined}
    >
      {props.images.filter(img => img.url && img.url.trim() !== '').map((image, index) => (
        <div
          key={index}
          className={`relative ${aspectRatioClasses[aspectRatio]} overflow-hidden group ${props.clickable ? 'cursor-pointer' : ''}`}
        >
          <Image
            src={image.url}
            alt={image.alt || 'Gallery image'}
            width={image.width || 800}
            height={image.height || 800}
            className={`${aspectRatio === 'auto' ? 'w-full h-auto' : 'w-full h-full object-cover'} ${props.clickable ? 'transition-transform duration-300 group-hover:scale-105' : ''}`}
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
          />
          {image.caption && (
            <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-2 text-sm text-center opacity-0 group-hover:opacity-100 transition-opacity">
              {image.caption}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
