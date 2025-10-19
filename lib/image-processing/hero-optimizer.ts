import sharp from 'sharp'
import { createClient } from '@/lib/supabase/server'
import { HERO_OPTIMIZER_CONFIG } from './config'
import type { ProcessedImages, BreakpointConfig, StorageMetadata } from './types'

export class HeroOptimizer {
  private config = HERO_OPTIMIZER_CONFIG

  async processHeroImage(fileBuffer: Buffer, originalName: string): Promise<ProcessedImages> {
    const timestamp = Date.now()
    const supabase = await createClient()

    // Upload original
    const originalPath = `hero/original/hero-${timestamp}-${originalName}`
    const { data: originalUpload, error: originalError } = await supabase.storage
      .from('site-images')
      .upload(originalPath, fileBuffer, {
        contentType: 'image/jpeg',
        cacheControl: '31536000',
      })

    if (originalError) throw new Error(`Failed to upload original: ${originalError.message}`)

    const { data: { publicUrl: originalUrl } } = supabase.storage
      .from('site-images')
      .getPublicUrl(originalPath)

    // Get original metadata
    const originalMetadata = await sharp(fileBuffer).metadata()

    const processedImages: ProcessedImages = {
      original: {
        url: originalUrl,
        size: fileBuffer.length,
        width: originalMetadata.width,
        height: originalMetadata.height,
        uploadedAt: new Date().toISOString(),
      },
      variants: {
        desktop: { avif: { url: '', size: 0 }, webp: { url: '', size: 0 }, jpg: { url: '', size: 0 } },
        tablet: { avif: { url: '', size: 0 }, webp: { url: '', size: 0 }, jpg: { url: '', size: 0 } },
        mobile: { avif: { url: '', size: 0 }, webp: { url: '', size: 0 }, jpg: { url: '', size: 0 } },
      },
    }

    // Process each breakpoint
    for (const [breakpointName, breakpointConfig] of Object.entries(this.config.breakpoints)) {
      const variants = await this.generateVariants(
        fileBuffer,
        breakpointName,
        breakpointConfig,
        timestamp
      )

      processedImages.variants[breakpointName as keyof typeof processedImages.variants] = variants
    }

    return processedImages
  }

  private async generateVariants(
    buffer: Buffer,
    breakpointName: string,
    config: BreakpointConfig,
    timestamp: number
  ): Promise<{ avif: StorageMetadata; webp: StorageMetadata; jpg: StorageMetadata }> {
    const supabase = await createClient()
    const variants: any = {}

    // Resize and optimize base image
    const resizedImage = sharp(buffer)
      .resize(config.width, config.height, {
        fit: 'cover',
        position: 'center',
      })

    // Generate AVIF
    const avifBuffer = await resizedImage
      .clone()
      .avif({ quality: config.quality })
      .toBuffer()

    const avifPath = `hero/${breakpointName}/hero-${timestamp}-${config.width}w.avif`
    const { error: avifError } = await supabase.storage
      .from('site-images')
      .upload(avifPath, avifBuffer, {
        contentType: 'image/avif',
        cacheControl: '31536000',
      })

    if (avifError) throw new Error(`Failed to upload AVIF: ${avifError.message}`)

    const { data: { publicUrl: avifUrl } } = supabase.storage
      .from('site-images')
      .getPublicUrl(avifPath)

    variants.avif = { url: avifUrl, size: avifBuffer.length }

    // Generate WebP
    const webpBuffer = await resizedImage
      .clone()
      .webp({ quality: config.quality + 5 })
      .toBuffer()

    const webpPath = `hero/${breakpointName}/hero-${timestamp}-${config.width}w.webp`
    const { error: webpError } = await supabase.storage
      .from('site-images')
      .upload(webpPath, webpBuffer, {
        contentType: 'image/webp',
        cacheControl: '31536000',
      })

    if (webpError) throw new Error(`Failed to upload WebP: ${webpError.message}`)

    const { data: { publicUrl: webpUrl } } = supabase.storage
      .from('site-images')
      .getPublicUrl(webpPath)

    variants.webp = { url: webpUrl, size: webpBuffer.length }

    // Generate JPEG
    const jpegBuffer = await resizedImage
      .clone()
      .jpeg({ quality: config.quality, progressive: true })
      .toBuffer()

    const jpegPath = `hero/${breakpointName}/hero-${timestamp}-${config.width}w.jpg`
    const { error: jpegError } = await supabase.storage
      .from('site-images')
      .upload(jpegPath, jpegBuffer, {
        contentType: 'image/jpeg',
        cacheControl: '31536000',
      })

    if (jpegError) throw new Error(`Failed to upload JPEG: ${jpegError.message}`)

    const { data: { publicUrl: jpegUrl } } = supabase.storage
      .from('site-images')
      .getPublicUrl(jpegPath)

    variants.jpg = { url: jpegUrl, size: jpegBuffer.length }

    return variants
  }
}

export const heroOptimizer = new HeroOptimizer()
