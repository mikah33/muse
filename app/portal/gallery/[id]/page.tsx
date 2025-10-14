import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Image from 'next/image'

export default async function CustomerGalleryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: gallery } = await supabase
    .from('galleries')
    .select('*')
    .eq('id', id)
    .eq('customer_id', user.id)
    .single()

  if (!gallery) notFound()

  const { data: photos } = await supabase
    .from('photos')
    .select('*')
    .eq('gallery_id', gallery.id)
    .order('order_position', { ascending: true })

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-charcoal text-white p-6">
        <Link href="/portal" className="text-sm hover:text-gray-300">← Back</Link>
      </nav>
      <div className="max-w-7xl mx-auto p-8">
        <h1 className="text-4xl font-serif mb-8">{gallery.gallery_name}</h1>
        {!photos || photos.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">No photos yet</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {photos.map((photo) => (
              <div key={photo.id} className="relative aspect-[4/5]">
                <Image src={photo.photo_url} alt="" fill className="object-cover rounded-lg shadow" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
