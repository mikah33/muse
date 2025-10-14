import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized - Please log in' }, { status: 401 })
    }

    const { id } = await request.json()

    if (!id) {
      return NextResponse.json({ error: 'Gallery ID required' }, { status: 400 })
    }

    // Delete all photos in the gallery first
    await supabase
      .from('gallery_photos')
      .delete()
      .eq('gallery_id', id)

    // Delete the gallery
    const { error } = await supabase
      .from('galleries')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting gallery:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
