import type { PageBlock, TextBlockProps } from '@/types/page-builder'

interface TextBlockComponentProps {
  block: PageBlock
}

export default function TextBlock({ block }: TextBlockComponentProps) {
  const props = block.props as TextBlockProps

  const maxWidthClasses = {
    sm: 'max-w-2xl',
    md: 'max-w-4xl',
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
    full: 'max-w-full',
  }

  const alignmentClasses = {
    left: 'text-left',
    center: 'text-center mx-auto',
    right: 'text-right ml-auto',
  }

  const maxWidth = props.maxWidth || 'md'
  const alignment = block.alignment || 'left'
  const HeadingTag = props.headingLevel || 'h2'

  return (
    <div
      className={`px-6 ${maxWidthClasses[maxWidth]} ${alignmentClasses[alignment]} ${block.background_color || ''}`}
      style={block.background_color?.startsWith('#') ? { backgroundColor: block.background_color } : undefined}
    >
      {props.heading && (
        <HeadingTag className="font-serif text-3xl md:text-4xl lg:text-5xl mb-6 tracking-tight">
          {props.heading}
        </HeadingTag>
      )}

      {props.isHtml ? (
        <div
          className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:tracking-tight prose-a:text-black prose-a:underline hover:prose-a:text-gray-700"
          dangerouslySetInnerHTML={{ __html: props.body }}
        />
      ) : (
        <div className="text-base md:text-lg leading-relaxed whitespace-pre-wrap">
          {props.body}
        </div>
      )}
    </div>
  )
}
