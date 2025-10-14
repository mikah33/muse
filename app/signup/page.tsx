import Header from '@/components/shared/Header'
import Footer from '@/components/shared/Footer'
import SignupForm from '@/components/auth/SignupForm'

export const dynamic = 'force-dynamic'

export default function SignupPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-24 px-6">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-serif mb-3">Create Account</h1>
            <p className="text-gray-600">Sign up to access your photo galleries</p>
          </div>

          <SignupForm />
        </div>
      </main>
      <Footer />
    </>
  )
}
