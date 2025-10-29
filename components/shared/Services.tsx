'use client'

import { useState, useEffect } from 'react'

interface ServiceCategory {
  id?: string
  section_number: string
  icon: string
  title: string
  description: string
  items: string[]
}

export default function Services() {
  const [serviceCategories, setServiceCategories] = useState<ServiceCategory[]>([])
  const [selectedService, setSelectedService] = useState<ServiceCategory | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/homepage')
      .then(res => res.json())
      .then(data => {
        if (data.sections && data.sections.length > 0) {
          setServiceCategories(data.sections)
        }
      })
      .catch(err => console.error('Failed to load homepage sections:', err))
      .finally(() => setLoading(false))
  }, [])

  const handleServiceClick = (service: ServiceCategory) => {
    setIsLoading(true)
    setTimeout(() => {
      setSelectedService(service)
      setIsLoading(false)
    }, 300)
  }

  if (loading) {
    return (
      <section className="py-12 md:py-20 lg:py-32 px-4 md:px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading services...</p>
        </div>
      </section>
    )
  }

  return (
    <>
      <section className="py-12 md:py-20 lg:py-32 px-4 md:px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="mb-12 md:mb-20 text-center">
          <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl mb-3 md:mb-4">
            Professional Photography Services
            <span className="block text-xl md:text-3xl lg:text-4xl italic font-light mt-2 md:mt-3 text-gray-700">Fayetteville, North Carolina</span>
          </h2>
          <p className="text-base md:text-lg text-gray-700 max-w-3xl mx-auto mt-4 md:mt-6 mb-3 md:mb-4 hidden md:block">
            Model Muse Studio is Fayetteville's premier photography studio specializing in professional model portfolios, actor headshots, business portraits, and creative photography serving Cumberland County and surrounding North Carolina areas.
          </p>
          <p className="text-sm md:text-base text-gray-600 max-w-3xl mx-auto mb-6 md:mb-8 hidden md:block">
            Comprehensive photography services for models, actors, and professionals including professional headshots, portfolio photography, comp card design, and creative portraits in Fayetteville NC.
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
                  {category.section_number}
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
