import HeaderWrapper from '@/components/shared/HeaderWrapper'
import Footer from '@/components/shared/Footer'

export default function PrivacyPage() {
  return (
    <>
      <HeaderWrapper />
      <div className="min-h-screen bg-white">
        {/* Hero */}
        <div className="bg-charcoal text-white py-32 px-8 pt-40">
          <div className="max-w-4xl mx-auto">
            <h1 className="font-serif text-5xl md:text-6xl mb-6">Privacy Policy</h1>
            <p className="text-xl text-gray-300">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-8 py-20">
          <div className="prose prose-lg max-w-none space-y-8">
            <section>
              <h2 className="font-serif text-3xl mb-4">Introduction</h2>
              <p className="text-gray-700 leading-relaxed">
                Model Muse Studio ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our photography services.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-3xl mb-4">Information We Collect</h2>
              <h3 className="font-serif text-xl mb-3 mt-6">Personal Information</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                We may collect personal information that you voluntarily provide to us when you:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Book a photography session</li>
                <li>Contact us through our website</li>
                <li>Subscribe to our newsletter</li>
                <li>Create an account in our model portal</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-4">
                This information may include: name, email address, phone number, mailing address, payment information, and any other information you choose to provide.
              </p>

              <h3 className="font-serif text-xl mb-3 mt-6">Photographic Content</h3>
              <p className="text-gray-700 leading-relaxed">
                During photography sessions, we create images that may include your likeness. The use of these images is governed by our separate model release agreements.
              </p>

              <h3 className="font-serif text-xl mb-3 mt-6">Automatically Collected Information</h3>
              <p className="text-gray-700 leading-relaxed">
                We may automatically collect certain information about your device and usage patterns, including IP address, browser type, operating system, and pages visited.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-3xl mb-4">How We Use Your Information</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Provide and manage our photography services</li>
                <li>Process your bookings and payments</li>
                <li>Communicate with you about your sessions</li>
                <li>Send you marketing communications (with your consent)</li>
                <li>Improve our website and services</li>
                <li>Respond to your inquiries and provide customer support</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="font-serif text-3xl mb-4">Information Sharing</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We do not sell your personal information. We may share your information with:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li><strong>Service Providers:</strong> Third parties who assist us in operating our business (e.g., payment processors, email services)</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                <li><strong>Business Transfers:</strong> In connection with a merger, sale, or acquisition of our business</li>
              </ul>
            </section>

            <section>
              <h2 className="font-serif text-3xl mb-4">Data Security</h2>
              <p className="text-gray-700 leading-relaxed">
                We implement appropriate technical and organizational measures to protect your personal information. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-3xl mb-4">Your Rights</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                You have the right to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Access the personal information we hold about you</li>
                <li>Request correction of inaccurate information</li>
                <li>Request deletion of your information</li>
                <li>Opt-out of marketing communications</li>
                <li>Withdraw consent where processing is based on consent</li>
              </ul>
            </section>

            <section>
              <h2 className="font-serif text-3xl mb-4">Cookies and Tracking</h2>
              <p className="text-gray-700 leading-relaxed">
                We use cookies and similar tracking technologies to enhance your experience on our website. You can control cookie settings through your browser preferences.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-3xl mb-4">Children's Privacy</h2>
              <p className="text-gray-700 leading-relaxed">
                Our services are not directed to individuals under 18. We do not knowingly collect personal information from children. If you are a parent or guardian and believe your child has provided us with information, please contact us.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-3xl mb-4">Changes to This Policy</h2>
              <p className="text-gray-700 leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-3xl mb-4">Contact Us</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                If you have questions about this Privacy Policy, please contact us:
              </p>
              <div className="bg-gray-50 p-6 rounded">
                <p className="text-gray-700"><strong>Model Muse Studio</strong></p>
                <p className="text-gray-700">Fayetteville, NC</p>
                <p className="text-gray-700">Email: contact@modelmusestudio.com</p>
                <p className="text-gray-700">Phone: 910-703-7477</p>
              </div>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
