import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'hero_image')
      .single()

    if (error) {
      console.error('Error fetching hero image:', error)
      return NextResponse.json({ url: '/images/hero-image.jpg' })
    }

    return NextResponse.json({ url: data?.value || '/images/hero-image.jpg' })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ url: '/images/hero-image.jpg' })
  }
}
