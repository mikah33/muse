import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import DeleteButton from '@/components/admin/DeleteButton'

export default async function CustomerDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = await createClient()

  const { data: customer } = await supabase
    .from('users')
    .select('*')
    .eq('id', params.id)
    .eq('role', 'customer')
    .single()

  if (!customer) {
    notFound()
  }

  // Fetch galleries for this customer
  const { data: galleries } = await supabase
    .from('galleries')
    .select('*')
    .eq('customer_id', customer.id)
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <Link
            href="/admin/customers"
            className="text-sm text-gray-600 hover:text-black mb-3 md:mb-4 inline-block"
          >
            ← Back to Customers
          </Link>
          <h1 className="text-2xl md:text-3xl font-serif mb-2">{customer.full_name}</h1>
          <p className="text-sm md:text-base text-gray-600 break-words">{customer.email}</p>
        </div>

        {/* Customer Info */}
        <div className="bg-white rounded-lg shadow p-4 md:p-6 mb-6 md:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
            <h2 className="text-lg md:text-xl font-semibold">Customer Information</h2>
            <div className="flex gap-2">
              <Link
                href={`/admin/customers/${customer.id}/edit`}
                className="px-3 md:px-4 py-2 border border-gray-300 text-xs md:text-sm hover:bg-gray-50"
              >
                EDIT
              </Link>
              <DeleteButton
                id={customer.id}
                type="customer"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-xs md:text-sm text-gray-500">Full Name</p>
              <p className="font-medium text-sm md:text-base">{customer.full_name}</p>
            </div>
            <div>
              <p className="text-xs md:text-sm text-gray-500">Email</p>
              <p className="font-medium text-sm md:text-base break-all">{customer.email}</p>
            </div>
            <div>
              <p className="text-xs md:text-sm text-gray-500">Phone</p>
              <p className="font-medium text-sm md:text-base">{customer.phone || '-'}</p>
            </div>
            <div>
              <p className="text-xs md:text-sm text-gray-500">Customer Since</p>
              <p className="font-medium text-sm md:text-base">
                {new Date(customer.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Galleries */}
        <div className="bg-white rounded-lg shadow p-4 md:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 md:mb-6 gap-3">
            <h2 className="text-lg md:text-xl font-semibold">Galleries</h2>
            <Link
              href={`/admin/galleries/new?customer_id=${customer.id}`}
              className="px-3 md:px-4 py-2 bg-black text-white text-xs md:text-sm tracking-wider hover:bg-gray-900 transition-colors text-center"
            >
              CREATE GALLERY
            </Link>
          </div>

          {!galleries || galleries.length === 0 ? (
            <div className="text-center py-8 md:py-12">
              <p className="text-gray-400 mb-4 text-sm md:text-base">No galleries yet</p>
              <Link
                href={`/admin/galleries/new?customer_id=${customer.id}`}
                className="inline-block px-3 md:px-4 py-2 bg-black text-white text-xs md:text-sm tracking-wider hover:bg-gray-900 transition-colors"
              >
                CREATE FIRST GALLERY
              </Link>
            </div>
          ) : (
            <div className="space-y-3 md:space-y-4">
              {galleries.map((gallery) => (
                <div
                  key={gallery.id}
                  className="border rounded-lg p-3 md:p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm md:text-base">{gallery.gallery_name}</h3>
                      {gallery.description && (
                        <p className="text-xs md:text-sm text-gray-600 mt-1">
                          {gallery.description}
                        </p>
                      )}
                      {gallery.shoot_date && (
                        <p className="text-xs text-gray-500 mt-1">
                          Shoot Date:{' '}
                          {new Date(gallery.shoot_date).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <Link
                        href={`/admin/galleries/${gallery.id}`}
                        className="px-3 md:px-4 py-2 border border-gray-300 text-xs md:text-sm hover:bg-gray-50 whitespace-nowrap"
                      >
                        View
                      </Link>
                      <DeleteButton
                        id={gallery.id}
                        type="gallery"
                        label="DELETE"
                        className="text-xs md:text-sm"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
