'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface Customer {
  id: string
  full_name: string
  email: string
}

interface CreateGalleryFormProps {
  customers: Customer[]
  preselectedCustomerId?: string
}

export default function CreateGalleryForm({ customers, preselectedCustomerId }: CreateGalleryFormProps) {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    customer_id: preselectedCustomerId || '',
    gallery_name: '',
    description: '',
    shoot_date: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { data, error: insertError } = await supabase
        .from('galleries')
        .insert({
          customer_id: formData.customer_id,
          gallery_name: formData.gallery_name,
          description: formData.description || null,
          shoot_date: formData.shoot_date || null,
          is_active: true,
        })
        .select()
        .single()

      if (insertError) throw insertError

      router.push(`/admin/galleries/${data.id}`)
      router.refresh()
    } catch (err: any) {
      console.error('Error creating gallery:', err)
      setError(err.message || 'Failed to create gallery')
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

      <div className="space-y-6">
        {/* Customer Selection */}
        <div>
          <label className="block text-sm font-medium mb-2">Customer *</label>
          <select
            value={formData.customer_id}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, customer_id: e.target.value }))
            }
            required
            className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none"
          >
            <option value="">Select a customer</option>
            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.full_name} ({customer.email})
              </option>
            ))}
          </select>
        </div>

        {/* Gallery Name */}
        <div>
          <label className="block text-sm font-medium mb-2">Gallery Name *</label>
          <input
            type="text"
            value={formData.gallery_name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, gallery_name: e.target.value }))
            }
            required
            className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none"
            placeholder="Summer 2024 Photoshoot"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, description: e.target.value }))
            }
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none"
            placeholder="Brief description of the photoshoot..."
          />
        </div>

        {/* Shoot Date */}
        <div>
          <label className="block text-sm font-medium mb-2">Shoot Date</label>
          <input
            type="date"
            value={formData.shoot_date}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, shoot_date: e.target.value }))
            }
            className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-4 pt-6 border-t">
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 bg-black text-white tracking-wider hover:bg-gray-900 transition-colors disabled:bg-gray-400"
          >
            {loading ? 'CREATING...' : 'CREATE GALLERY'}
          </button>

          <button
            type="button"
            onClick={() => router.back()}
            className="px-8 py-3 border border-gray-300 tracking-wider hover:bg-gray-50 transition-colors"
          >
            CANCEL
          </button>
        </div>
      </div>
    </form>
  )
}
