import Link from 'next/link'
import Image from 'next/image'
import Header from '@/components/shared/Header'
import Footer from '@/components/shared/Footer'
import { createClient } from '@/lib/supabase/server'

interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  published_at: string
  featured_image: string
  category: string
}

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function BlogPage() {
  const supabase = await createClient()

  const { data: blogPosts, error } = await supabase
    .from('blog_posts')
    .select('id, slug, title, excerpt, published_at, featured_image, category')
    .eq('published', true)
    .order('published_at', { ascending: false })

  console.log('Blog posts fetched:', blogPosts, 'Error:', error)
  return (
    <>
      <Header />
      <div className="min-h-screen bg-charcoal">
      {/* Header */}
      <div className="bg-charcoal text-white py-24 md:py-32 px-6 md:px-8 pt-32 md:pt-40">
        <div className="max-w-7xl mx-auto">
          <h1 className="font-serif text-5xl md:text-6xl mb-6">Journal</h1>
          <p className="text-xl text-gray-300 max-w-2xl">
            Insights, inspiration, and industry knowledge from the world of fashion and beauty photography
          </p>
        </div>
      </div>

      {/* Blog Grid */}
      <div className="max-w-7xl mx-auto px-8 py-20 bg-white">
        {!blogPosts || blogPosts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-600 text-lg">No published posts yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {blogPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group"
              >
                <article className="space-y-4">
                  {/* Image */}
                  {post.featured_image && (
                    <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
                      <Image
                        src={post.featured_image}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  )}

                  {/* Category */}
                  {post.category && (
                    <div className="text-xs tracking-[0.2em] text-gray-500">
                      {post.category.toUpperCase()}
                    </div>
                  )}

                  {/* Title */}
                  <h2 className="font-serif text-2xl leading-tight group-hover:text-gray-600 transition-colors">
                    {post.title}
                  </h2>

                  {/* Excerpt */}
                  {post.excerpt && (
                    <p className="text-gray-600 leading-relaxed">
                      {post.excerpt}
                    </p>
                  )}

                  {/* Date */}
                  {post.published_at && (
                    <div className="text-sm text-gray-400">
                      {new Date(post.published_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                  )}

                  {/* Read More */}
                  <div className="text-sm tracking-wider group-hover:translate-x-2 transition-transform inline-block">
                    READ MORE →
                  </div>
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
