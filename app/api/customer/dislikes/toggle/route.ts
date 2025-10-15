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

    // Check if already disliked
    const { data: existing } = await supabase
      .from('dislikes')
      .select('id')
      .eq('customer_id', user.id)
      .eq('photo_id', photoId)
      .single()

    if (existing) {
      // Remove dislike
      const { error } = await supabase
        .from('dislikes')
        .delete()
        .eq('id', existing.id)

      if (error) throw error

      return NextResponse.json({ isDisliked: false })
    } else {
      // Add dislike
      const { error } = await supabase
        .from('dislikes')
        .insert({
          customer_id: user.id,
          photo_id: photoId
        })

      if (error) throw error

      return NextResponse.json({ isDisliked: true })
    }
  } catch (error) {
    console.error('Dislikes toggle error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
