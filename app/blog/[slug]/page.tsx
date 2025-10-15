import { notFound } from 'next/navigation'
import Image from 'next/image'
import HeaderWrapper from '@/components/shared/HeaderWrapper'
import Footer from '@/components/shared/Footer'
import { createClient } from '@/lib/supabase/server'

interface BlogImage {
  id: string
  image_url: string
  caption: string | null
  position: number
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createClient()

  // Fetch blog post
  const { data: post } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (!post) {
    notFound()
  }

  // Fetch images for this post
  const { data: images } = await supabase
    .from('blog_images')
    .select('*')
    .eq('blog_post_id', post.id)
    .order('position', { ascending: true })

  return (
    <>
      <HeaderWrapper />
      <article className="min-h-screen bg-white pt-20">
        {/* Hero Image */}
        {post.featured_image && (
          <div className="relative w-full h-[60vh] bg-gray-100">
            <Image
              src={post.featured_image}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Content */}
        <div className="max-w-4xl mx-auto px-8 py-20">
          {/* Category & Date */}
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
            {post.category && (
              <span className="tracking-[0.2em]">{post.category.toUpperCase()}</span>
            )}
            {post.published_at && (
              <>
                <span>•</span>
                <time>
                  {new Date(post.published_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
              </>
            )}
          </div>

          {/* Title */}
          <h1 className="font-serif text-5xl md:text-6xl mb-8 leading-tight">
            {post.title}
          </h1>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-xl text-gray-600 leading-relaxed mb-12 border-l-4 border-gray-300 pl-6">
              {post.excerpt}
            </p>
          )}

          {/* Content */}
          <div
            className="prose prose-lg max-w-none
              prose-headings:font-serif prose-headings:font-normal
              prose-p:text-gray-700 prose-p:leading-relaxed
              prose-a:text-black prose-a:underline hover:prose-a:text-gray-600
              prose-img:rounded-lg"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Additional Images */}
          {images && images.length > 0 && (
            <div className="mt-16 space-y-8">
              {images.map((image: BlogImage) => (
                <figure key={image.id} className="space-y-4">
                  <div className="relative w-full h-[500px] rounded-lg overflow-hidden">
                    <Image
                      src={image.image_url}
                      alt={image.caption || ''}
                      fill
                      className="object-cover"
                    />
                  </div>
                  {image.caption && (
                    <figcaption className="text-sm text-gray-500 text-center">
                      {image.caption}
                    </figcaption>
                  )}
                </figure>
              ))}
            </div>
          )}
        </div>

        {/* Back to Blog */}
        <div className="max-w-4xl mx-auto px-8 pb-20">
          <a
            href="/blog"
            className="inline-flex items-center text-sm tracking-wider hover:translate-x-2 transition-transform"
          >
            ← BACK TO JOURNAL
          </a>
        </div>
      </article>
      <Footer />
    </>
  )
}
