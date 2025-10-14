import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Image from 'next/image'
import DeleteButton from '@/components/admin/DeleteButton'

export default async function AdminBlogPage() {
  const supabase = await createClient()

  const { data: posts } = await supabase
    .from('blog_posts')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 md:mb-8 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-serif mb-2">Blog Posts</h1>
            <p className="text-sm md:text-base text-gray-600">Manage your blog content</p>
          </div>
          <Link
            href="/admin/blog/new"
            className="px-4 md:px-6 py-2 md:py-3 bg-black text-white text-xs md:text-sm tracking-wider hover:bg-gray-900 transition-colors whitespace-nowrap"
          >
            CREATE NEW POST
          </Link>
        </div>

        {/* Posts List */}
        {!posts || posts.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 md:p-12 text-center">
            <p className="text-gray-400 mb-6">No blog posts yet</p>
            <Link
              href="/admin/blog/new"
              className="inline-block px-6 py-3 bg-black text-white tracking-wider hover:bg-gray-900 transition-colors"
            >
              CREATE YOUR FIRST POST
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 md:gap-6">
            {posts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
              >
                <div className="p-4 md:p-6 flex flex-col md:flex-row gap-4 md:gap-6">
                  {/* Featured Image */}
                  {post.featured_image && (
                    <div className="relative w-full md:w-48 h-48 md:h-32 flex-shrink-0 rounded overflow-hidden bg-gray-100">
                      <Image
                        src={post.featured_image}
                        alt={post.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex-1 min-w-0">
                        <h2 className="text-lg md:text-xl font-serif mb-1">
                          {post.title}
                        </h2>
                        {post.category && (
                          <span className="text-xs tracking-wider text-gray-500">
                            {post.category.toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {post.published ? (
                          <span className="px-2 md:px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                            Published
                          </span>
                        ) : (
                          <span className="px-2 md:px-3 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                            Draft
                          </span>
                        )}
                      </div>
                    </div>

                    {post.excerpt && (
                      <p className="text-gray-600 text-sm mb-3 md:mb-4 line-clamp-2">
                        {post.excerpt}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-2 md:gap-4 text-xs md:text-sm text-gray-500">
                      <span>
                        {new Date(post.created_at).toLocaleDateString()}
                      </span>
                      <span className="hidden md:inline">•</span>
                      <span className="text-xs">/{post.slug}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex md:flex-col gap-2 w-full md:w-auto">
                    <Link
                      href={`/admin/blog/edit/${post.id}`}
                      className="flex-1 md:flex-none px-4 py-2 border border-gray-300 text-xs md:text-sm tracking-wider hover:bg-gray-50 transition-colors text-center"
                    >
                      EDIT
                    </Link>
                    <Link
                      href={`/blog/${post.slug}`}
                      target="_blank"
                      className="flex-1 md:flex-none px-4 py-2 border border-gray-300 text-xs md:text-sm tracking-wider hover:bg-gray-50 transition-colors text-center"
                    >
                      VIEW
                    </Link>
                    <DeleteButton
                      id={post.id}
                      type="blog"
                      className="flex-1 md:flex-none w-full"
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
