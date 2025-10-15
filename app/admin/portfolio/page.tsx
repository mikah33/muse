import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Image from 'next/image'
import DeleteButton from '@/components/admin/DeleteButton'

export default async function AdminPortfolioPage() {
  const supabase = await createClient()

  const { data: items } = await supabase
    .from('portfolio_items')
    .select('*')
    .order('order_position', { ascending: true })

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-serif mb-2">Portfolio</h1>
            <p className="text-gray-600">Manage your portfolio items</p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/admin/portfolio/bulk-upload"
              className="px-6 py-3 border-2 border-black text-black tracking-wider hover:bg-black hover:text-white transition-colors"
            >
              BULK UPLOAD
            </Link>
            <Link
              href="/admin/portfolio/new"
              className="px-6 py-3 bg-black text-white tracking-wider hover:bg-gray-800 transition-colors"
            >
              ADD NEW ITEM
            </Link>
          </div>
        </div>

        {/* Items Grid */}
        {!items || items.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-400 mb-6">No portfolio items yet</p>
            <Link
              href="/admin/portfolio/new"
              className="inline-block px-6 py-3 bg-black text-white tracking-wider hover:bg-gray-900 transition-colors"
            >
              ADD YOUR FIRST ITEM
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden"
              >
                {/* Image */}
                <div className="relative aspect-[4/5] bg-gray-100">
                  <Image
                    src={item.image_url}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                  {item.is_featured && (
                    <div className="absolute top-2 left-2 px-2 py-1 bg-black text-white text-xs font-bold rounded">
                      FEATURED
                    </div>
                  )}
                  {!item.published && (
                    <div className="absolute top-2 right-2 px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded">
                      DRAFT
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-serif text-lg mb-1 truncate">
                    {item.title}
                  </h3>
                  {item.category && (
                    <p className="text-xs text-gray-500 tracking-wider mb-2">
                      {item.category.toUpperCase()}
                    </p>
                  )}
                  {item.description && (
                    <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                      {item.description}
                    </p>
                  )}

                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    <Link
                      href={`/admin/portfolio/edit/${item.id}`}
                      className="w-full px-3 py-2 border border-gray-300 text-sm text-center tracking-wider hover:bg-gray-50 transition-colors"
                    >
                      EDIT
                    </Link>
                    <Link
                      href={`/portfolio/${item.slug}`}
                      target="_blank"
                      className="w-full px-3 py-2 border border-gray-300 text-sm text-center tracking-wider hover:bg-gray-50 transition-colors"
                    >
                      VIEW
                    </Link>
                    <DeleteButton
                      id={item.id}
                      type="portfolio"
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
