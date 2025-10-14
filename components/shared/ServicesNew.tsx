const services = [
  {
    category: 'Core Photography Services',
    icon: '📸',
    items: [
      {
        title: 'Model Portfolio Sessions',
        description: 'Multiple outfits, studio + outdoor, full body + detail shots.',
      },
      {
        title: 'Actor & Actress Headshots',
        description: 'Clean, casting-ready shots for stage, screen, or agency use.',
      },
      {
        title: 'Comp Card Design',
        description: 'Fully designed comp/z-cards with image layout and personal info.',
      },
      {
        title: 'Digitals / Polaroids',
        description: 'Fresh-faced, no-makeup digitals for agency submission standards.',
      },
    ],
  },
  {
    category: 'Packages',
    icon: '💼',
    items: [
      {
        title: 'Starter Package',
        description: '1–2 looks, light editing, basic digitals.',
      },
      {
        title: 'Pro Package',
        description: '3–5 looks, comp card, retouching, HMUA included.',
      },
      {
        title: 'Custom Package',
        description: 'Designed specifically for your agency or personal brand goals.',
      },
    ],
  },
  {
    category: 'Post-Production',
    icon: '🖼️',
    items: [
      {
        title: 'Online Proof Gallery',
        description: 'Choose your final edits easily from a private link.',
      },
      {
        title: 'Fast Turnaround',
        description: '48-hour rush options available.',
      },
      {
        title: 'Photo Licensing',
        description: 'Usage rights for print, portfolio, and social media included.',
      },
      {
        title: 'Prints & Cards',
        description: 'We offer optional high-end printing for comp cards or gallery prints.',
      },
    ],
  },
  {
    category: 'Add-On Services',
    icon: '✨',
    items: [
      {
        title: 'Professional Retouching',
        description: 'Skin smoothing, color balance, background cleanup, and more.',
      },
      {
        title: 'Hair & Makeup',
        description: 'On-site HMUA available per session or full-day shoot.',
      },
      {
        title: 'Wardrobe Consultation',
        description: 'Style support before and during your shoot for model-perfect looks.',
      },
      {
        title: 'Agency Submission Kits',
        description: 'Portfolio images cropped and sized for top modeling agencies.',
      },
      {
        title: 'Branding Shoots',
        description: 'For influencers, content creators, and personal brands needing polished content.',
      },
    ],
  },
  {
    category: 'Education & Support',
    icon: '🎓',
    items: [
      {
        title: 'Model Portfolio Packages',
        description: 'Shoot over time to build a dynamic and versatile book.',
      },
      {
        title: 'Expression Coaching',
        description: 'Guided posing, movement, and face control tips during your shoot.',
      },
      {
        title: 'Workshops',
        description: 'Small group or 1-on-1 photography/modeling training sessions.',
      },
      {
        title: 'Social Media Kits',
        description: 'Curated content & layout guidance for online presence.',
      },
    ],
  },
]

export default function ServicesNew() {
  return (
    <section className="py-20 lg:py-32 px-6 lg:px-12 bg-off-white">
      <div className="max-w-7xl mx-auto">
        <div className="mb-20 text-center">
          <h2 className="font-serif text-5xl lg:text-6xl mb-4">Our Services</h2>
          <div className="w-24 h-px bg-black mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Professional photography services designed to elevate your modeling and acting career
          </p>
        </div>

        <div className="space-y-16">
          {services.map((section, sectionIndex) => (
            <div key={sectionIndex} className="bg-white border border-gray-200">
              {/* Section Header */}
              <div className="border-b border-gray-200 bg-pure-black text-white p-6 lg:p-8">
                <h3 className="text-2xl font-serif tracking-wide flex items-center gap-3">
                  <span className="text-3xl">{section.icon}</span>
                  {section.category}
                </h3>
              </div>

              {/* Service Items Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-gray-200">
                {section.items.map((item, itemIndex) => (
                  <div
                    key={itemIndex}
                    className="bg-white p-6 lg:p-8 hover:bg-gray-50 transition-colors"
                  >
                    <h4 className="text-xl font-semibold mb-3 tracking-wide">
                      {item.title}
                    </h4>
                    <p className="text-gray-600 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-20 text-center">
          <a
            href="/contact"
            className="inline-block px-12 py-4 bg-black text-white tracking-widest text-sm hover:bg-gray-900 transition-colors"
          >
            BOOK YOUR SESSION
          </a>
        </div>
      </div>
    </section>
  )
}
