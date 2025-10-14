import Header from '@/components/shared/Header'
import Footer from '@/components/shared/Footer'

export default function TermsPage() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-white">
        {/* Hero */}
        <div className="bg-charcoal text-white py-32 px-8 pt-40">
          <div className="max-w-4xl mx-auto">
            <h1 className="font-serif text-5xl md:text-6xl mb-6">Terms of Service</h1>
            <p className="text-xl text-gray-300">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-8 py-20">
          <div className="prose prose-lg max-w-none space-y-8">
            <section>
              <h2 className="font-serif text-3xl mb-4">Agreement to Terms</h2>
              <p className="text-gray-700 leading-relaxed">
                By accessing and using Model Muse Studio's website and services, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using our services.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-3xl mb-4">Services</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Model Muse Studio provides professional photography services including, but not limited to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Model portfolio photography sessions</li>
                <li>Actor and actress headshots</li>
                <li>Comp card design and production</li>
                <li>Digital portrait photography</li>
                <li>Photo editing and retouching services</li>
              </ul>
            </section>

            <section>
              <h2 className="font-serif text-3xl mb-4">Booking and Payment</h2>

              <h3 className="font-serif text-xl mb-3 mt-6">Booking Policy</h3>
              <p className="text-gray-700 leading-relaxed">
                Sessions must be booked in advance through our website, email, or phone. A deposit may be required to secure your booking date.
              </p>

              <h3 className="font-serif text-xl mb-3 mt-6">Payment Terms</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Full payment is due at the time of the session unless otherwise agreed</li>
                <li>We accept major credit cards, debit cards, and other payment methods as specified</li>
                <li>Prices are subject to change, but quoted prices will be honored for booked sessions</li>
              </ul>

              <h3 className="font-serif text-xl mb-3 mt-6">Cancellation Policy</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Cancellations made 48 hours or more before the scheduled session will receive a full refund</li>
                <li>Cancellations made less than 48 hours before the session may forfeit the deposit</li>
                <li>No-shows will forfeit all payments made</li>
                <li>We reserve the right to reschedule due to unforeseen circumstances</li>
              </ul>
            </section>

            <section>
              <h2 className="font-serif text-3xl mb-4">Image Rights and Usage</h2>

              <h3 className="font-serif text-xl mb-3 mt-6">Copyright</h3>
              <p className="text-gray-700 leading-relaxed">
                All photographs created during sessions remain the intellectual property of Model Muse Studio. Clients receive a license to use the images for personal and professional purposes as outlined in their package.
              </p>

              <h3 className="font-serif text-xl mb-3 mt-6">Client Usage Rights</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Unless otherwise specified in writing, clients may use their images for:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Personal portfolios (print and digital)</li>
                <li>Social media posting</li>
                <li>Submission to modeling/acting agencies</li>
                <li>Comp cards and promotional materials</li>
              </ul>

              <h3 className="font-serif text-xl mb-3 mt-6">Studio Usage Rights</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Model Muse Studio reserves the right to use session images for:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Portfolio and website display</li>
                <li>Marketing and promotional materials</li>
                <li>Social media content</li>
                <li>Educational purposes</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                Clients who do not wish their images to be used for promotional purposes must notify us in writing prior to the session.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-3xl mb-4">Session Guidelines</h2>

              <h3 className="font-serif text-xl mb-3 mt-6">Client Responsibilities</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Arrive on time for your scheduled session</li>
                <li>Come prepared with appropriate wardrobe and styling</li>
                <li>Follow direction and guidance from the photographer</li>
                <li>Maintain professional behavior throughout the session</li>
              </ul>

              <h3 className="font-serif text-xl mb-3 mt-6">Studio Responsibilities</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Provide professional photography services as described</li>
                <li>Deliver edited images within the agreed timeframe</li>
                <li>Maintain a safe and professional environment</li>
                <li>Protect client privacy and personal information</li>
              </ul>
            </section>

            <section>
              <h2 className="font-serif text-3xl mb-4">Delivery and Turnaround</h2>
              <p className="text-gray-700 leading-relaxed">
                Standard turnaround time for edited images is 7-14 business days from the session date. Rush processing may be available for an additional fee. Delays due to circumstances beyond our control will be communicated promptly.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-3xl mb-4">Limitation of Liability</h2>
              <p className="text-gray-700 leading-relaxed">
                Model Muse Studio's liability is limited to the amount paid for services. We are not liable for indirect, incidental, or consequential damages. We maintain liability insurance and take reasonable precautions to protect equipment and client belongings.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-3xl mb-4">Force Majeure</h2>
              <p className="text-gray-700 leading-relaxed">
                We are not responsible for failure to perform services due to circumstances beyond our control, including but not limited to: natural disasters, equipment failure, illness, or other unforeseen events.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-3xl mb-4">Modifications to Terms</h2>
              <p className="text-gray-700 leading-relaxed">
                We reserve the right to modify these Terms of Service at any time. Changes will be posted on this page with an updated revision date. Continued use of our services after changes constitutes acceptance of the modified terms.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-3xl mb-4">Governing Law</h2>
              <p className="text-gray-700 leading-relaxed">
                These Terms of Service are governed by the laws of the State of North Carolina, United States. Any disputes will be resolved in the courts of Cumberland County, North Carolina.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-3xl mb-4">Contact Information</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                For questions about these Terms of Service, please contact us:
              </p>
              <div className="bg-gray-50 p-6 rounded">
                <p className="text-gray-700"><strong>Model Muse Studio</strong></p>
                <p className="text-gray-700">Fayetteville, NC</p>
                <p className="text-gray-700">Email: contact@modelmusestudio.com</p>
                <p className="text-gray-700">Phone: 910-703-7477</p>
              </div>
            </section>

            <section className="border-t pt-8 mt-12">
              <p className="text-sm text-gray-600 italic">
                By using our services, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service and our Privacy Policy.
              </p>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
