'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CreateCustomerForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    phone: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('/api/admin/create-customer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create customer')
      }

      setSuccess(`Customer created! Login: ${formData.email} / ${formData.password}`)

      setTimeout(() => {
        router.push('/admin/customers')
        router.refresh()
      }, 2000)
    } catch (err: any) {
      console.error('Error creating customer:', err)
      setError(err.message || 'Failed to create customer')
    } finally {
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
            placeholder="Jane Doe"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium mb-2">Email *</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, email: e.target.value }))
            }
            required
            className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none"
            placeholder="jane@example.com"
          />
          <p className="text-sm text-gray-500 mt-1">
            Customer will use this email to login
          </p>
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium mb-2">Password *</label>
          <input
            type="text"
            value={formData.password}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, password: e.target.value }))
            }
            required
            minLength={8}
            className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none"
            placeholder="Min 8 characters"
          />
          <p className="text-sm text-gray-500 mt-1">
            Share this password with the customer securely
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
            placeholder="(555) 123-4567"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-4 pt-6 border-t">
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 bg-black text-white tracking-wider hover:bg-gray-900 transition-colors disabled:bg-gray-400"
          >
            {loading ? 'CREATING...' : 'CREATE CUSTOMER'}
          </button>

          <button
            type="button"
            onClick={() => router.push('/admin/customers')}
            className="px-8 py-3 border border-gray-300 tracking-wider hover:bg-gray-50 transition-colors"
          >
            CANCEL
          </button>
        </div>
      </div>
    </form>
  )
}
