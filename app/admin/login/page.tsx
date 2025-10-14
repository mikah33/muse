import AdminLoginForm from '@/components/admin/AdminLoginForm'
import Link from 'next/link'

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-charcoal">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="inline-block mb-12">
          <h2 className="font-serif text-3xl tracking-widest text-white">
            MODEL MUSE
            <span className="block text-xs font-sans tracking-[0.3em] mt-1">
              STUDIO
            </span>
          </h2>
        </Link>

        <div className="bg-white p-8 lg:p-12">
          <div className="mb-8">
            <h2 className="text-3xl font-serif mb-2">Admin Portal</h2>
            <p className="text-gray-600">
              Sign in to manage customers and galleries
            </p>
          </div>

          <AdminLoginForm />
        </div>

        <div className="mt-8 text-center text-sm text-gray-400">
          <p>
            Not an admin?{' '}
            <Link href="/login" className="text-white hover:underline">
              Client login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
