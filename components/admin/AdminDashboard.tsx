'use client'

import { useState } from 'react'
import Link from 'next/link'
import { signOut } from '@/lib/auth/auth-helpers'
import type { User, Gallery } from '@/types/database'

interface AdminDashboardProps {
  user: User
  customers: User[]
  recentGalleries: Gallery[]
  unassignedPhotosCount: number
}

export default function AdminDashboard({
  user,
  customers,
  recentGalleries,
  unassignedPhotosCount,
}: AdminDashboardProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-off-white">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="font-serif text-2xl tracking-widest">
                MODEL MUSE
                <span className="block text-xs font-sans tracking-[0.3em]">
                  ADMIN
                </span>
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">{user.full_name}</span>
              <form action={signOut}>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm border border-gray-300 hover:bg-gray-50 transition-colors"
                >
                  Sign Out
                </button>
              </form>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 border border-gray-200">
            <div className="text-sm tracking-wider text-gray-600 mb-2">
              TOTAL CUSTOMERS
            </div>
            <div className="text-4xl font-serif">{customers.length}</div>
          </div>
          <div className="bg-white p-6 border border-gray-200">
            <div className="text-sm tracking-wider text-gray-600 mb-2">
              TOTAL GALLERIES
            </div>
            <div className="text-4xl font-serif">{recentGalleries.length}</div>
          </div>
          <div className="bg-white p-6 border border-gray-200">
            <div className="text-sm tracking-wider text-gray-600 mb-2">
              UNASSIGNED PHOTOS
            </div>
            <div className="text-4xl font-serif">{unassignedPhotosCount}</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Link
            href="/admin/customers/new"
            className="p-6 bg-black text-white text-center hover:bg-gray-900 transition-colors"
          >
            <div className="text-sm tracking-widest">NEW CUSTOMER</div>
          </Link>
          <Link
            href="/admin/photos/upload"
            className="p-6 bg-black text-white text-center hover:bg-gray-900 transition-colors"
          >
            <div className="text-sm tracking-widest">UPLOAD PHOTOS</div>
          </Link>
          <Link
            href="/admin/galleries"
            className="p-6 border-2 border-black text-center hover:bg-black hover:text-white transition-all"
          >
            <div className="text-sm tracking-widest">MANAGE GALLERIES</div>
          </Link>
          <Link
            href="/admin/customers"
            className="p-6 border-2 border-black text-center hover:bg-black hover:text-white transition-all"
          >
            <div className="text-sm tracking-widest">VIEW CUSTOMERS</div>
          </Link>
        </div>

        {/* Website Management */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold tracking-wider mb-4">WEBSITE MANAGEMENT</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Link
              href="/admin/services-editor"
              className="p-6 bg-white border-2 border-gray-300 text-center hover:border-black hover:bg-gray-50 transition-all"
            >
              <div className="text-2xl mb-2">📋</div>
              <div className="text-sm tracking-widest">EDIT SERVICES</div>
              <div className="text-xs text-gray-600 mt-2">Edit the 5 service sections</div>
            </Link>
            <Link
              href="/admin/homepage"
              className="p-6 bg-white border-2 border-gray-300 text-center hover:border-black hover:bg-gray-50 transition-all"
            >
              <div className="text-2xl mb-2">🏠</div>
              <div className="text-sm tracking-widest">EDIT HOMEPAGE</div>
              <div className="text-xs text-gray-600 mt-2">Hero, About sections</div>
            </Link>
            <Link
              href="/admin/settings"
              className="p-6 bg-white border-2 border-gray-300 text-center hover:border-black hover:bg-gray-50 transition-all"
            >
              <div className="text-2xl mb-2">⚙️</div>
              <div className="text-sm tracking-widest">SETTINGS</div>
              <div className="text-xs text-gray-600 mt-2">Site configuration</div>
            </Link>
            <Link
              href="/admin/pages"
              className="p-6 bg-white border-2 border-gray-300 text-center hover:border-black hover:bg-gray-50 transition-all"
            >
              <div className="text-2xl mb-2">📄</div>
              <div className="text-sm tracking-widest">PAGES</div>
              <div className="text-xs text-gray-600 mt-2">Manage site pages</div>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Customers */}
          <div className="bg-white border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold tracking-wider">
                RECENT CUSTOMERS
              </h2>
            </div>
            <div className="divide-y divide-gray-200">
              {customers.slice(0, 5).map((customer) => (
                <Link
                  key={customer.id}
                  href={`/admin/customers/${customer.id}`}
                  className="block p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="font-medium">{customer.full_name}</div>
                  <div className="text-sm text-gray-600">{customer.email}</div>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Galleries */}
          <div className="bg-white border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold tracking-wider">
                RECENT GALLERIES
              </h2>
            </div>
            <div className="divide-y divide-gray-200">
              {recentGalleries.slice(0, 5).map((gallery) => (
                <Link
                  key={gallery.id}
                  href={`/admin/galleries/${gallery.id}`}
                  className="block p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="font-medium">{gallery.gallery_name}</div>
                  <div className="text-sm text-gray-600">
                    {new Date(gallery.created_at).toLocaleDateString()}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
