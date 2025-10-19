import { HeroOptimizerConfig } from './types'

export const HERO_OPTIMIZER_CONFIG: HeroOptimizerConfig = {
  breakpoints: {
    mobile: { width: 768, height: 1024, quality: 85 },
    tablet: { width: 1024, height: 768, quality: 85 },
    desktop: { width: 1920, height: 1080, quality: 90 },
  },
  formats: ['avif', 'webp', 'jpeg'],
  optimization: {
    stripMetadata: true,
    progressive: true,
    chromaSubsampling: '4:2:0',
  },
}

export const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
export const MIN_DIMENSIONS = { width: 1920, height: 1080 }
export const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp']
