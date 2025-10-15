import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import CustomPageForm from '@/components/admin/CustomPageForm'

export default async function NewCustomPage() {
  const supabase = await createClient()

  // Verify admin access
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/admin/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-serif mb-2">Create Custom Page</h1>
          <p className="text-sm md:text-base text-gray-600">
            Create a new page that will appear in your site navigation
          </p>
        </div>

        <CustomPageForm />
      </div>
    </div>
  )
}
