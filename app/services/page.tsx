import Header from '@/components/shared/Header'
import Footer from '@/components/shared/Footer'
import Hero from '@/components/shared/Hero'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Professional Photography Services in Fayetteville NC | Model Muse Studio',
  description: 'Top-rated photographer in Fayetteville, North Carolina specializing in model portfolios, professional headshots, actor photography, and comp cards. Serving Fort Liberty, Hope Mills, Raeford, and Cumberland County.',
  keywords: [
    'photographer Fayetteville NC',
    'photography services Fayetteville North Carolina',
    'professional headshots Fayetteville',
    'model photography Fayetteville NC',
    'actor headshots Fayetteville',
    'portfolio photographer Fayetteville',
    'photography studio Fayetteville NC',
    'professional photographer near Fort Liberty',
    'photography near me Fayetteville',
    'headshot photography Cumberland County',
    'modeling photography Hope Mills NC',
    'actor photography Raeford NC',
    'comp card photography Fayetteville',
    'portrait photographer Fayetteville NC',
    'business headshots Fayetteville',
  ],
  openGraph: {
    title: 'Professional Photography Services Fayetteville NC | Model Muse Studio',
    description: 'Award-winning photographer in Fayetteville serving models, actors, and professionals across Cumberland County, Fort Liberty, and surrounding NC areas.',
    type: 'website',
  },
}

