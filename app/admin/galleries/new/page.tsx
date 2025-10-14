import { createClient } from '@/lib/supabase/server'
import CreateGalleryForm from '@/components/admin/CreateGalleryForm'

export default async function NewGalleryPage({
  searchParams,
}: {
  searchParams: Promise<{ customer_id?: string }>
}) {
  const params = await searchParams
  const supabase = await createClient()

  // Fetch all customers for dropdown
  const { data: customers } = await supabase
    .from('users')
    .select('id, full_name, email')
    .eq('role', 'customer')
    .order('full_name', { ascending: true })

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-serif mb-2">Create Gallery</h1>
          <p className="text-gray-600">Create a new photo gallery for a customer</p>
        </div>

        <CreateGalleryForm
          customers={customers || []}
          preselectedCustomerId={params.customer_id}
        />
      </div>
    </div>
  )
}
