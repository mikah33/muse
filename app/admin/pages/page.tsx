import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function CustomPagesManagement() {
  const supabase = await createClient()

  // Verify admin access
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/admin/login')
  }

  // Fetch custom pages
  const { data: pages } = await supabase
    .from('custom_pages')
    .select('*')
    .order('order_position')

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-serif mb-2">Custom Pages</h1>
              <p className="text-sm md:text-base text-gray-600">
                Create custom pages that appear in your site navigation
              </p>
            </div>
            <Link
              href="/admin/pages/new"
              className="px-6 py-3 bg-black text-white text-sm tracking-wider hover:bg-gray-900 transition-colors text-center"
            >
              CREATE PAGE
            </Link>
          </div>
        </div>

        {/* Pages List */}
        <div className="bg-white rounded-lg shadow">
          {!pages || pages.length === 0 ? (
            <div className="text-center py-12 px-4">
              <h2 className="text-xl font-serif mb-2">No Custom Pages Yet</h2>
              <p className="text-gray-600 mb-6">
                Create your first custom page to add it to your site navigation
              </p>
              <Link
                href="/admin/pages/new"
                className="inline-block px-6 py-3 bg-black text-white text-sm tracking-wider hover:bg-gray-900 transition-colors"
              >
                CREATE FIRST PAGE
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Slug
                    </th>
                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order
                    </th>
                    <th className="px-4 md:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pages.map((page) => (
                    <tr key={page.id} className="hover:bg-gray-50">
                      <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {page.title}
                        </div>
                      </td>
                      <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">/{page.slug}</div>
                      </td>
                      <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            page.published
                              ? 'bg-black text-white'
                              : 'bg-gray-200 text-gray-700'
                          }`}
                        >
                          {page.published ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {page.order_position}
                      </td>
                      <td className="px-4 md:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link
                          href={`/admin/pages/edit/${page.id}`}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          Edit
                        </Link>
                        <Link
                          href={`/${page.slug}`}
                          target="_blank"
                          className="text-gray-600 hover:text-gray-900"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
