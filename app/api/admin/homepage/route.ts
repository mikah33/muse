import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET all homepage sections
export async function GET() {
  try {
    const supabase = await createClient()

    const { data: sections, error } = await supabase
      .from('homepage_sections')
      .select('*')
      .eq('is_active', true)
      .order('display_order')

    if (error) throw error

    return NextResponse.json({ sections })
  } catch (error) {
    console.error('Error fetching homepage sections:', error)
    return NextResponse.json(
      { error: 'Failed to fetch sections' },
      { status: 500 }
    )
  }
}

// PUT update a section
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
    const { id, icon, title, description, items } = body

    const { data, error } = await supabase
      .from('homepage_sections')
      .update({
        icon,
        title,
        description,
        items,
        updated_by: user.id,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ section: data })
  } catch (error) {
    console.error('Error updating homepage section:', error)
    return NextResponse.json(
      { error: 'Failed to update section' },
      { status: 500 }
    )
  }
}

// PATCH reorder sections
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

    const { sections } = await request.json()

    // Update display order for each section
    const updates = sections.map((section: any, index: number) =>
      supabase
        .from('homepage_sections')
        .update({ display_order: index + 1 })
        .eq('id', section.id)
    )

    await Promise.all(updates)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error reordering sections:', error)
    return NextResponse.json(
      { error: 'Failed to reorder sections' },
      { status: 500 }
    )
  }
}
