import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Header from '@/components/shared/Header'

// Make this route dynamic
export const dynamic = 'force-dynamic'

export default async function CustomPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createClient()

  // Fetch custom pages for header first
  const { data: customPages } = await supabase
    .from('custom_pages')
    .select('id, title, slug, show_in_header, show_in_mobile_menu, order_position')
    .eq('published', true)
    .order('order_position')

  // Fetch the custom page
  const { data: page } = await supabase
    .from('custom_pages')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (!page) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-white">
      <Header customPages={customPages || []} />

      {/* Page Content */}
      <main className="pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-serif mb-8">{page.title}</h1>

          <div
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: page.content }}
          />
        </div>
      </main>
    </div>
  )
}

// Remove generateStaticParams to make this a dynamic route
// This allows the page to be generated on-demand
