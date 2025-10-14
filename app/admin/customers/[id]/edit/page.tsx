import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import EditCustomerForm from '@/components/admin/EditCustomerForm'

export default async function EditCustomerPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: customer } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .eq('role', 'customer')
    .single()

  if (!customer) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-serif mb-2">Edit Customer</h1>
          <p className="text-gray-600">Update customer information</p>
        </div>

        <EditCustomerForm customer={customer} />
      </div>
    </div>
  )
}
