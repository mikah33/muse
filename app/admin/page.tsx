import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import HeroImageUpload from '@/components/admin/HeroImageUpload'

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Get current hero image
  const { data: heroSetting } = await supabase
    .from('site_settings')
    .select('value')
    .eq('key', 'hero_image')
    .single()

  const currentHeroImage = heroSetting?.value || '/images/hero-image.jpg'

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow p-6 md:p-8 mb-6">
          <h1 className="text-2xl md:text-3xl font-serif mb-2">Admin Dashboard</h1>
          <p className="text-sm md:text-base text-gray-600">Welcome, {user?.email}</p>
        </div>

        {/* Hero Image Management */}
        <div className="bg-white rounded-lg shadow p-6 md:p-8 mb-6">
          <h2 className="text-xl md:text-2xl font-semibold mb-4">Homepage Hero Image</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Current Image Preview */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Current Image:</h3>
              <div className="relative w-full aspect-video bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                {currentHeroImage && currentHeroImage !== '/images/hero-image.jpg' ? (
                  <img
                    src={currentHeroImage}
                    alt="Current hero"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center p-8">
                    <svg className="mx-auto h-12 w-12 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-sm text-gray-500">No hero image uploaded yet</p>
                  </div>
                )}
              </div>
            </div>

            {/* Upload Section */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Upload New Image:</h3>
              <p className="text-xs text-gray-600 mb-4">
                Recommended size: 1920x1080px (16:9 ratio) • Max 5MB
              </p>
              <HeroImageUpload currentImage={currentHeroImage} />
              <Link
                href="/admin/settings"
                className="inline-block mt-4 text-sm text-black hover:text-gray-700 underline"
              >
                Go to Settings →
              </Link>
            </div>
          </div>
        </div>

        {/* Management Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <div className="bg-white rounded-lg shadow p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-semibold mb-2">Blog Management</h2>
            <p className="text-sm text-gray-600 mb-4">Create and manage blog posts</p>
            <Link
              href="/admin/blog"
              className="inline-block px-6 py-2 bg-black text-white text-sm tracking-wider hover:bg-gray-800 transition-colors"
            >
              MANAGE BLOG
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-semibold mb-2">Portfolio Management</h2>
            <p className="text-sm text-gray-600 mb-4">Upload and manage portfolio items</p>
            <Link
              href="/admin/portfolio"
              className="inline-block px-6 py-2 bg-black text-white text-sm tracking-wider hover:bg-gray-800 transition-colors"
            >
              MANAGE PORTFOLIO
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-semibold mb-2">Customer Management</h2>
            <p className="text-sm text-gray-600 mb-4">Create and manage customer accounts & galleries</p>
            <Link
              href="/admin/customers"
              className="inline-block px-6 py-2 bg-black text-white text-sm tracking-wider hover:bg-gray-800 transition-colors"
            >
              MANAGE CUSTOMERS
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-semibold mb-2">Custom Pages</h2>
            <p className="text-sm text-gray-600 mb-4">Create custom pages for your site navigation</p>
            <Link
              href="/admin/pages"
              className="inline-block px-6 py-2 bg-black text-white text-sm tracking-wider hover:bg-gray-800 transition-colors"
            >
              MANAGE PAGES
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-semibold mb-2">Page Content Editor</h2>
            <p className="text-sm text-gray-600 mb-4">Edit About, Services, Portfolio & Contact pages</p>
            <Link
              href="/admin/pages-editor"
              className="inline-block px-6 py-2 bg-black text-white text-sm tracking-wider hover:bg-gray-800 transition-colors"
            >
              EDIT PAGES
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-semibold mb-2">Homepage Content</h2>
            <p className="text-sm text-gray-600 mb-4">Edit homepage sections and text</p>
            <Link
              href="/admin/homepage"
              className="inline-block px-6 py-2 bg-black text-white text-sm tracking-wider hover:bg-gray-800 transition-colors"
            >
              EDIT HOMEPAGE
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-semibold mb-2">Site Settings</h2>
            <p className="text-sm text-gray-600 mb-4">Manage site configuration</p>
            <Link
              href="/admin/settings"
              className="inline-block px-6 py-2 bg-black text-white text-sm tracking-wider hover:bg-gray-800 transition-colors"
            >
              SETTINGS
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
