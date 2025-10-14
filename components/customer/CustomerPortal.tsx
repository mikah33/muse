'use client'

import Link from 'next/link'
import Image from 'next/image'
import { signOut } from '@/lib/auth/auth-helpers'
import type { User, GalleryWithPhotos } from '@/types/database'

interface CustomerPortalProps {
  user: User
  galleries: any[]
  totalPhotos: number
  favoritesCount: number
}

export default function CustomerPortal({
  user,
  galleries,
  totalPhotos,
  favoritesCount,
}: CustomerPortalProps) {
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
                  STUDIO
                </span>
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/portal/favorites"
                className="text-sm text-gray-600 hover:text-black transition-colors"
              >
                Favorites ({favoritesCount})
              </Link>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-serif mb-4">
            Welcome back,
            <span className="block italic font-light mt-2">{user.full_name}</span>
          </h1>
          <p className="text-gray-600 text-lg">
            You have {galleries.length} {galleries.length === 1 ? 'gallery' : 'galleries'} with {totalPhotos} photos
          </p>
        </div>

        {/* Galleries Grid */}
        {galleries.length === 0 ? (
          <div className="text-center py-20">
            <h2 className="text-2xl font-serif mb-4">No Galleries Yet</h2>
            <p className="text-gray-600 mb-8">
              Your photographer will assign galleries to your account soon.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {galleries.map((gallery) => {
              const coverPhoto = gallery.photos?.[0]?.thumbnail_url || '/images/placeholder.jpg'
              const photoCount = gallery.photos?.length || 0

              return (
                <Link
                  key={gallery.id}
                  href={`/portal/gallery/${gallery.id}`}
                  className="group cursor-pointer"
                >
                  <div className="aspect-[4/5] relative overflow-hidden bg-gray-200 mb-4">
                    {photoCount > 0 && (
                      <Image
                        src={coverPhoto}
                        alt={gallery.gallery_name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                  </div>
                  <h3 className="text-xl font-serif mb-2">
                    {gallery.gallery_name}
                  </h3>
                  {gallery.description && (
                    <p className="text-sm text-gray-600 mb-2">
                      {gallery.description}
                    </p>
                  )}
                  <p className="text-sm text-gray-500">
                    {photoCount} {photoCount === 1 ? 'photo' : 'photos'}
                  </p>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
