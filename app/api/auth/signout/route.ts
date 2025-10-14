import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error('Signout error:', error)
  }

  // Get the origin from the request to build the redirect URL
  const origin = new URL(request.url).origin
  return NextResponse.redirect(new URL('/login', origin))
}
