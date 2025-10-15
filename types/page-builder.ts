// Page Builder Type Definitions
// Based on page_blocks schema from database

export type BlockType =
  | 'hero'
  | 'text'
  | 'image'
  | 'gallery'
  | 'cta'
  | 'spacer'
  | 'divider'
  | 'columns'
  | 'quote'
  | 'video'

export type Alignment = 'left' | 'center' | 'right'

export type SpacingSize = 'none' | 'sm' | 'md' | 'lg' | 'xl'

export interface Spacing {
  top?: SpacingSize
  bottom?: SpacingSize
  left?: SpacingSize
  right?: SpacingSize
}

export interface Visibility {
  mobile?: boolean
  tablet?: boolean
  desktop?: boolean
}

// Base PageBlock interface
export interface PageBlock {
  id: string
  page_id: string
  block_type: BlockType
  order_position: number
  props: Record<string, any>
  spacing?: Spacing
  alignment?: Alignment
  background_color?: string
  visibility?: Visibility
  version?: number
  is_active?: boolean
  created_at?: string
  updated_at?: string
}

// Block-specific prop interfaces
export interface HeroBlockProps {
  title: string
  subtitle?: string
  backgroundImage?: string
  ctaText?: string
  ctaLink?: string
  secondaryCtaText?: string
  secondaryCtaLink?: string
  height?: 'small' | 'medium' | 'large' | 'full'
  textColor?: string
  overlay?: 'none' | 'light' | 'dark' | 'gradient'
}

export interface TextBlockProps {
  heading?: string
  headingLevel?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  body: string
  isHtml?: boolean
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
}

export interface ImageBlockProps {
  url: string
  alt: string
  caption?: string
  width?: number
  height?: number
  aspectRatio?: '16/9' | '4/3' | '1/1' | '3/2' | 'auto'
  fit?: 'cover' | 'contain' | 'fill'
  clickable?: boolean
  linkUrl?: string
}

export interface GalleryBlockProps {
  images: Array<{
    url: string
    alt: string
    caption?: string
    width?: number
    height?: number
  }>
  columns?: 2 | 3 | 4
  gap?: SpacingSize
  aspectRatio?: '16/9' | '4/3' | '1/1' | '3/2' | 'auto'
  clickable?: boolean
}

export interface CTABlockProps {
  heading: string
  description?: string
  ctaText: string
  ctaLink?: string
  ctaAction?: 'link' | 'modal' | 'scroll'
  ctaTarget?: string
  secondaryCtaText?: string
  secondaryCtaLink?: string
  variant?: 'default' | 'dark' | 'gradient'
}
