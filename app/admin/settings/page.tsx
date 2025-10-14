import { createClient } from '@/lib/supabase/server'
import HeroImageUpload from '@/components/admin/HeroImageUpload'

export default async function AdminSettingsPage() {
  const supabase = await createClient()

  // Get current hero image
  const { data: heroSetting } = await supabase
    .from('site_settings')
    .select('value')
    .eq('key', 'hero_image')
    .single()

  const currentHeroImage = heroSetting?.value || '/images/hero-image.jpg'

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-serif mb-2">Site Settings</h1>
          <p className="text-sm md:text-base text-gray-600">Manage your site configuration</p>
        </div>

        {/* Hero Image Section */}
        <div className="bg-white rounded-lg shadow p-4 md:p-6 mb-6">
          <h2 className="text-lg md:text-xl font-semibold mb-4">Homepage Hero Image</h2>
          <p className="text-sm text-gray-600 mb-4">
            Upload a new hero image for your homepage. Recommended size: 1920x1080px (16:9 ratio)
          </p>

          {/* Current Image Preview */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Current Hero Image:</h3>
            <div className="relative w-full aspect-video bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={currentHeroImage}
                alt="Current hero"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Upload Component */}
          <HeroImageUpload currentImage={currentHeroImage} />
        </div>

        {/* Additional Settings (for future use) */}
        <div className="bg-white rounded-lg shadow p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-semibold mb-4">Additional Settings</h2>
          <p className="text-sm text-gray-500">More settings coming soon...</p>
        </div>
      </div>
    </div>
  )
}
