import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function CustomerPortalPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: userInfo } = await supabase
    .from('users')
    .select('full_name')
    .eq('id', user.id)
    .single()

  const { data: galleries } = await supabase
    .from('galleries')
    .select('*')
    .eq('customer_id', user.id)
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-charcoal text-white p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="font-serif text-2xl tracking-widest">
            MODEL MUSE
          </Link>
          <div className="flex items-center gap-4 text-sm">
            <span>{userInfo?.full_name}</span>
            <form action="/api/auth/signout" method="post">
              <button className="px-4 py-2 border border-gray-600 hover:bg-gray-800">
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-8">
        <h1 className="text-4xl font-serif mb-8">Your Galleries</h1>

        {!galleries || galleries.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-400">No galleries yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleries.map((gallery) => (
              <Link
                key={gallery.id}
                href={`/portal/gallery/${gallery.id}`}
                className="bg-white rounded-lg shadow hover:shadow-xl transition-shadow p-6"
              >
                <h3 className="text-xl font-serif mb-2">{gallery.gallery_name}</h3>
                {gallery.description && (
                  <p className="text-gray-600 text-sm">{gallery.description}</p>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
