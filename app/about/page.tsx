import HeaderWrapper from '@/components/shared/HeaderWrapper'
import Footer from '@/components/shared/Footer'
import Hero from '@/components/shared/Hero'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us - Model Muse Studio | Professional Photography Fayetteville NC',
  description: 'Learn about Model Muse Studio, Fayetteville\'s premier photography studio specializing in model portfolios, professional headshots, and creative portraiture. Serving Fort Bragg, Hope Mills, and Cumberland County NC.',
  openGraph: {
    title: 'About Model Muse Studio - Professional Photography Fayetteville NC',
    description: 'Fayetteville\'s premier photography studio for models, actors, and professionals.',
    type: 'website',
  },
}

export default async function AboutPage() {
  const supabase = await createClient()

  const aboutSchema = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    mainEntity: {
      '@type': 'ProfessionalService',
      '@id': 'https://modelmusestudio.com',
      name: 'Model Muse Studio',
      description: 'Professional photography studio specializing in model portfolios, headshots, and creative portraiture in Fayetteville, NC',
      url: 'https://modelmusestudio.com',
      telephone: '910-703-7477',
      email: 'contact@modelmusestudio.com',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Fayetteville',
        addressRegion: 'NC',
        addressCountry: 'US',
      },
      areaServed: [
        'Fayetteville',
        'Fort Bragg',
        'Hope Mills',
        'Raeford',
        'Cumberland County',
      ],
      priceRange: '$$',
    },
  }

  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': 'https://modelmusestudio.com',
    name: 'Model Muse Studio',
    image: 'https://modelmusestudio.com/images/logo.png',
    description: 'Professional photography studio specializing in model portfolios, professional headshots, and creative portraiture in Fayetteville, NC',
    url: 'https://modelmusestudio.com',
    telephone: '910-703-7477',
    email: 'contact@modelmusestudio.com',
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '',
      addressLocality: 'Fayetteville',
      addressRegion: 'NC',
      postalCode: '',
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
    areaServed: [
      {
        '@type': 'City',
        name: 'Fayetteville',
        containedInPlace: { '@type': 'State', name: 'North Carolina' },
      },
      {
        '@type': 'Place',
        name: 'Fort Bragg',
      },
      {
        '@type': 'City',
        name: 'Hope Mills',
        containedInPlace: { '@type': 'State', name: 'North Carolina' },
      },
      {
        '@type': 'City',
        name: 'Raeford',
        containedInPlace: { '@type': 'State', name: 'North Carolina' },
      },
      {
        '@type': 'AdministrativeArea',
        name: 'Cumberland County',
        containedInPlace: { '@type': 'State', name: 'North Carolina' },
      },
    ],
  }

  const { data } = await supabase
    .from('page_content')
    .select('content')
    .eq('page_name', 'about')
    .single()

  const content = data?.content || {
    hero: { title: "More Than Just", subtitle: "Photos" },
    introduction: { paragraph1: "", paragraph2: "", paragraph3: "" },
    whyChoose: {
      title: "Why Choose Model Muse Studio?",
      reason1: { title: "", description: "" },
      reason2: { title: "", description: "" },
      reason3: { title: "", description: "" }
    },
    whatSetsApart: {
      title: "What Sets Us Apart?",
      feature1: { icon: "📸", title: "", description: "" },
      feature2: { icon: "✨", title: "", description: "" },
      feature3: { icon: "⚡", title: "", description: "" }
    },
    readySection: { title: "", description: "" },
    ctaSection: { title: "", titleItalic: "", description: "", phone: "", email: "" },
    serviceAreas: { title: "", description: "" }
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <HeaderWrapper />
      <main>
        <Hero
          title={content.hero.title}
          subtitle={content.hero.subtitle}
          showButtons={true}
        />

        {/* Introduction */}
        <section className="py-20 lg:py-32 px-6 lg:px-12 bg-white">
          <div className="max-w-4xl mx-auto">
            <p className="text-2xl lg:text-3xl text-gray-800 leading-relaxed mb-12 font-light first-letter-drop">
              {content.introduction.paragraph1}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <p className="text-lg text-gray-600 leading-relaxed">
                {content.introduction.paragraph2}
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                {content.introduction.paragraph3}
              </p>
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="w-full h-px bg-gray-200"></div>

        {/* Why Choose Us */}
        <section className="py-20 lg:py-32 px-6 lg:px-12 bg-off-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-serif text-5xl lg:text-6xl mb-6">
                {content.whyChoose.title}
              </h2>
              <div className="w-24 h-px bg-black mx-auto"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="text-center">
                <div className="mb-6">
                  <div className="w-20 h-20 mx-auto bg-black text-white rounded-full flex items-center justify-center text-3xl font-serif">
                    1
                  </div>
                </div>
                <h3 className="font-serif text-2xl mb-4">{content.whyChoose.reason1.title}</h3>
                <p className="text-gray-600 leading-relaxed">
                  {content.whyChoose.reason1.description}
                </p>
              </div>

              <div className="text-center">
                <div className="mb-6">
                  <div className="w-20 h-20 mx-auto bg-black text-white rounded-full flex items-center justify-center text-3xl font-serif">
                    2
                  </div>
                </div>
                <h3 className="font-serif text-2xl mb-4">{content.whyChoose.reason2.title}</h3>
                <p className="text-gray-600 leading-relaxed">
                  {content.whyChoose.reason2.description}
                </p>
              </div>

              <div className="text-center">
                <div className="mb-6">
                  <div className="w-20 h-20 mx-auto bg-black text-white rounded-full flex items-center justify-center text-3xl font-serif">
                    3
                  </div>
                </div>
                <h3 className="font-serif text-2xl mb-4">{content.whyChoose.reason3.title}</h3>
                <p className="text-gray-600 leading-relaxed">
                  {content.whyChoose.reason3.description}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* What Sets Us Apart */}
        <section className="py-20 lg:py-32 px-6 lg:px-12 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-serif text-5xl lg:text-6xl mb-6">
                {content.whatSetsApart.title}
              </h2>
              <div className="w-24 h-px bg-black mx-auto"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-gray-200">
              <div className="bg-white p-10 hover:bg-gray-50 transition-colors">
                <div className="text-4xl mb-4">{content.whatSetsApart.feature1.icon}</div>
                <h3 className="font-serif text-2xl mb-4">{content.whatSetsApart.feature1.title}</h3>
                <p className="text-gray-600 leading-relaxed">
                  {content.whatSetsApart.feature1.description}
                </p>
              </div>

              <div className="bg-white p-10 hover:bg-gray-50 transition-colors">
                <div className="text-4xl mb-4">{content.whatSetsApart.feature2.icon}</div>
                <h3 className="font-serif text-2xl mb-4">{content.whatSetsApart.feature2.title}</h3>
                <p className="text-gray-600 leading-relaxed">
                  {content.whatSetsApart.feature2.description}
                </p>
              </div>

              <div className="bg-white p-10 hover:bg-gray-50 transition-colors">
                <div className="text-4xl mb-4">{content.whatSetsApart.feature3.icon}</div>
                <h3 className="font-serif text-2xl mb-4">{content.whatSetsApart.feature3.title}</h3>
                <p className="text-gray-600 leading-relaxed">
                  {content.whatSetsApart.feature3.description}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Ready Section */}
        <section className="py-20 lg:py-32 px-6 lg:px-12 bg-pure-black text-white text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-serif text-5xl lg:text-6xl mb-8">
              {content.readySection.title}
            </h2>
            <div className="w-24 h-px bg-white mx-auto mb-8"></div>
            <p className="text-xl text-gray-300 mb-12 leading-relaxed">
              {content.readySection.description}
            </p>
            <Link
              href="/contact"
              className="inline-block px-12 py-4 bg-white text-black tracking-widest text-sm hover:bg-gray-100 transition-colors"
            >
              CONTACT US
            </Link>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 lg:py-40 px-6 lg:px-12 bg-off-white text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-serif text-5xl lg:text-6xl mb-8 leading-tight">
              {content.ctaSection.title}
              <span className="block italic font-light mt-3">{content.ctaSection.titleItalic}</span>
            </h2>
            <div className="w-24 h-px bg-black mx-auto mb-10"></div>
            <p className="text-xl text-gray-700 mb-16 leading-relaxed max-w-3xl mx-auto">
              {content.ctaSection.description}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 max-w-2xl mx-auto text-left">
              <div className="bg-white p-8 border border-gray-200">
                <p className="text-sm tracking-widest uppercase text-gray-500 mb-3">Phone</p>
                <a href={`tel:${content.ctaSection.phone.replace(/[^0-9]/g, '')}`} className="text-2xl font-serif hover:opacity-70 transition-opacity">
                  {content.ctaSection.phone}
                </a>
              </div>
              <div className="bg-white p-8 border border-gray-200">
                <p className="text-sm tracking-widest uppercase text-gray-500 mb-3">Email</p>
                <a href={`mailto:${content.ctaSection.email}`} className="text-2xl font-serif hover:opacity-70 transition-opacity break-all">
                  {content.ctaSection.email}
                </a>
              </div>
            </div>

            <Link
              href="/contact"
              className="inline-block px-16 py-5 bg-black text-white tracking-widest text-sm hover:bg-gray-900 transition-colors"
            >
              LET'S GET STARTED
            </Link>
          </div>
        </section>

        {/* Service Areas */}
        <section className="py-20 px-6 lg:px-12 bg-white border-t border-gray-200">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="font-serif text-4xl lg:text-5xl mb-8">
              {content.serviceAreas.title}
            </h2>
            <div className="w-24 h-px bg-black mx-auto mb-10"></div>
            <p className="text-lg text-gray-600 leading-relaxed max-w-4xl mx-auto">
              {content.serviceAreas.description}
            </p>
          </div>
        </section>

        {/* Bottom Tagline */}
        <section className="py-16 px-6 bg-pure-black text-white text-center">
          <p className="font-serif text-3xl lg:text-4xl tracking-wide mb-2">
            Model Muse Studio
          </p>
          <p className="text-xl text-gray-400 font-light tracking-wider">
            Frame Your Confidence
          </p>
        </section>
      </main>
      <Footer />
    </>
  )
}
