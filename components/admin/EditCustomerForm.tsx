'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface Customer {
  id: string
  email: string
  full_name: string
  phone: string | null
}

interface EditCustomerFormProps {
  customer: Customer
}

export default function EditCustomerForm({ customer }: EditCustomerFormProps) {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [formData, setFormData] = useState({
    full_name: customer.full_name,
    email: customer.email,
    phone: customer.phone || '',
    new_password: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      // Update user in database
      const { error: dbError } = await supabase
        .from('users')
        .update({
          full_name: formData.full_name,
          phone: formData.phone || null,
        })
        .eq('id', customer.id)

      if (dbError) throw dbError

      // Update password if provided
      if (formData.new_password) {
        const response = await fetch('/api/admin/update-customer-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: customer.id,
            password: formData.new_password,
          }),
        })

        const data = await response.json()
        if (!response.ok) {
          throw new Error(data.error || 'Failed to update password')
        }
      }

      setSuccess('Customer updated successfully')

      setTimeout(() => {
        router.push(`/admin/customers/${customer.id}`)
        router.refresh()
      }, 1500)
    } catch (err: any) {
      console.error('Error updating customer:', err)
      setError(err.message || 'Failed to update customer')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this customer? This will delete all their galleries and photos.')) {
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/admin/delete-customer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: customer.id }),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete customer')
      }

      router.push('/admin/customers')
      router.refresh()
    } catch (err: any) {
      console.error('Error deleting customer:', err)
      setError(err.message || 'Failed to delete customer')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-8">
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 text-sm">
          {success}
        </div>
      )}

      <div className="space-y-6">
        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium mb-2">Full Name *</label>
          <input
            type="text"
            value={formData.full_name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, full_name: e.target.value }))
            }
            required
            className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none"
          />
        </div>

        {/* Email (read-only) */}
        <div>
          <label className="block text-sm font-medium mb-2">Email</label>
          <input
            type="email"
            value={formData.email}
            disabled
            className="w-full px-4 py-3 border border-gray-200 bg-gray-50 text-gray-500"
          />
          <p className="text-sm text-gray-500 mt-1">
            Email cannot be changed
          </p>
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium mb-2">Phone</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, phone: e.target.value }))
            }
            className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none"
          />
        </div>

        {/* New Password */}
        <div>
          <label className="block text-sm font-medium mb-2">New Password</label>
          <input
            type="text"
            value={formData.new_password}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, new_password: e.target.value }))
            }
            minLength={8}
            className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none"
            placeholder="Leave blank to keep current password"
          />
          <p className="text-sm text-gray-500 mt-1">
            Min 8 characters. Only fill if changing password.
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 pt-6 border-t">
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 bg-black text-white tracking-wider hover:bg-gray-900 transition-colors disabled:bg-gray-400"
          >
            {loading ? 'SAVING...' : 'SAVE CHANGES'}
          </button>

          <button
            type="button"
            onClick={() => router.push(`/admin/customers/${customer.id}`)}
            className="px-8 py-3 border border-gray-300 tracking-wider hover:bg-gray-50 transition-colors"
          >
            CANCEL
          </button>

          <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="ml-auto px-8 py-3 bg-red-600 text-white tracking-wider hover:bg-red-700 transition-colors disabled:bg-gray-400"
          >
            DELETE CUSTOMER
          </button>
        </div>
      </div>
    </form>
  )
}
