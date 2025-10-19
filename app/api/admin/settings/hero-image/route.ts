import { createClient } from '@/lib/supabase/server'
import { createClient as createServerClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { heroOptimizer } from '@/lib/image-processing/hero-optimizer'
import { MAX_FILE_SIZE, ALLOWED_MIME_TYPES } from '@/lib/image-processing/config'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Check authentication
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json({
        error: 'Invalid file type. Allowed: JPEG, PNG, WebP'
      }, { status: 400 })
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({
        error: `File too large. Maximum size: ${MAX_FILE_SIZE / 1024 / 1024}MB`
      }, { status: 400 })
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Process hero image with all variants
    const processedImages = await heroOptimizer.processHeroImage(buffer, file.name)

    // Create service role client for database operations
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

    // Update settings table with all variant URLs
    const { error: updateError } = await serviceSupabase
      .from('site_settings')
      .upsert({
        key: 'hero_image',
        value: JSON.stringify(processedImages),
        updated_by: user.id,
      }, {
        onConflict: 'key'
      })

    if (updateError) {
      console.error('Update error:', updateError)
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: processedImages,
      message: 'Hero image processed with responsive variants'
    })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Internal server error'
    }, { status: 500 })
  }
}
