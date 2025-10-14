import { createClient } from '@/lib/supabase/server'
import { createClient as createServerClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  console.log('=== Signup API route hit ===')
  try {
    const body = await request.json()
    console.log('Request body:', { ...body, password: '[REDACTED]' })
    const { email, password, full_name, phone } = body

    if (!email || !password || !full_name) {
      console.log('Validation failed: missing required fields')
      return NextResponse.json(
        { error: 'Email, password, and full name are required' },
        { status: 400 }
      )
    }

    // Validate password length
    if (password.length < 8) {
      console.log('Validation failed: password too short')
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      )
    }

    console.log('Creating service role client...')
    // Create service role client for creating user with auto-confirm
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
    console.log('Service role client created')

    // Check if user already exists
    console.log('Checking if user exists...')
    const { data: existingUser } = await serviceSupabase
      .from('users')
      .select('email')
      .eq('email', email)
      .single()

    if (existingUser) {
      console.log('User already exists')
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 400 }
      )
    }
    console.log('User does not exist, proceeding with creation')

    // Create auth user with auto-confirmed email
    console.log('Creating auth user...')
    const { data: authData, error: authError } = await serviceSupabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name,
        role: 'customer',
      },
    })

    if (authError) {
      console.error('Auth error:', authError)
      return NextResponse.json({ error: authError.message }, { status: 400 })
    }
    console.log('Auth user created:', authData.user.id)

    // Create user in public.users table
    console.log('Creating database record...')
    const { error: dbError } = await serviceSupabase
      .from('users')
      .insert({
        id: authData.user.id,
        email,
        full_name,
        phone: phone || null,
        role: 'customer',
      })

    if (dbError) {
      console.error('Database error:', dbError)
      // Clean up auth user if db insert fails
      await serviceSupabase.auth.admin.deleteUser(authData.user.id)
      return NextResponse.json({ error: dbError.message }, { status: 400 })
    }
    console.log('Database record created successfully')

    console.log('=== Signup successful ===')
    return NextResponse.json({
      success: true,
      message: 'Account created successfully! You can now log in.',
    })
  } catch (error: any) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
