import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET all services
export async function GET() {
  try {
    const supabase = await createClient()

    const { data: services, error } = await supabase
      .from('services')
      .select('*')
      .order('order_position')

    if (error) throw error

    return NextResponse.json({ services })
  } catch (error) {
    console.error('Error fetching services:', error)
    return NextResponse.json(
      { error: 'Failed to fetch services' },
      { status: 500 }
    )
  }
}

// PUT update a service
export async function PUT(request: Request) {
  try {
    const supabase = await createClient()

    // Check if user is admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: userRecord } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (userRecord?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { id, title, description, icon, is_active, items } = body

    const { data, error } = await supabase
      .from('services')
      .update({
        title,
        description,
        icon,
        is_active,
        items,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ service: data })
  } catch (error) {
    console.error('Error updating service:', error)
    return NextResponse.json(
      { error: 'Failed to update service' },
      { status: 500 }
    )
  }
}

// PATCH reorder services
export async function PATCH(request: Request) {
  try {
    const supabase = await createClient()

    // Check if user is admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: userRecord } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (userRecord?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { services } = await request.json()

    // Update order_position for each service
    const updates = services.map((service: any, index: number) =>
      supabase
        .from('services')
        .update({ order_position: index + 1 })
        .eq('id', service.id)
    )

    await Promise.all(updates)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error reordering services:', error)
    return NextResponse.json(
      { error: 'Failed to reorder services' },
      { status: 500 }
    )
  }
}
