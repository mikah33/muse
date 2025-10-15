import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import CustomPageForm from '@/components/admin/CustomPageForm'

export default async function EditCustomPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  // Verify admin access
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/admin/login')
  }

  // Fetch page details
  const { data: page } = await supabase
    .from('custom_pages')
    .select('*')
    .eq('id', id)
    .single()

  if (!page) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-serif mb-2">Edit Page</h1>
          <p className="text-sm md:text-base text-gray-600">
            Update your custom page content and settings
          </p>
        </div>

        <CustomPageForm page={page} />
      </div>
    </div>
  )
}
