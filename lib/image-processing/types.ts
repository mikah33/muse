export interface BreakpointConfig {
  width: number
  height: number
  quality: number
}

export interface HeroOptimizerConfig {
  breakpoints: {
    mobile: BreakpointConfig
    tablet: BreakpointConfig
    desktop: BreakpointConfig
  }
  formats: ('avif' | 'webp' | 'jpeg')[]
  optimization: {
    stripMetadata: boolean
    progressive: boolean
    chromaSubsampling: string
  }
}

export interface StorageMetadata {
  url: string
  size: number
  width?: number
  height?: number
}

export interface ProcessedImages {
  original: StorageMetadata & { uploadedAt: string }
  variants: {
    desktop: FormatVariants
    tablet: FormatVariants
    mobile: FormatVariants
  }
}

export interface FormatVariants {
  avif: StorageMetadata
  webp: StorageMetadata
  jpg: StorageMetadata
}
