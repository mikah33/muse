import Image from 'next/image'
import Link from 'next/link'
import type { PageBlock, ImageBlockProps } from '@/types/page-builder'

interface ImageBlockComponentProps {
  block: PageBlock
}

export default function ImageBlock({ block }: ImageBlockComponentProps) {
  const props = block.props as ImageBlockProps

  // Don't render if there's no image URL
  if (!props.url || props.url.trim() === '') {
    return null
  }

  const aspectRatioClasses = {
    '16/9': 'aspect-video',
    '4/3': 'aspect-4/3',
    '1/1': 'aspect-square',
    '3/2': 'aspect-3/2',
    'auto': '',
  }

  const fitClasses = {
    cover: 'object-cover',
    contain: 'object-contain',
    fill: 'object-fill',
  }

  const aspectRatio = props.aspectRatio || 'auto'
  const fit = props.fit || 'cover'

  const imageElement = (
    <div
      className={`relative w-full ${aspectRatioClasses[aspectRatio]} ${block.background_color || ''}`}
      style={block.background_color?.startsWith('#') ? { backgroundColor: block.background_color } : undefined}
    >
      <Image
        src={props.url}
        alt={props.alt}
        width={props.width || 1200}
        height={props.height || 800}
        className={`${fitClasses[fit]} ${aspectRatio === 'auto' ? 'w-full h-auto' : 'w-full h-full'}`}
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
      />
      {props.caption && (
        <p className="text-sm text-gray-600 mt-2 italic text-center">
          {props.caption}
        </p>
      )}
    </div>
  )

  if (props.clickable && props.linkUrl) {
    return (
      <Link
        href={props.linkUrl}
        className="block transition-opacity hover:opacity-90"
      >
        {imageElement}
      </Link>
    )
  }

  return imageElement
}
