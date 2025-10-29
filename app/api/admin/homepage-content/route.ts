import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('homepage_content')
      .select('section, content')

    if (error) throw error

    // Transform array to object format
    const content = data.reduce((acc, item) => {
      acc[item.section] = item.content
      return acc
    }, {} as Record<string, any>)

    return NextResponse.json(content)
  } catch (error) {
    console.error('Error fetching homepage content:', error)
    return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    // Update each section
    for (const [section, content] of Object.entries(body)) {
      const { error } = await supabase
        .from('homepage_content')
        .upsert({
          section,
          content,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'section'
        })

      if (error) throw error
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error saving homepage content:', error)
    return NextResponse.json({ error: 'Failed to save content' }, { status: 500 })
  }
}
