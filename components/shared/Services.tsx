'use client'

import { useState, useEffect } from 'react'

const serviceCategories = [
  {
    number: '01',
    icon: '📸',
    title: 'Professional Photography Services - Fayetteville NC',
    description: 'Model Muse Studio offers expert photography services in Fayetteville, North Carolina for models, actors, and professionals seeking high-quality portfolio images. Our Fayetteville photography studio specializes in model portfolios, professional headshots, and creative portraiture serving Cumberland County, Fort Liberty, and surrounding NC areas.',
    items: [
      'Model Portfolio Photography Fayetteville NC: Professional model portfolio sessions in our Fayetteville studio featuring multiple outfit changes, studio and outdoor photography locations throughout Cumberland County, full body shots, and detailed close-ups. Perfect for aspiring and professional models in Fayetteville seeking agency-quality portfolio photography for submissions to modeling agencies.',
      'Professional Actor Headshots Fayetteville NC: Casting-ready headshot photography for theater, film, television, and commercial auditions. Our Fayetteville NC photography studio creates industry-standard actor headshots used by talent agencies and casting directors throughout North Carolina and the Southeast region.',
      'Business Headshot Photography Fayetteville: Professional corporate headshots and business portraits in Fayetteville NC for professionals, executives, and entrepreneurs. Our photography studio provides LinkedIn headshots, company headshots, and professional portraits for individuals and businesses in Cumberland County.',
      'Comp Card Design Services Fayetteville: Expert comp card and Z-card design for modeling agencies. Our Fayetteville photography studio creates professionally formatted comp cards with optimized image layouts meeting top modeling agency requirements across North Carolina and nationwide.',
    ],
  },
  {
    number: '02',
    icon: '💼',
    title: 'Affordable Photography Packages - Fayetteville NC',
    description: 'Flexible photography packages designed for every budget in Fayetteville, North Carolina. Model Muse Studio offers competitive pricing for professional photography services serving Fort Liberty military families, models, actors, and professionals throughout Cumberland County.',
    items: [
      'Starter Photography Package Fayetteville NC: Affordable entry-level photography package including 1-2 outfit changes, professional studio lighting in our Fayetteville location, basic photo editing, and high-resolution digital image delivery. Perfect for headshots, basic portfolios, digitals, and first-time photography clients in the Fayetteville area.',
      'Professional Model Package Cumberland County: Comprehensive photography package featuring 3-5 looks, professional comp card design, advanced photo retouching, and professional hair & makeup artist services. The complete photography solution for serious models and actors in Fayetteville NC, Fort Liberty, Hope Mills, and throughout Cumberland County.',
      'Custom Photography Services Fort Liberty: Tailored photography sessions designed for specific modeling agency requirements, military family portraits, brand guidelines, or creative vision. Custom packages available for Fort Liberty military families and photography clients throughout Fayetteville NC with flexible scheduling and military-friendly pricing.',
    ],
  },
  {
    number: '03',
    icon: '🖼️',
    title: 'Fast Photo Editing & Delivery - Fayetteville NC',
    description: 'Professional post-production photography services with industry-leading turnaround times. Model Muse Studio in Fayetteville NC provides fast photo editing, online galleries, and professional printing for photography clients throughout Cumberland County and North Carolina.',
    items: [
      'Online Photography Gallery Fayetteville: Secure private online proof gallery for easy photo selection, downloading, and sharing with modeling agents and casting directors. Access your professional photographs from anywhere with our convenient online delivery system - perfect for Fayetteville NC clients and those in surrounding areas.',
      'Rush Photography Services Fayetteville NC: Express photography editing and delivery available with 48-hour turnaround options for urgent auditions, castings, and modeling agency submissions. Our Fayetteville photography studio offers same-week delivery for time-sensitive photography needs throughout Cumberland County.',
      'Photography Usage Rights & Licensing: Complete commercial usage rights included with all Fayetteville NC photography packages for print portfolios, digital portfolios, social media, modeling comp cards, and professional marketing materials. No hidden fees - you own your images.',
      'Professional Photo Printing Fayetteville NC: High-end printing services for comp cards, headshot prints, and gallery-quality portfolio prints. Local photography printing available in Fayetteville with fast turnaround and professional quality.',
    ],
  },
  {
    number: '04',
    icon: '✨',
    title: 'Premium Add-On Services - Fayetteville Photography Studio',
    description: 'Enhance your photography session with professional services available at our Fayetteville NC studio including expert retouching, professional styling, hair & makeup artists, and modeling agency submission preparation for Cumberland County clients.',
    items: [
      'Professional Photo Retouching Fayetteville: Advanced photo retouching by expert photographers in Fayetteville NC including skin smoothing, color correction, blemish removal, background cleanup, and professional-grade editing for flawless portfolio images. Industry-standard retouching for models, actors, and professionals.',
      'Hair & Makeup Artist Services Fayetteville NC: Professional makeup artist (MUA) and hair stylist available for photography sessions in Fayetteville. On-location HMUA services ensuring camera-ready appearance for models, actors, and headshot clients throughout Cumberland County and Fort Liberty areas.',
      'Photography Wardrobe Styling Consultation: Expert wardrobe consultation and styling guidance for photography sessions in Fayetteville NC. Professional styling support before and during photo shoots ensuring optimal visual impact for model portfolios, headshots, and creative portraits.',
      'Modeling Agency Submission Packages Fayetteville: Photography portfolios formatted and optimized specifically for modeling agency requirements. Our Fayetteville NC studio prepares agency-ready submission packages for top modeling agencies in New York, Los Angeles, Miami, Atlanta, and nationwide.',
      'Brand Photography Content Creation Fayetteville NC: Professional brand photography services for influencers, entrepreneurs, small businesses, and content creators in Fayetteville and Cumberland County. Build your personal or business brand with polished photography content for social media, websites, and marketing.',
    ],
  },
  {
    number: '05',
    icon: '🎓',
    title: 'Photography Workshops & Training - Fayetteville NC',
    description: 'Educational photography services and professional development for models, actors, and photography enthusiasts in Fayetteville, North Carolina. Model Muse Studio offers coaching, workshops, and portfolio building services throughout Cumberland County.',
    items: [
      'Portfolio Building Photography Sessions Fayetteville: Multi-session photography packages designed to build comprehensive, diverse portfolios over time. Perfect for models and actors in Fayetteville NC developing their careers with professional photography guidance throughout the portfolio building process.',
      'Professional Posing & Expression Coaching Cumberland County: Expert coaching on posing techniques, facial expressions, body angles, and movement during photography sessions. Our Fayetteville photographers provide personalized guidance for natural, confident photographs that showcase your best angles and expressions.',
      'Photography Workshops in Fayetteville NC: Small group and private photography training sessions for aspiring models, actors, content creators, and photography enthusiasts. Learn professional photography techniques, posing, lighting, and industry standards from experienced Fayetteville NC photographers.',
      'Social Media Photography Strategy Fayetteville: Professional photography content kits and strategic layout guidance for building strong online presence. Optimize your Instagram, TikTok, Facebook, and professional profiles with high-quality photographs from our Fayetteville NC photography studio.',
    ],
  },
]

