import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import GalleryView from '@/components/customer/GalleryView'

export default async function CustomerGalleryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user: authUser } } = await supabase.auth.getUser()

  if (!authUser) redirect('/login')

  // Get full user data from database
  const { data: user } = await supabase
    .from('users')
    .select('*')
    .eq('id', authUser.id)
    .single()

  if (!user) redirect('/login')

  const { data: gallery } = await supabase
    .from('galleries')
    .select('*')
    .eq('id', id)
    .eq('customer_id', authUser.id)
    .single()

  if (!gallery) notFound()

  const { data: photos } = await supabase
    .from('photos')
    .select('*')
    .eq('gallery_id', gallery.id)
    .order('order_position', { ascending: true })

  // Get favorites and dislikes for this user
  const { data: favorites } = await supabase
    .from('favorites')
    .select('photo_id')
    .eq('customer_id', authUser.id)

  const { data: dislikes } = await supabase
    .from('dislikes')
    .select('photo_id')
    .eq('customer_id', authUser.id)

  const favoritePhotoIds = new Set(favorites?.map(f => f.photo_id) || [])
  const dislikePhotoIds = new Set(dislikes?.map(d => d.photo_id) || [])

  // Add is_favorited and is_disliked fields to photos
  const photosWithReactions = photos?.map(photo => ({
    ...photo,
    is_favorited: favoritePhotoIds.has(photo.id),
    is_disliked: dislikePhotoIds.has(photo.id)
  })) || []

  return (
    <GalleryView
      gallery={gallery}
      photos={photosWithReactions}
      user={user}
    />
  )
}