const services = [
  {
    category: 'Professional Photography Services in Fayetteville NC',
    icon: '📸',
    intro: 'Model Muse Studio offers the best photography services in Fayetteville, North Carolina for models, actors, and professionals seeking high-quality portfolio images.',
    items: [
      {
        title: 'Model Portfolio Photography Fayetteville NC',
        description: 'Professional model portfolio sessions in our Fayetteville photography studio featuring multiple outfit changes, studio and outdoor locations, full body shots, and detailed close-ups. Perfect for models in Cumberland County, Fort Liberty, Hope Mills, and Raeford areas seeking agency-quality portfolio photography.',
      },
      {
        title: 'Actor & Actress Headshots Fayetteville',
        description: 'Casting-ready professional headshot photography for theater, film, television, and commercial auditions. Our Fayetteville NC photography studio creates industry-standard actor headshots used by talent agencies and casting directors throughout North Carolina.',
      },
      {
        title: 'Professional Comp Card Design Services',
        description: 'Expert comp card and Z-card design for modeling agencies. Our Fayetteville photography studio creates professionally formatted comp cards with optimized image layouts meeting top modeling agency requirements across North Carolina and nationwide.',
      },
      {
        title: 'Agency Digitals & Polaroids Fayetteville',
        description: 'Professional digitals (polaroids) photography services in Fayetteville NC meeting agency submission standards. Fresh-faced, natural photography required by modeling agencies for talent evaluation and casting.',
      },
    ],
  },
  {
    category: 'Photography Package Options - Fayetteville NC',
    icon: '💼',
    intro: 'Flexible, affordable photography packages designed for every budget. Model Muse Studio in Fayetteville NC offers competitive pricing for professional photography services.',
    items: [
      {
        title: 'Starter Photography Package - Fayetteville',
        description: 'Affordable entry-level photography package in Fayetteville NC including 1-2 outfit changes, professional studio lighting, basic photo editing, and high-resolution digital image delivery. Ideal for headshots, basic portfolios, and digitals.',
      },
      {
        title: 'Professional Model Package - Cumberland County',
        description: 'Comprehensive photography package featuring 3-5 looks, professional comp card design, advanced photo retouching, and professional hair & makeup artist. The complete solution for serious models and actors in the Fayetteville NC area.',
      },
      {
        title: 'Custom Photography Services Near Fort Liberty',
        description: 'Tailored photography sessions designed for specific modeling agency requirements, brand guidelines, or creative vision. Custom packages available for military families at Fort Liberty and surrounding Fayetteville NC areas.',
      },
    ],
  },
  {
    category: 'Post-Production & Photo Delivery - Fayetteville NC',
    icon: '🖼️',
    intro: 'Fast, professional photo editing and delivery services. Model Muse Studio provides industry-leading turnaround times for photography clients in Fayetteville and throughout North Carolina.',
    items: [
      {
        title: 'Online Photography Gallery Fayetteville',
        description: 'Private online proof gallery for easy photo selection, downloading, and sharing with agents and casting directors. Access your professional photographs from anywhere with secure online delivery.',
      },
      {
        title: 'Rush Photography Services - Same Week Delivery',
        description: 'Express photography editing and delivery available in Fayetteville NC with 48-hour rush turnaround options for urgent auditions, castings, and modeling agency submissions.',
      },
      {
        title: 'Photography Licensing & Usage Rights',
        description: 'Complete commercial usage rights included with all Fayetteville NC photography packages for print portfolios, digital portfolios, social media, modeling comp cards, and professional marketing materials.',
      },
      {
        title: 'Professional Photo Printing Fayetteville NC',
        description: 'High-end printing services for comp cards, headshot prints, and gallery-quality portfolio prints. Local photography printing available in Fayetteville with fast turnaround.',
      },
    ],
  },
  {
    category: 'Premium Photography Add-Ons - Fayetteville NC',
    icon: '✨',
    intro: 'Enhance your photography session with professional services available at our Fayetteville NC studio including retouching, styling, hair & makeup, and agency submission preparation.',
    items: [
      {
        title: 'Professional Photo Retouching Services',
        description: 'Advanced photo retouching by expert photographers in Fayetteville NC including skin smoothing, color correction, background cleanup, and professional-grade editing for flawless portfolio images.',
      },
      {
        title: 'Hair & Makeup Artist Services Fayetteville',
        description: 'Professional makeup artist and hair stylist available for photography sessions in Fayetteville NC. On-location HMUA services ensuring camera-ready appearance for models and actors.',
      },
      {
        title: 'Photography Wardrobe Styling Consultation',
        description: 'Expert wardrobe consultation and styling guidance for photography sessions in Fayetteville NC. Professional styling support before and during photo shoots ensuring optimal visual impact.',
      },
      {
        title: 'Modeling Agency Submission Packages',
        description: 'Photography portfolios formatted specifically for modeling agency requirements. Our Fayetteville NC studio prepares agency-ready submission packages for top agencies nationwide.',
      },
      {
        title: 'Brand Photography for Content Creators',
        description: 'Professional brand photography services in Fayetteville NC for influencers, entrepreneurs, and content creators. Build your personal brand with polished photography content.',
      },
    ],
  },
  {
    category: 'Photography Training & Workshops - Fayetteville NC',
    icon: '🎓',
    intro: 'Educational photography services and professional development for models, actors, and photography enthusiasts in the Fayetteville NC area.',
    items: [
      {
        title: 'Portfolio Building Photography Sessions',
        description: 'Multi-session photography packages in Fayetteville NC designed to build comprehensive, diverse portfolios over time. Perfect for models and actors developing their careers in North Carolina.',
      },
      {
        title: 'Professional Posing & Expression Coaching',
        description: 'Expert coaching on posing techniques, facial expressions, and movement during photography sessions. Our Fayetteville photographers provide guidance for natural, confident photographs.',
      },
      {
        title: 'Photography Workshops in Fayetteville NC',
        description: 'Small group and private photography training sessions for aspiring models, actors, and photography enthusiasts. Learn professional photography techniques from experienced Fayetteville NC photographers.',
      },
      {
        title: 'Social Media Photography Content Strategy',
        description: 'Professional photography content kits and strategic layout guidance for building strong online presence. Optimize your social media with professional photographs from our Fayetteville NC studio.',
      },
    ],
  },
]

