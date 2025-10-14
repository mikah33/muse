import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import BlogPostForm from '@/components/admin/BlogPostForm'

export default async function EditBlogPostPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = await createClient()

  const { data: post } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!post) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-serif mb-2">Edit Post</h1>
          <p className="text-gray-600">Update your blog post</p>
        </div>

        <BlogPostForm post={post} />
      </div>
    </div>
  )
}
