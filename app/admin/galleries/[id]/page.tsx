import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import GalleryPhotoUpload from '@/components/admin/GalleryPhotoUpload'
import Image from 'next/image'
import DeleteButton from '@/components/admin/DeleteButton'

export default async function GalleryDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = await createClient()

  const { data: gallery } = await supabase
    .from('galleries')
    .select('*, customer:users!customer_id(full_name, email)')
    .eq('id', params.id)
    .single()

  if (!gallery) {
    notFound()
  }

  const { data: photos } = await supabase
    .from('photos')
    .select('*')
    .eq('gallery_id', gallery.id)
    .order('order_position', { ascending: true })

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href={`/admin/customers/${gallery.customer_id}`}
            className="text-sm text-gray-600 hover:text-black mb-4 inline-block"
          >
            ← Back to Customer
          </Link>
          <h1 className="text-3xl font-serif mb-2">{gallery.gallery_name}</h1>
          <p className="text-gray-600">
            {gallery.customer.full_name} • {photos?.length || 0} photos
          </p>
        </div>

        {/* Gallery Info */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Gallery Details</h2>
          <div className="grid grid-cols-2 gap-4">
            {gallery.description && (
              <div className="col-span-2">
                <p className="text-sm text-gray-500">Description</p>
                <p className="font-medium">{gallery.description}</p>
              </div>
            )}
            {gallery.shoot_date && (
              <div>
                <p className="text-sm text-gray-500">Shoot Date</p>
                <p className="font-medium">
                  {new Date(gallery.shoot_date).toLocaleDateString()}
                </p>
              </div>
            )}
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <p className="font-medium">
                {gallery.is_active ? 'Active' : 'Inactive'}
              </p>
            </div>
          </div>
        </div>

        {/* Photo Upload */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Upload Photos</h2>
          <GalleryPhotoUpload galleryId={gallery.id} />
        </div>

        {/* Photos Grid */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Photos</h2>
          {!photos || photos.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              No photos uploaded yet
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {photos.map((photo) => (
                <div key={photo.id} className="relative aspect-square group">
                  <Image
                    src={photo.photo_url}
                    alt={photo.title || ''}
                    fill
                    className="object-cover rounded"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <DeleteButton
                      id={photo.id}
                      type="photo"
                      label="Delete"
                      className="px-3 py-1 text-xs"
                    />
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
