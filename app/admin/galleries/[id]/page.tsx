import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import GalleryPhotoUpload from '@/components/admin/GalleryPhotoUpload'
import AdminGalleryGrid from '@/components/admin/AdminGalleryGrid'

export default async function AdminGalleryDetailPage({
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

  // Fetch gallery details
  const { data: gallery } = await supabase
    .from('galleries')
    .select(`
      *,
      customer:users!galleries_customer_id_fkey (
        id,
        full_name,
        email
      )
    `)
    .eq('id', id)
    .single()

  if (!gallery) {
    notFound()
  }

  // Fetch photos for this gallery
  const { data: photos } = await supabase
    .from('photos')
    .select('*')
    .eq('gallery_id', id)
    .order('order_position')

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <Link
            href={`/admin/customers/${gallery.customer_id}`}
            className="text-sm text-gray-600 hover:text-black mb-3 md:mb-4 inline-block"
          >
            ← Back to Customer
          </Link>
          <h1 className="text-2xl md:text-3xl font-serif mb-2">{gallery.gallery_name}</h1>
          <p className="text-sm md:text-base text-gray-600">
            Customer: {gallery.customer?.full_name} ({gallery.customer?.email})
          </p>
        </div>

        {/* Gallery Info */}
        <div className="bg-white rounded-lg shadow p-4 md:p-6 mb-6 md:mb-8">
          <h2 className="text-lg md:text-xl font-semibold mb-4">Gallery Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-xs md:text-sm text-gray-500">Gallery Name</p>
              <p className="font-medium text-sm md:text-base">{gallery.gallery_name}</p>
            </div>
            {gallery.description && (
              <div>
                <p className="text-xs md:text-sm text-gray-500">Description</p>
                <p className="font-medium text-sm md:text-base">{gallery.description}</p>
              </div>
            )}
            {gallery.shoot_date && (
              <div>
                <p className="text-xs md:text-sm text-gray-500">Shoot Date</p>
                <p className="font-medium text-sm md:text-base">
                  {new Date(gallery.shoot_date).toLocaleDateString()}
                </p>
              </div>
            )}
            <div>
              <p className="text-xs md:text-sm text-gray-500">Status</p>
              <p className="font-medium text-sm md:text-base">
                {gallery.is_active ? (
                  <span className="text-green-600">Active</span>
                ) : (
                  <span className="text-gray-400">Inactive</span>
                )}
              </p>
            </div>
            <div>
              <p className="text-xs md:text-sm text-gray-500">Total Photos</p>
              <p className="font-medium text-sm md:text-base">{photos?.length || 0}</p>
            </div>
            <div>
              <p className="text-xs md:text-sm text-gray-500">Created</p>
              <p className="font-medium text-sm md:text-base">
                {new Date(gallery.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Photo Upload */}
        <div className="bg-white rounded-lg shadow p-4 md:p-6 mb-6 md:mb-8">
          <h2 className="text-lg md:text-xl font-semibold mb-4">Upload Photos</h2>
          <GalleryPhotoUpload galleryId={id} />
        </div>

        {/* Photos Grid */}
        <div className="bg-white rounded-lg shadow p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-semibold mb-4 md:mb-6">
            Photos ({photos?.length || 0})
          </h2>
          {!photos || photos.length === 0 ? (
            <div className="text-center py-8 md:py-12">
              <p className="text-gray-400 text-sm md:text-base">No photos uploaded yet</p>
            </div>
          ) : (
            <AdminGalleryGrid photos={photos} galleryId={id} />
          )}
        </div>
      </div>
    </div>
  )
}
