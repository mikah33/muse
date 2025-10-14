// Authentication helper functions
'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import type { UserRole } from '@/types/database'

export async function getSession() {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  return session
}

export async function getCurrentUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  // Get user details with role
  const { data: userData } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  return userData
}

export async function requireAuth(role?: UserRole) {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  if (role && user.role !== role) {
    if (role === 'admin') {
      redirect('/admin/login')
    } else {
      redirect('/login')
    }
  }

  return user
}

export async function requireAdmin() {
  return await requireAuth('admin')
}

export async function requireCustomer() {
  return await requireAuth('customer')
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
