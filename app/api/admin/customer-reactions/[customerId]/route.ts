import { createClient } from '@/lib/supabase/server'
import { createClient as createServerClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ customerId: string }> }
) {
  try {
    // First verify the requesting user is an admin using regular client
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized - Please log in' },
        { status: 401 }
      )
    }

    // Verify user is admin
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (userError || userData?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      )
    }

    // Get customerId from params
    const { customerId } = await params

    if (!customerId) {
      return NextResponse.json(
        { error: 'Customer ID is required' },
        { status: 400 }
      )
    }

    // Create service role client to bypass RLS
    const serviceSupabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Fetch favorites with photo details using service role
    const { data: favoritesData, error: favoritesError } = await serviceSupabase
      .from('favorites')
      .select(`
        id,
        photo_id,
        favorited_at,
        photos!inner (
          id,
          photo_url,
          thumbnail_url,
          title,
          description,
          gallery_id,
          galleries (
            id,
            gallery_name
          )
        )
      `)
      .eq('customer_id', customerId)
      .order('favorited_at', { ascending: false })

    if (favoritesError) {
      console.error('Error fetching favorites:', favoritesError)
      return NextResponse.json(
        { error: `Failed to fetch favorites: ${favoritesError.message}` },
        { status: 500 }
      )
    }

    // Fetch dislikes with photo details using service role
    const { data: dislikesData, error: dislikesError } = await serviceSupabase
      .from('dislikes')
      .select(`
        id,
        photo_id,
        created_at,
        photos!inner (
          id,
          photo_url,
          thumbnail_url,
          title,
          description,
          gallery_id,
          galleries (
            id,
            gallery_name
          )
        )
      `)
      .eq('customer_id', customerId)
      .order('created_at', { ascending: false })

    if (dislikesError) {
      console.error('Error fetching dislikes:', dislikesError)
      return NextResponse.json(
        { error: `Failed to fetch dislikes: ${dislikesError.message}` },
        { status: 500 }
      )
    }

    // Transform favorites data
    const favorites = (favoritesData || []).map((item: any) => ({
      id: item.id,
      photo_id: item.photo_id,
      favorited_at: item.favorited_at,
      photo: {
        id: item.photos.id,
        photo_url: item.photos.photo_url,
        thumbnail_url: item.photos.thumbnail_url,
        title: item.photos.title,
        description: item.photos.description,
        gallery_id: item.photos.gallery_id,
        gallery: item.photos.galleries
      }
    }))

    // Transform dislikes data
    const dislikes = (dislikesData || []).map((item: any) => ({
      id: item.id,
      photo_id: item.photo_id,
      disliked_at: item.created_at,
      photo: {
        id: item.photos.id,
        photo_url: item.photos.photo_url,
        thumbnail_url: item.photos.thumbnail_url,
        title: item.photos.title,
        description: item.photos.description,
        gallery_id: item.photos.gallery_id,
        gallery: item.photos.galleries
      }
    }))

    return NextResponse.json({
      success: true,
      data: {
        favorites,
        dislikes,
        counts: {
          favorites: favorites.length,
          dislikes: dislikes.length,
          total: favorites.length + dislikes.length
        }
      }
    })

  } catch (error: any) {
    console.error('Customer reactions API error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
