import Link from 'next/link'
import Image from 'next/image'
import Header from '@/components/shared/Header'
import Footer from '@/components/shared/Footer'
import { createClient } from '@/lib/supabase/server'

interface PortfolioItem {
  id: string
  slug: string
  title: string
  description: string
  image_url: string
  category: string
}

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function PortfolioPage() {
  const supabase = await createClient()

  const { data: portfolioItems } = await supabase
    .from('portfolio_items')
    .select('*')
    .eq('published', true)
    .order('order_position', { ascending: true })

  return (
    <>
      <Header />
      <div className="min-h-screen bg-white">
        {/* Header */}
        <div className="bg-charcoal text-white py-24 md:py-32 px-6 md:px-8 pt-32 md:pt-40">
          <div className="max-w-7xl mx-auto">
            <h1 className="font-serif text-5xl md:text-6xl mb-6">Portfolio</h1>
            <p className="text-xl text-gray-300 max-w-2xl">
              A curated collection of our finest work in fashion and beauty photography
            </p>
          </div>
        </div>

        {/* Portfolio Grid */}
        <div className="max-w-7xl mx-auto px-8 py-20">
          {!portfolioItems || portfolioItems.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-600 text-lg">No portfolio items yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {portfolioItems.map((item) => (
                <Link
                  key={item.slug}
                  href={`/portfolio/${item.slug}`}
                  className="group"
                >
                  <article className="space-y-4">
                    {/* Image */}
                    <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
                      <Image
                        src={item.image_url}
                        alt={item.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>

                    {/* Category */}
                    {item.category && (
                      <div className="text-xs tracking-[0.2em] text-gray-500">
                        {item.category.toUpperCase()}
                      </div>
                    )}

                    {/* Title */}
                    <h2 className="font-serif text-2xl leading-tight group-hover:text-gray-600 transition-colors">
                      {item.title}
                    </h2>

                    {/* Description */}
                    {item.description && (
                      <p className="text-gray-600 leading-relaxed line-clamp-2">
                        {item.description}
                      </p>
                    )}
                  </article>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  )
}