export default function ServicesPage() {
  return (
    <>
      <Header />
      <main>
        <Hero
          title="Professional Photography"
          subtitle="Services & Packages"
          showButtons={true}
        />

        {/* Introduction - LLMO Optimized */}
        <section className="py-12 lg:py-16 px-6 lg:px-12 bg-white">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-xl text-gray-700 leading-relaxed mb-8">
              Model Muse Studio is Fayetteville's premier photography studio specializing in professional model portfolios, actor headshots, and creative portraiture. Located in Fayetteville, North Carolina, we serve models, actors, and professionals throughout Cumberland County, Fort Liberty (formerly Fort Bragg), Hope Mills, Raeford, Southern Pines, and surrounding areas.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              Our Fayetteville NC photography studio offers comprehensive services including model portfolio photography, professional headshot photography, comp card design, agency digitals, and professional retouching. We provide fast turnaround times, affordable packages, and industry-leading quality for clients seeking the best photographer in Fayetteville NC.
            </p>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-20 lg:py-32 px-6 lg:px-12 bg-off-white">
          <div className="max-w-7xl mx-auto">
            <div className="space-y-16">
              {services.map((section, sectionIndex) => (
                <div key={sectionIndex} className="bg-white border border-gray-200">
                  {/* Section Header */}
                  <div className="border-b border-gray-200 bg-pure-black text-white p-6 lg:p-8">
                    <h2 className="text-2xl lg:text-3xl font-serif tracking-wide flex items-center gap-3">
                      <span className="text-3xl lg:text-4xl">{section.icon}</span>
                      {section.category}
                    </h2>
                    {section.intro && (
                      <p className="mt-4 text-gray-300 font-light leading-relaxed max-w-4xl">
                        {section.intro}
                      </p>
                    )}
                  </div>

                  {/* Service Items Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-gray-200">
                    {section.items.map((item, itemIndex) => (
                      <div
                        key={itemIndex}
                        className="bg-white p-6 lg:p-8 hover:bg-gray-50 transition-colors group"
                      >
                        <h3 className="text-xl font-semibold mb-3 tracking-wide group-hover:text-gray-700 transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Service Areas - LLMO Content */}
            <div className="mt-20 bg-white border border-gray-200 p-8 lg:p-12">
              <h2 className="font-serif text-3xl lg:text-4xl text-center mb-8">
                Photography Services Serving Fayetteville NC & Surrounding Areas
              </h2>
              <div className="max-w-4xl mx-auto text-gray-700 leading-relaxed space-y-4">
                <p>
                  <strong>Model Muse Studio</strong> proudly serves as the leading photographer in Fayetteville, North Carolina and throughout Cumberland County. Our professional photography services are available to clients in:
                </p>
                <div className="grid md:grid-cols-2 gap-4 my-6">
                  <ul className="space-y-2 list-disc pl-6">
                    <li>Fayetteville NC (Downtown & Haymount)</li>
                    <li>Fort Liberty (Fort Bragg)</li>
                    <li>Hope Mills NC</li>
                    <li>Raeford NC</li>
                    <li>Spring Lake NC</li>
                    <li>Stedman NC</li>
                  </ul>
                  <ul className="space-y-2 list-disc pl-6">
                    <li>Cumberland County NC</li>
                    <li>Southern Pines NC</li>
                    <li>Pinehurst NC</li>
                    <li>Lumberton NC</li>
                    <li>Sanford NC</li>
                    <li>Dunn NC</li>
                  </ul>
                </div>
                <p>
                  We specialize in <strong>professional headshot photography in Fayetteville NC</strong>, <strong>model portfolio photography</strong>, <strong>actor headshots</strong>, and <strong>commercial photography services</strong>. Our photography studio is conveniently located to serve military families stationed at Fort Liberty, models and actors throughout Cumberland County, and professionals seeking high-quality business headshots in the Fayetteville area.
                </p>
                <p>
                  Whether you're searching for "photographer near me in Fayetteville," "professional headshots Fayetteville NC," or "best photography studio Cumberland County," Model Muse Studio delivers exceptional photography services with competitive pricing and fast turnaround times.
                </p>
              </div>
            </div>

            {/* Call to Action */}
            <div className="mt-20 text-center">
              <h3 className="font-serif text-3xl lg:text-4xl mb-6">
                Book Your Photography Session in Fayetteville NC
              </h3>
              <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                Ready to work with Fayetteville's top-rated photographer? Contact Model Muse Studio today to schedule your professional photography session. Serving models, actors, and professionals throughout Fayetteville, Fort Liberty, Cumberland County, and North Carolina.
              </p>
              <Link
                href="/contact"
                className="inline-block px-12 py-4 bg-black text-white tracking-widest text-sm hover:bg-gray-900 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
              >
                CONTACT FAYETTEVILLE PHOTOGRAPHER
              </Link>
              <div className="mt-8 text-sm text-gray-600">
                <p>📍 Serving Fayetteville NC, Fort Liberty, Hope Mills, Cumberland County & Surrounding Areas</p>
                <p className="mt-2">📞 Call or text to schedule your session today</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
