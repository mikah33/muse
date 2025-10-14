const services = [
  {
    number: '01',
    title: 'Professional Headshots',
    description: 'Elevate your professional presence with photographer professional headshots that command attention. Our professional headshots photography captures confidence and approachability, perfect for LinkedIn profiles, corporate websites, and business cards.',
  },
  {
    number: '02',
    title: 'Team & Corporate Photography',
    description: 'Unite your team visually with cohesive staff headshots and dynamic team photography. Our team creative photography sessions capture your company culture while maintaining professional consistency.',
  },
  {
    number: '03',
    title: 'Real Estate Photography',
    description: 'Sell properties faster with stunning photography real estate that highlights every detail. As a professional photographer for real estate, we understand how to make spaces shine.',
  },
  {
    number: '04',
    title: 'Family & Pet Photography',
    description: 'Preserve precious moments with warm, authentic family photography that captures genuine connections. Our pet photography sessions celebrate your furry family members with the same care and artistry.',
  },
  {
    number: '05',
    title: 'Portfolio Development',
    description: 'Launch your creative career with a compelling photography portfolio that showcases your versatility. Perfect for actors, models, and artists, our modeling portfolio sessions combine commercial appeal with unique photography.',
  },
  {
    number: '06',
    title: 'Art & Editorial Photography',
    description: 'Push creative boundaries with artistic photography that transcends the ordinary. Our creative headshots blend commercial polish with editorial edge, perfect for musicians, performers, and creative professionals.',
  },
];

export default function ServicesExpanded() {
  return (
    <section className="py-20 lg:py-32 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl lg:text-5xl mb-6">
            Specialized
            <span className="block italic font-light mt-2">Photography Services</span>
          </h2>
          <div className="w-24 h-px bg-black mx-auto"></div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-300">
          {services.map((service) => (
            <div
              key={service.number}
              className="bg-white p-10 group cursor-pointer transition-all duration-500 hover:bg-black hover:text-white relative overflow-hidden"
            >
              {/* Elegant slide-in effect */}
              <div className="absolute inset-0 bg-black transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left -z-10"></div>

              <div className="mb-6 relative">
                <span className="text-5xl font-serif opacity-10 group-hover:opacity-20 transition-all duration-500">
                  {service.number}
                </span>
              </div>

              <h3 className="font-serif text-2xl mb-4 tracking-wide relative transform group-hover:translate-x-1 transition-transform duration-300">
                {service.title}
              </h3>

              <p className="text-sm leading-relaxed text-gray-600 group-hover:text-gray-300 font-light relative transition-colors duration-300">
                {service.description}
              </p>

              <div className="flex items-center text-xs tracking-widest uppercase mt-8 relative">
                <span className="transform group-hover:translate-x-1 transition-transform duration-300">Learn More</span>
                <svg
                  className="w-4 h-4 ml-2 transform group-hover:translate-x-3 transition-all duration-300"
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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
