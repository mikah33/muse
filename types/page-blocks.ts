/**
 * Page Builder Block System Type Definitions
 *
 * This file defines TypeScript interfaces for the page builder block system,
 * supporting a flexible, component-based page layout system with monotone theming.
 */

// ============================================================================
// Base Types and Enums
// ============================================================================

/**
 * Background color options for blocks (monotone theme)
 */
export type BlockBackground = 'white' | 'gray-50' | 'black'

/**
 * Padding size options for blocks
 */
export type BlockPadding = 'none' | 'sm' | 'md' | 'lg' | 'xl'

/**
 * Text and content alignment options
 */
export type BlockAlignment = 'left' | 'center' | 'right'

/**
 * Available block types in the page builder
 */
export type BlockType = 'hero' | 'text' | 'image' | 'gallery' | 'cta'

/**
 * Gallery column layout options
 */
export type GalleryColumns = 2 | 3 | 4

/**
 * Button style variants
 */
export type ButtonVariant = 'primary' | 'secondary' | 'outline'

// ============================================================================
// Common Block Settings
// ============================================================================

/**
 * Common settings shared across all block types
 * Controls visual styling and layout properties
 */
export interface BlockSettings {
  /** Background color of the block */
  background: BlockBackground
  /** Vertical padding of the block */
  padding: BlockPadding
  /** Content alignment within the block */
  alignment: BlockAlignment
}

/**
 * Button configuration for CTA elements
 */
export interface ButtonConfig {
  /** Button display text */
  text: string
  /** Button link URL */
  href: string
  /** Button style variant */
  variant: ButtonVariant
  /** Whether to open link in new tab */
  openInNewTab?: boolean
}

/**
 * Image data configuration
 */
export interface ImageConfig {
  /** Image URL (Supabase storage URL or external) */
  url: string
  /** Alt text for accessibility */
  alt: string
  /** Optional caption displayed below image */
  caption?: string
}

// ============================================================================
// Block Type Definitions
// ============================================================================

/**
 * Hero Block - Full-width section with background image, title, subtitle, and CTA
 * Typically used at the top of pages for impact and engagement
 */
export interface HeroBlock {
  /** Unique identifier for the block */
  id: string
  /** Block type discriminator */
  type: 'hero'
  /** Visual and layout settings */
  settings: BlockSettings
  /** Hero-specific content */
  content: {
    /** Background image URL */
    backgroundImage: string
    /** Main heading text */
    title: string
    /** Supporting subtitle text */
    subtitle?: string
    /** Optional call-to-action button */
    button?: ButtonConfig
    /** Overlay opacity (0-100) for text readability */
    overlayOpacity?: number
  }
}

/**
 * Text Block - Heading and body text with HTML/Markdown support
 * Used for content sections, articles, and text-heavy pages
 */
export interface TextBlock {
  /** Unique identifier for the block */
  id: string
  /** Block type discriminator */
  type: 'text'
  /** Visual and layout settings */
  settings: BlockSettings
  /** Text-specific content */
  content: {
    /** Section heading (optional) */
    heading?: string
    /** Main body text - supports HTML and Markdown */
    body: string
    /** Whether body contains HTML (true) or plain text/Markdown (false) */
    isHtml?: boolean
  }
}

/**
 * Image Block - Single image with optional caption
 * Used for standalone images, featured photos, or visual breaks
 */
export interface ImageBlock {
  /** Unique identifier for the block */
  id: string
  /** Block type discriminator */
  type: 'image'
  /** Visual and layout settings */
  settings: BlockSettings
  /** Image-specific content */
  content: {
    /** Image configuration */
    image: ImageConfig
    /** Maximum width constraint (px or 'full') */
    maxWidth?: number | 'full'
  }
}

/**
 * Gallery Block - Multi-image grid layout
 * Used for photo galleries, portfolio showcases, and image collections
 */
export interface GalleryBlock {
  /** Unique identifier for the block */
  id: string
  /** Block type discriminator */
  type: 'gallery'
  /** Visual and layout settings */
  settings: BlockSettings
  /** Gallery-specific content */
  content: {
    /** Array of images to display in gallery */
    images: ImageConfig[]
    /** Number of columns in the grid */
    columns: GalleryColumns
    /** Gap spacing between images */
    gap?: 'sm' | 'md' | 'lg'
    /** Optional gallery title */
    title?: string
  }
}

