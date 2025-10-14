import BlogPostForm from '@/components/admin/BlogPostForm'

export default function NewBlogPostPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-serif mb-2">Create New Post</h1>
          <p className="text-gray-600">Write and publish a new blog post</p>
        </div>

        <BlogPostForm />
      </div>
    </div>
  )
}
