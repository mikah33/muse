import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { FavoriteButton } from '@/components/FavoriteButton'

export default async function FavoritesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: userInfo } = await supabase
    .from('users')
    .select('full_name')
    .eq('id', user.id)
    .single()

  // Get all favorited photos with gallery info
  const { data: rawFavorites } = await supabase
    .from('favorites')
    .select(`
      id,
      photo_id,
      photos!inner (
        id,
        photo_url,
        thumbnail_url,
        title,
        description,
        gallery_id,
        galleries!inner (
          id,
          gallery_name
        )
      )
    `)
    .eq('customer_id', user.id)
    .order('favorited_at', { ascending: false })

  const favorites = rawFavorites as any[]

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-charcoal text-white p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="font-serif text-2xl tracking-widest">
            MODEL MUSE
          </Link>
          <div className="flex items-center gap-6 text-sm">
            <Link href="/portal" className="hover:text-gray-300">Galleries</Link>
            <Link href="/portal/favorites" className="border-b-2 border-white pb-1">Favorites</Link>
            <span>{userInfo?.full_name}</span>
            <form action="/api/auth/signout" method="post">
              <button className="px-4 py-2 border border-gray-600 hover:bg-gray-800">
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-8">
        <h1 className="text-4xl font-serif mb-8">Your Favorites</h1>

        {!favorites || favorites.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-400 mb-4">No favorites yet</p>
            <Link href="/portal" className="text-charcoal hover:underline">
              Browse your galleries
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((favorite) => (
              <div key={favorite.id} className="bg-white rounded-lg shadow overflow-hidden group">
                <div className="relative aspect-[4/5]">
                  <Image
                    src={favorite.photos.photo_url}
                    alt={favorite.photos.title || ''}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <FavoriteButton photoId={favorite.photos.id} initialFavorited={true} />
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-sm text-gray-500 mb-1">
                    <Link
                      href={`/portal/gallery/${favorite.photos.gallery_id}`}
                      className="hover:text-charcoal hover:underline"
                    >
                      {favorite.photos.galleries.gallery_name}
                    </Link>
                  </p>
                  {favorite.photos.title && (
                    <p className="font-medium text-charcoal">{favorite.photos.title}</p>
                  )}
                  {favorite.photos.description && (
                    <p className="text-sm text-gray-600 mt-2">{favorite.photos.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