/**
 * CTA Block - Call-to-action section with button
 * Used for conversions, engagement, and directing user actions
 */
export interface CTABlock {
  /** Unique identifier for the block */
  id: string
  /** Block type discriminator */
  type: 'cta'
  /** Visual and layout settings */
  settings: BlockSettings
  /** CTA-specific content */
  content: {
    /** Main heading text */
    heading: string
    /** Supporting description text */
    description?: string
    /** Primary action button */
    button: ButtonConfig
    /** Optional secondary button */
    secondaryButton?: ButtonConfig
  }
}

// ============================================================================
// Union Types and Collections
// ============================================================================

/**
 * Union type of all possible block types
 * Used for type-safe block handling and rendering
 */
export type PageBlock = HeroBlock | TextBlock | ImageBlock | GalleryBlock | CTABlock

/**
 * Complete page blocks data structure
 * Represents the full blocks array stored in the database
 */
export interface PageBlocksData {
  /** Array of page blocks in display order */
  blocks: PageBlock[]
  /** Page metadata version for schema migrations */
  version?: string
}

// ============================================================================
// Type Guards
// ============================================================================

/**
 * Type guard to check if a block is a HeroBlock
 * @param block - Block to check
 * @returns True if block is a HeroBlock
 */
export function isHeroBlock(block: PageBlock): block is HeroBlock {
  return block.type === 'hero'
}

/**
 * Type guard to check if a block is a TextBlock
 * @param block - Block to check
 * @returns True if block is a TextBlock
 */
export function isTextBlock(block: PageBlock): block is TextBlock {
  return block.type === 'text'
}

/**
 * Type guard to check if a block is an ImageBlock
 * @param block - Block to check
 * @returns True if block is an ImageBlock
 */
export function isImageBlock(block: PageBlock): block is ImageBlock {
  return block.type === 'image'
}

/**
 * Type guard to check if a block is a GalleryBlock
 * @param block - Block to check
 * @returns True if block is a GalleryBlock
 */
export function isGalleryBlock(block: PageBlock): block is GalleryBlock {
  return block.type === 'gallery'
}

/**
 * Type guard to check if a block is a CTABlock
 * @param block - Block to check
 * @returns True if block is a CTABlock
 */
export function isCTABlock(block: PageBlock): block is CTABlock {
  return block.type === 'cta'
}

// ============================================================================
// Validation Helpers
// ============================================================================

/**
 * Default block settings following monotone theme
 */
export const DEFAULT_BLOCK_SETTINGS: BlockSettings = {
  background: 'white',
  padding: 'md',
  alignment: 'left',
}

/**
 * Validates if a background value is valid
 * @param value - Background value to validate
 * @returns True if valid
 */
export function isValidBackground(value: string): value is BlockBackground {
  return ['white', 'gray-50', 'black'].includes(value)
}

/**
 * Validates if a padding value is valid
 * @param value - Padding value to validate
 * @returns True if valid
 */
export function isValidPadding(value: string): value is BlockPadding {
  return ['none', 'sm', 'md', 'lg', 'xl'].includes(value)
}

/**
 * Validates if an alignment value is valid
 * @param value - Alignment value to validate
 * @returns True if valid
 */
export function isValidAlignment(value: string): value is BlockAlignment {
  return ['left', 'center', 'right'].includes(value)
}

/**
 * Validates if a block type is supported
 * @param value - Block type to validate
 * @returns True if valid
 */
export function isValidBlockType(value: string): value is BlockType {
  return ['hero', 'text', 'image', 'gallery', 'cta'].includes(value)
}

/**
 * Validates if gallery columns value is valid
 * @param value - Columns value to validate
 * @returns True if valid
 */
export function isValidGalleryColumns(value: number): value is GalleryColumns {
  return [2, 3, 4].includes(value)
}

// ============================================================================
// Factory Functions
// ============================================================================

/**
 * Creates a new HeroBlock with default values
 * @param partial - Partial HeroBlock data to merge with defaults
 * @returns Complete HeroBlock
 */
