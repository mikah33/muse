import Image from 'next/image'
import { notFound } from 'next/navigation'
import HeaderWrapper from '@/components/shared/HeaderWrapper'
import Footer from '@/components/shared/Footer'
import { createClient } from '@/lib/supabase/server'

interface PortfolioDetailPageProps {
  params: Promise<{
    slug: string
  }>
}

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function PortfolioDetailPage({ params }: PortfolioDetailPageProps) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: portfolioItem, error } = await supabase
    .from('portfolio_items')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (error || !portfolioItem) {
    notFound()
  }

  return (
    <>
      <HeaderWrapper />
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <div className="bg-charcoal text-white py-24 md:py-32 px-6 md:px-8 pt-32 md:pt-40">
          <div className="max-w-7xl mx-auto">
            {portfolioItem.category && (
              <div className="text-xs tracking-[0.2em] text-gray-400 mb-4">
                {portfolioItem.category.toUpperCase()}
              </div>
            )}
            <h1 className="font-serif text-5xl md:text-6xl mb-6">{portfolioItem.title}</h1>
            {portfolioItem.description && (
              <p className="text-xl text-gray-300 max-w-2xl">
                {portfolioItem.description}
              </p>
            )}
          </div>
        </div>

        {/* Main Image */}
        <div className="max-w-7xl mx-auto px-8 py-20">
          <div className="relative aspect-[16/9] w-full overflow-hidden bg-gray-100">
            <Image
              src={portfolioItem.image_url}
              alt={portfolioItem.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Additional Content */}
          {portfolioItem.content && (
            <div className="mt-16 prose prose-lg max-w-none">
              <div dangerouslySetInnerHTML={{ __html: portfolioItem.content }} />
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  )
}
