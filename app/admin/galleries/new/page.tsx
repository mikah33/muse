import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import CreateGalleryForm from '@/components/admin/CreateGalleryForm'

export default async function NewGalleryPage({
  searchParams,
}: {
  searchParams: Promise<{ customer_id?: string }>
}) {
  const params = await searchParams
  const supabase = await createClient()

  // Verify admin access
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/admin/login')
  }

  // Fetch all customers
  const { data: customers } = await supabase
    .from('users')
    .select('id, full_name, email')
    .eq('role', 'customer')
    .order('full_name')

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-serif mb-2">Create New Gallery</h1>
          <p className="text-sm md:text-base text-gray-600">
            Create a new photo gallery for a customer
          </p>
        </div>

        <CreateGalleryForm
          customers={customers || []}
          preselectedCustomerId={params.customer_id}
        />
      </div>
    </div>
  )
}