export function createHeroBlock(partial?: Partial<HeroBlock>): HeroBlock {
  return {
    id: crypto.randomUUID(),
    type: 'hero',
    settings: { ...DEFAULT_BLOCK_SETTINGS },
    content: {
      backgroundImage: '',
      title: '',
      subtitle: '',
      overlayOpacity: 50,
    },
    ...partial,
  }
}

/**
 * Creates a new TextBlock with default values
 * @param partial - Partial TextBlock data to merge with defaults
 * @returns Complete TextBlock
 */
export function createTextBlock(partial?: Partial<TextBlock>): TextBlock {
  return {
    id: crypto.randomUUID(),
    type: 'text',
    settings: { ...DEFAULT_BLOCK_SETTINGS },
    content: {
      heading: '',
      body: '',
      isHtml: false,
    },
    ...partial,
  }
}

/**
 * Creates a new ImageBlock with default values
 * @param partial - Partial ImageBlock data to merge with defaults
 * @returns Complete ImageBlock
 */
export function createImageBlock(partial?: Partial<ImageBlock>): ImageBlock {
  return {
    id: crypto.randomUUID(),
    type: 'image',
    settings: { ...DEFAULT_BLOCK_SETTINGS, alignment: 'center' },
    content: {
      image: {
        url: '',
        alt: '',
      },
      maxWidth: 'full',
    },
    ...partial,
  }
}

/**
 * Creates a new GalleryBlock with default values
 * @param partial - Partial GalleryBlock data to merge with defaults
 * @returns Complete GalleryBlock
 */
export function createGalleryBlock(partial?: Partial<GalleryBlock>): GalleryBlock {
  return {
    id: crypto.randomUUID(),
    type: 'gallery',
    settings: { ...DEFAULT_BLOCK_SETTINGS },
    content: {
      images: [],
      columns: 3,
      gap: 'md',
    },
    ...partial,
  }
}

/**
 * Creates a new CTABlock with default values
 * @param partial - Partial CTABlock data to merge with defaults
 * @returns Complete CTABlock
 */
export function createCTABlock(partial?: Partial<CTABlock>): CTABlock {
  return {
    id: crypto.randomUUID(),
    type: 'cta',
    settings: { ...DEFAULT_BLOCK_SETTINGS, alignment: 'center', background: 'gray-50' },
    content: {
      heading: '',
      description: '',
      button: {
        text: '',
        href: '',
        variant: 'primary',
      },
    },
    ...partial,
  }
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Gets the CSS class name for a background color
 * @param background - Background color value
 * @returns Tailwind CSS class name
 */
export function getBackgroundClass(background: BlockBackground): string {
  const classes: Record<BlockBackground, string> = {
    white: 'bg-white',
    'gray-50': 'bg-gray-50',
    black: 'bg-black text-white',
  }
  return classes[background]
}

/**
 * Gets the CSS class name for padding
 * @param padding - Padding size value
 * @returns Tailwind CSS class name
 */
export function getPaddingClass(padding: BlockPadding): string {
  const classes: Record<BlockPadding, string> = {
    none: 'py-0',
    sm: 'py-8',
    md: 'py-16',
    lg: 'py-24',
    xl: 'py-32',
  }
  return classes[padding]
}

/**
 * Gets the CSS class name for alignment
 * @param alignment - Alignment value
 * @returns Tailwind CSS class name
 */
export function getAlignmentClass(alignment: BlockAlignment): string {
  const classes: Record<BlockAlignment, string> = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }
  return classes[alignment]
}

/**
 * Serializes blocks data for database storage
 * @param data - PageBlocksData to serialize
 * @returns JSON string
 */
export function serializeBlocksData(data: PageBlocksData): string {
  return JSON.stringify(data)
}

/**
 * Deserializes blocks data from database storage
 * @param json - JSON string from database
 * @returns PageBlocksData object or null if invalid
 */
export function deserializeBlocksData(json: string): PageBlocksData | null {
  try {
    const data = JSON.parse(json) as PageBlocksData
    if (!data.blocks || !Array.isArray(data.blocks)) {
      return null
    }
    return data
  } catch {
    return null
  }
}
