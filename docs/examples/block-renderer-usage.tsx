/**
 * BlockRenderer Usage Examples
 *
 * This file demonstrates how to use the BlockRenderer component
 * to display custom page content built with the page builder.
 */

import BlockRenderer from '@/components/page-builder/BlockRenderer'
import type { PageBlock } from '@/types/page-builder'

// Example 1: Simple page with hero and text blocks
export function ExampleSimplePage() {
  const blocks: PageBlock[] = [
    {
      id: '1',
      page_id: 'page-1',
      block_type: 'hero',
      order_position: 0,
      props: {
        title: 'Welcome to Our Studio',
        subtitle: 'Professional Photography',
        backgroundImage: '/images/hero.jpg',
        ctaText: 'Book a Session',
        ctaLink: '/contact',
        secondaryCtaText: 'View Portfolio',
        secondaryCtaLink: '/portfolio',
        height: 'full',
        overlay: 'gradient',
      },
      spacing: { top: 'none', bottom: 'md' },
      alignment: 'center',
    },
    {
      id: '2',
      page_id: 'page-1',
      block_type: 'text',
      order_position: 1,
      props: {
        heading: 'About Our Services',
        headingLevel: 'h2',
        body: 'We specialize in professional headshots, modeling portfolios, and creative portraits.',
        maxWidth: 'md',
      },
      spacing: { top: 'lg', bottom: 'lg' },
      alignment: 'center',
    },
  ]

  return <BlockRenderer blocks={blocks} />
}

// Example 2: Gallery page with multiple blocks
export function ExampleGalleryPage() {
  const blocks: PageBlock[] = [
    {
      id: '1',
      page_id: 'page-2',
      block_type: 'text',
      order_position: 0,
      props: {
        heading: 'Our Work',
        headingLevel: 'h1',
        body: 'Browse through our portfolio of professional photography.',
        maxWidth: 'lg',
      },
      spacing: { top: 'xl', bottom: 'md' },
      alignment: 'center',
    },
    {
      id: '2',
      page_id: 'page-2',
      block_type: 'gallery',
      order_position: 1,
      props: {
        images: [
          { url: '/images/1.jpg', alt: 'Portrait 1' },
          { url: '/images/2.jpg', alt: 'Portrait 2' },
          { url: '/images/3.jpg', alt: 'Portrait 3' },
          { url: '/images/4.jpg', alt: 'Portrait 4' },
        ],
        columns: 3,
        gap: 'md',
        aspectRatio: '1/1',
        clickable: true,
      },
      spacing: { top: 'md', bottom: 'lg' },
    },
    {
      id: '3',
      page_id: 'page-2',
      block_type: 'cta',
      order_position: 2,
      props: {
        heading: 'Ready to Book?',
        description: 'Let us capture your best moments.',
        ctaText: 'Contact Us',
        ctaLink: '/contact',
        variant: 'dark',
      },
      spacing: { top: 'xl', bottom: 'xl' },
      alignment: 'center',
      background_color: 'bg-black',
    },
  ]

  return <BlockRenderer blocks={blocks} />
}

// Example 3: Fetching blocks from database
export async function ExampleDynamicPage({ slug }: { slug: string }) {
  // This would typically be done server-side
  const response = await fetch(`/api/pages/${slug}/blocks`)
  const blocks: PageBlock[] = await response.json()

  return <BlockRenderer blocks={blocks} />
}

// Example 4: Using BlockRenderer in a Next.js page
export async function ExampleNextJsPage({ params }: { params: { slug: string } }) {
  // Server component - fetch data directly
  const blocks: PageBlock[] = await getPageBlocks(params.slug)

  return (
    <main>
      <BlockRenderer blocks={blocks} />
    </main>
  )
}

// Mock function to simulate database fetch
async function getPageBlocks(slug: string): Promise<PageBlock[]> {
  // In a real app, this would query Supabase
  return []
}
