import HeaderWrapper from '@/components/shared/HeaderWrapper'
import Footer from '@/components/shared/Footer'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Us - Model Muse Studio | Fayetteville NC Photography',
  description: 'Get in touch with Model Muse Studio for professional photography services in Fayetteville NC. Contact us for model portfolios, headshots, and creative portraiture.',
  openGraph: {
    title: 'Contact Model Muse Studio - Fayetteville NC',
    description: 'Ready to elevate your portfolio? Reach out to book your session.',
    type: 'website',
  },
}

export default function ContactPage() {
  const contactSchema = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    mainEntity: {
      '@type': 'ProfessionalService',
      name: 'Model Muse Studio',
      telephone: '910-703-7477',
      email: 'contact@modelmusestudio.com',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Fayetteville',
        addressRegion: 'NC',
        addressCountry: 'US',
      },
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          opens: '09:00',
          closes: '18:00',
        },
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: 'Saturday',
          opens: '10:00',
          closes: '16:00',
        },
      ],
      sameAs: [
        'https://www.instagram.com/model.muse.studio/',
        'https://www.facebook.com/model.muse.studio',
      ],
    },
  }

  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Model Muse Studio',
    image: 'https://modelmusestudio.com/images/logo.png',
    description: 'Professional photography studio in Fayetteville NC',
    url: 'https://modelmusestudio.com',
    telephone: '910-703-7477',
    email: 'contact@modelmusestudio.com',
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Fayetteville',
      addressRegion: 'NC',
      addressCountry: 'US',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 35.0527,
      longitude: -78.8784,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '18:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Saturday',
        opens: '10:00',
        closes: '16:00',
      },
    ],
    sameAs: [
      'https://www.instagram.com/model.muse.studio/',
      'https://www.facebook.com/model.muse.studio',
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <HeaderWrapper />
      <div className="min-h-screen bg-white">
        {/* Hero */}
        <div className="bg-charcoal text-white py-24 md:py-32 px-6 md:px-8 pt-32 md:pt-40">
          <div className="max-w-7xl mx-auto">
            <h1 className="font-serif text-5xl md:text-6xl mb-6">Get in Touch</h1>
            <p className="text-xl text-gray-300 max-w-2xl">
              Ready to elevate your portfolio? Reach out to book your session or ask any questions.
            </p>
          </div>
        </div>

        {/* Contact Content */}
        <div className="max-w-7xl mx-auto px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Info */}
            <div>
              <h2 className="font-serif text-3xl mb-8">Contact Information</h2>

              <div className="space-y-6">
                {/* Email */}
                <div>
                  <h3 className="text-sm tracking-[0.2em] text-gray-500 mb-2">EMAIL</h3>
                  <a
                    href="mailto:contact@modelmusestudio.com"
                    className="text-xl hover:text-gray-600 transition-colors"
                  >
                    contact@modelmusestudio.com
                  </a>
                </div>

                {/* Phone */}
                <div>
                  <h3 className="text-sm tracking-[0.2em] text-gray-500 mb-2">OFFICE</h3>
                  <a
                    href="tel:910-703-7477"
                    className="text-xl hover:text-gray-600 transition-colors"
                  >
                    910-703-7477
                  </a>
                </div>

                {/* Social Media */}
                <div>
                  <h3 className="text-sm tracking-[0.2em] text-gray-500 mb-4">FOLLOW US</h3>
                  <div className="flex gap-4">
                    <a
                      href="https://www.instagram.com/model.muse.studio/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-3 border border-black hover:bg-black hover:text-white transition-colors tracking-wider text-sm"
                    >
                      INSTAGRAM
                    </a>
                    <a
                      href="https://www.facebook.com/model.muse.studio"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-3 border border-black hover:bg-black hover:text-white transition-colors tracking-wider text-sm"
                    >
                      FACEBOOK
                    </a>
                  </div>
                </div>

                {/* Hours */}
                <div className="pt-6 border-t">
                  <h3 className="text-sm tracking-[0.2em] text-gray-500 mb-4">STUDIO HOURS</h3>
                  <div className="space-y-2 text-gray-700">
                    <div className="flex justify-between">
                      <span>Monday - Friday</span>
                      <span>9:00 AM - 6:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Saturday</span>
                      <span>10:00 AM - 4:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sunday</span>
                      <span>By Appointment Only</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-gray-50 p-8 lg:p-12">
              <h2 className="font-serif text-3xl mb-6">Send a Message</h2>

              <form className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm tracking-wider mb-2">
                    NAME *
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm tracking-wider mb-2">
                    EMAIL *
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm tracking-wider mb-2">
                    PHONE
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="service" className="block text-sm tracking-wider mb-2">
                    INTERESTED IN
                  </label>
                  <select
                    id="service"
                    className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none"
                  >
                    <option value="">Select a service</option>
                    <option value="portfolio">Modeling Portfolio</option>
                    <option value="headshots">Actor Headshots</option>
                    <option value="fashion">Fashion Photography</option>
                    <option value="beauty">Beauty Photography</option>
                    <option value="editorial">Editorial Shoots</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm tracking-wider mb-2">
                    MESSAGE *
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-black text-white tracking-widest text-sm hover:bg-gray-900 transition-colors"
                >
                  SEND MESSAGE
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
