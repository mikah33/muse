import { notFound } from 'next/navigation'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import Link from 'next/link'
import DeleteButton from '@/components/admin/DeleteButton'
import CustomerReactionsView from '@/components/admin/CustomerReactionsView'

export default async function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  // Check who is logged in
  const { data: { user: currentUser } } = await supabase.auth.getUser()
  console.log('Current logged in user:', currentUser?.id)

  // Get current user's role
  const { data: currentUserData } = await supabase
    .from('users')
    .select('role, email')
    .eq('id', currentUser?.id)
    .single()

  console.log('Current user role:', currentUserData?.role, 'email:', currentUserData?.email)

  const { data: customer } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .eq('role', 'customer')
    .single()

  if (!customer) {
    notFound()
  }

  console.log('Viewing customer:', customer.id, customer.email)

  // Fetch galleries for this customer
  const { data: galleries } = await supabase
    .from('galleries')
    .select('*')
    .eq('customer_id', customer.id)
    .order('created_at', { ascending: false })

  // Use service role client for admin queries (bypasses RLS)
  const supabaseAdmin = createServiceClient()

  // Fetch customer favorites - simplified approach
  const { data: favoritesRaw, error: favError } = await supabaseAdmin
    .from('favorites')
    .select('favorited_at, photo_id')
    .eq('customer_id', customer.id)
    .order('favorited_at', { ascending: false })

  console.log('Server-side favorites raw:', JSON.stringify(favoritesRaw), 'Error:', JSON.stringify(favError))

  // Fetch customer dislikes
  const { data: dislikesRaw, error: disError } = await supabaseAdmin
    .from('dislikes')
    .select('created_at, photo_id')
    .eq('customer_id', customer.id)
    .order('created_at', { ascending: false })

  console.log('Server-side dislikes raw:', JSON.stringify(dislikesRaw), 'Error:', JSON.stringify(disError))

  // Fetch photo details separately
  let favorites: any[] = []
  if (favoritesRaw && favoritesRaw.length > 0) {
    const favoritePhotoIds = favoritesRaw.map(f => f.photo_id)
    const { data: favoritePhotos } = await supabaseAdmin
      .from('photos')
      .select('id, photo_url, thumbnail_url, title, description, gallery_id, galleries(gallery_name)')
      .in('id', favoritePhotoIds)

    console.log('Favorite photos fetched:', JSON.stringify(favoritePhotos))

    favorites = (favoritePhotos || []).map((photo: any) => ({
      ...photo,
      galleries: photo.galleries || { gallery_name: 'Unknown' },
      reaction_date: favoritesRaw.find(f => f.photo_id === photo.id)?.favorited_at || new Date().toISOString(),
    }))
  }

  let dislikes: any[] = []
  if (dislikesRaw && dislikesRaw.length > 0) {
    const dislikePhotoIds = dislikesRaw.map(d => d.photo_id)
    const { data: dislikePhotos } = await supabaseAdmin
      .from('photos')
      .select('id, photo_url, thumbnail_url, title, description, gallery_id, galleries(gallery_name)')
      .in('id', dislikePhotoIds)

    console.log('Dislike photos fetched:', JSON.stringify(dislikePhotos))

    dislikes = (dislikePhotos || []).map((photo: any) => ({
      ...photo,
      galleries: photo.galleries || { gallery_name: 'Unknown' },
      reaction_date: dislikesRaw.find(d => d.photo_id === photo.id)?.created_at || new Date().toISOString(),
    }))
  }

  console.log('Formatted favorites count:', favorites.length, 'items:', JSON.stringify(favorites))
  console.log('Formatted dislikes count:', dislikes.length, 'items:', JSON.stringify(dislikes))

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

        {/* Customer Reactions (Favorites & Dislikes) */}
        <div className="mb-6 md:mb-8">
          <h2 className="text-lg md:text-xl font-semibold mb-4">Customer Reactions</h2>
          <CustomerReactionsView
            customerId={customer.id}
            initialFavorites={favorites}
            initialDislikes={dislikes}
          />
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
