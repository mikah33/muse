'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function AdminLoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      console.log('Attempting login with:', email)

      // Sign in with Supabase
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) {
        console.error('Auth error:', authError)
        throw authError
      }

      console.log('Login successful, user:', data.user?.id)

      // Check if user exists in users table and has admin role
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('role')
        .eq('id', data.user!.id)
        .single()

      console.log('User data:', userData, 'Error:', userError)

      if (userError || !userData) {
        throw new Error('User record not found. Please contact administrator.')
      }

      if (userData.role !== 'admin') {
        await supabase.auth.signOut()
        throw new Error('Access denied. Admin role required.')
      }

      // Redirect to admin dashboard
      console.log('Redirecting to /admin')
      router.push('/admin')
      router.refresh()
    } catch (err: any) {
      console.error('Login error:', err)
      setError(err.message || 'An error occurred during login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-2 tracking-wider">
          EMAIL
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none transition-colors"
          placeholder="admin@modelmusestudio.com"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium mb-2 tracking-wider">
          PASSWORD
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none transition-colors"
          placeholder="••••••••"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 bg-black text-white tracking-widest text-sm hover:bg-gray-900 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {loading ? 'SIGNING IN...' : 'SIGN IN'}
      </button>
    </form>
  )
}
