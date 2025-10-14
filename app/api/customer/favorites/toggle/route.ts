import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { photoId } = await request.json()

    if (!photoId) {
      return NextResponse.json({ error: 'Photo ID required' }, { status: 400 })
    }

    // Check if photo belongs to user's gallery
    const { data: photo } = await supabase
      .from('photos')
      .select(`
        id,
        gallery_id,
        galleries!inner (
          customer_id
        )
      `)
      .eq('id', photoId)
      .single()

    if (!photo || (photo.galleries as any).customer_id !== user.id) {
      return NextResponse.json({ error: 'Photo not found' }, { status: 404 })
    }

    // Check if already favorited
    const { data: existing } = await supabase
      .from('favorites')
      .select('id')
      .eq('customer_id', user.id)
      .eq('photo_id', photoId)
      .single()

    if (existing) {
      // Remove favorite
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('id', existing.id)

      if (error) throw error

      return NextResponse.json({ favorited: false })
    } else {
      // Add favorite
      const { error } = await supabase
        .from('favorites')
        .insert({
          customer_id: user.id,
          photo_id: photoId
        })

      if (error) throw error

      return NextResponse.json({ favorited: true })
    }
  } catch (error) {
    console.error('Favorites toggle error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