export default function Services() {
  const [selectedService, setSelectedService] = useState<typeof serviceCategories[0] | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [headerContent, setHeaderContent] = useState({
    title: "Professional Photography Services",
    subtitle: "Fayetteville, North Carolina",
    description: "Model Muse Studio is Fayetteville's premier photography studio specializing in professional model portfolios, actor headshots, business portraits, and creative photography serving Cumberland County, Fort Liberty, Hope Mills, Raeford, and surrounding North Carolina areas.",
    subdescription: "Comprehensive photography services for models, actors, military families, and professionals including professional headshots, portfolio photography, comp card design, and creative portraits in Fayetteville NC."
  })

  useEffect(() => {
    fetch('/api/admin/homepage')
      .then(res => res.json())
      .then(data => {
        if (data.services_header) {
          setHeaderContent(data.services_header)
        }
      })
      .catch(err => console.error('Failed to load services header:', err))
  }, [])

  const handleServiceClick = (service: typeof serviceCategories[0]) => {
    setIsLoading(true)
    setTimeout(() => {
      setSelectedService(service)
      setIsLoading(false)
    }, 300)
  }

  return (
    <>
      <section className="py-12 md:py-20 lg:py-32 px-4 md:px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="mb-12 md:mb-20 text-center">
          <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl mb-3 md:mb-4">
            {headerContent.title}
            <span className="block text-xl md:text-3xl lg:text-4xl italic font-light mt-2 md:mt-3 text-gray-700">{headerContent.subtitle}</span>
          </h2>
          <p className="text-base md:text-lg text-gray-700 max-w-3xl mx-auto mt-4 md:mt-6 mb-3 md:mb-4 hidden md:block">
            {headerContent.description}
          </p>
          <p className="text-sm md:text-base text-gray-600 max-w-3xl mx-auto mb-6 md:mb-8 hidden md:block">
            {headerContent.subdescription}
          </p>
          <div className="w-16 md:w-24 h-px bg-black mx-auto"></div>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-200">
          {serviceCategories.slice(0, 5).map((category, index) => (
            <button
              key={category.title}
              onClick={() => handleServiceClick(category)}
              className={`bg-white p-4 md:p-8 lg:p-12 group cursor-pointer transition-all duration-500 hover:bg-black hover:text-white text-left relative overflow-hidden ${
                index === 0 ? 'lg:col-span-2' : ''
              } ${index === 3 ? 'lg:col-span-2' : ''}`}
            >
              {/* Hover overlay effect */}
              <div className="absolute inset-0 bg-black transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left -z-10"></div>

              <div className="mb-2 md:mb-6 relative">
                <span className="text-3xl md:text-6xl font-serif opacity-10 group-hover:opacity-20 transition-all duration-500">
                  {category.number}
                </span>
              </div>
              <div className="mb-2 md:mb-6 relative">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-1 md:gap-2 mb-2 md:mb-3">
                  <span className="text-xl md:text-2xl transform group-hover:scale-110 transition-transform duration-300">
                    {category.icon}
                  </span>
                  <h3 className="text-xs md:text-2xl font-serif tracking-wide transform group-hover:translate-x-1 transition-transform duration-300 leading-tight">
                    {category.title}
                  </h3>
                </div>
              </div>
              <div className="flex items-center text-xs md:text-sm tracking-widest uppercase mt-2 md:mt-6 relative">
                <span className="transform group-hover:translate-x-1 transition-transform duration-300">Learn More</span>
                <svg
                  className="w-3 h-3 md:w-4 md:h-4 ml-1 md:ml-2 transform group-hover:translate-x-3 transition-all duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </button>
          ))}

          {/* 6th cell - Mobile location label / Desktop hidden */}
          <div className="bg-white p-4 md:hidden flex items-center justify-center">
            <div className="text-center">
              <p className="text-2xl mb-2">📍</p>
              <p className="text-xs font-serif tracking-wide">
                Based out of Fayetteville
              </p>
              <p className="text-xs text-gray-500 mt-1">North Carolina</p>
            </div>
          </div>

          {/* Desktop map card - replaces 6th cell on desktop */}
          <div className="hidden md:block bg-white p-0 overflow-hidden relative group md:col-span-2 lg:col-span-2 min-h-[300px]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d207636.2726451!2d-78.96!3d35.05!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89ab118fc380c1b7%3A0xb5f12fb1cb30e394!2sFayetteville%2C%20NC!5e0!3m2!1sen!2sus!4v1234567890"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Model Muse Studio Photography - Fayetteville North Carolina - Professional Photographer near Fort Liberty Cumberland County"
              className="absolute inset-0 w-full h-full"
            />

            <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm p-3 md:p-6 transition-transform duration-300 group-hover:translate-y-0 translate-y-full">
              <h3 className="font-serif text-base md:text-xl mb-1 md:mb-2">Model Muse Studio - Fayetteville NC</h3>
              <p className="text-xs md:text-sm text-gray-600 font-light">
                Professional Photography Studio serving Fayetteville, Fort Liberty, Cumberland County & NC
              </p>
              <p className="text-xs text-gray-500 mt-1 md:mt-2">
                📍 Serving: Fayetteville • Fort Liberty • Hope Mills • Raeford • Cumberland County
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Loading Screen */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white font-serif text-lg tracking-wider">Loading...</p>
          </div>
        </div>
      )}

      {/* Modal */}
      {selectedService && !isLoading && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
          onClick={() => setSelectedService(null)}
        >
          <div
            className="relative bg-white w-full max-w-3xl max-h-[80vh] overflow-y-auto transform transition-all duration-300 scale-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedService(null)}
              className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition-colors"
              aria-label="Close"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Content */}
            <div className="p-8 lg:p-12">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">{selectedService.icon}</span>
                <h2 className="font-serif text-3xl lg:text-4xl">{selectedService.title}</h2>
              </div>

              <p className="text-gray-600 mb-8 font-light leading-relaxed">
                {selectedService.description}
              </p>

              <div className="space-y-6">
                {selectedService.items.map((item, index) => (
                  <div key={index} className="border-l-2 border-gray-200 pl-6">
                    <p className="text-gray-700 leading-relaxed font-light">
                      {item}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-10 pt-8 border-t border-gray-200">
                <button
                  onClick={() => setSelectedService(null)}
                  className="w-full px-12 py-4 bg-black text-white tracking-widest uppercase text-sm hover:bg-gray-900 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
