import CustomerLoginForm from '@/components/customer/CustomerLoginForm'
import Link from 'next/link'

export default function CustomerLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-charcoal">
      <div className="w-full max-w-md">
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
            <h2 className="text-3xl font-serif mb-2">Client Portal</h2>
            <p className="text-gray-600">Sign in to view your galleries</p>
          </div>
          <CustomerLoginForm />

          {/* Signup Link */}
          <div className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link href="/signup" className="text-black font-semibold hover:underline">
              Sign Up
            </Link>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-400">
          <p>
            Are you a photographer?{' '}
            <Link href="/admin/login" className="text-white hover:underline">
              Admin login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
