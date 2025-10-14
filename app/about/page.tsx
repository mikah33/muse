import Header from '@/components/shared/Header'
import Footer from '@/components/shared/Footer'
import Hero from '@/components/shared/Hero'
import Link from 'next/link'

export default function AboutPage() {
  return (
    <>
      <Header />
      <main>
        <Hero
          title="More Than Just"
          subtitle="Photos"
          showButtons={true}
        />

        {/* Introduction */}
        <section className="py-20 lg:py-32 px-6 lg:px-12 bg-white">
          <div className="max-w-4xl mx-auto">
            <p className="text-2xl lg:text-3xl text-gray-800 leading-relaxed mb-12 font-light first-letter-drop">
              In today's visual-first world, your photos are your voice—and your first impression. That's why every session at Model Muse Studio is more than a photoshoot: it's an intentional, creative collaboration designed to showcase your personality, style, and potential.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <p className="text-lg text-gray-600 leading-relaxed">
                With expert direction, dynamic lighting, and an editorial eye, we create headshots, portraits, and creative looks that capture attention and open doors.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Our mission is simple: to help you frame your confidence through powerful, high-quality imagery that tells your unique story.
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
                Why Choose Model Muse Studio?
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
                <h3 className="font-serif text-2xl mb-4">Tailored to You</h3>
                <p className="text-gray-600 leading-relaxed">
                  Every session is crafted around your goals—whether you're an aspiring talent or a seasoned pro.
                </p>
              </div>

              <div className="text-center">
                <div className="mb-6">
                  <div className="w-20 h-20 mx-auto bg-black text-white rounded-full flex items-center justify-center text-3xl font-serif">
                    2
                  </div>
                </div>
                <h3 className="font-serif text-2xl mb-4">Industry Insight</h3>
                <p className="text-gray-600 leading-relaxed">
                  We understand what agencies, casting directors, and brands want to see. Your images won't just look good—they'll work hard for your career.
                </p>
              </div>

              <div className="text-center">
                <div className="mb-6">
                  <div className="w-20 h-20 mx-auto bg-black text-white rounded-full flex items-center justify-center text-3xl font-serif">
                    3
                  </div>
                </div>
                <h3 className="font-serif text-2xl mb-4">Confidence Through Imagery</h3>
                <p className="text-gray-600 leading-relaxed">
                  Our studio is a safe, supportive space where you're empowered to express your authentic self—boldly and unapologetically.
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
                What Sets Us Apart?
              </h2>
              <div className="w-24 h-px bg-black mx-auto"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-gray-200">
              <div className="bg-white p-10 hover:bg-gray-50 transition-colors">
                <div className="text-4xl mb-4">📸</div>
                <h3 className="font-serif text-2xl mb-4">Personalized Sessions</h3>
                <p className="text-gray-600 leading-relaxed">
                  From clean headshots to full-body fashion editorials, every session is built around your aesthetic and career goals.
                </p>
              </div>

              <div className="bg-white p-10 hover:bg-gray-50 transition-colors">
                <div className="text-4xl mb-4">✨</div>
                <h3 className="font-serif text-2xl mb-4">Comfortable Studio Experience</h3>
                <p className="text-gray-600 leading-relaxed">
                  Our Fayetteville studio is designed to feel relaxed and welcoming—so you can focus on expressing yourself.
                </p>
              </div>

              <div className="bg-white p-10 hover:bg-gray-50 transition-colors">
                <div className="text-4xl mb-4">⚡</div>
                <h3 className="font-serif text-2xl mb-4">Fast Turnaround</h3>
                <p className="text-gray-600 leading-relaxed">
                  Fully edited photos delivered in as little as 48 hours—ready for agencies, castings, and social media.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Services Overview - Contact Only */}
        <section className="py-20 lg:py-32 px-6 lg:px-12 bg-pure-black text-white text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-serif text-5xl lg:text-6xl mb-8">
              Ready to Work Together?
            </h2>
            <div className="w-24 h-px bg-white mx-auto mb-8"></div>
            <p className="text-xl text-gray-300 mb-12 leading-relaxed">
              Let's discuss your photography needs and create something amazing
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
              Let's Create Something
              <span className="block italic font-light mt-3">Amazing</span>
            </h2>
            <div className="w-24 h-px bg-black mx-auto mb-10"></div>
            <p className="text-xl text-gray-700 mb-16 leading-relaxed max-w-3xl mx-auto">
              It's time to be seen the way you deserve. Whether you're updating your portfolio or trying something new, Model Muse Studio is here to help you show up, stand out, and move forward.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 max-w-2xl mx-auto text-left">
              <div className="bg-white p-8 border border-gray-200">
                <p className="text-sm tracking-widest uppercase text-gray-500 mb-3">Phone</p>
                <a href="tel:9107037477" className="text-2xl font-serif hover:opacity-70 transition-opacity">
                  910-703-7477
                </a>
              </div>
              <div className="bg-white p-8 border border-gray-200">
                <p className="text-sm tracking-widest uppercase text-gray-500 mb-3">Email</p>
                <a href="mailto:contact@modelmusestudio.com" className="text-2xl font-serif hover:opacity-70 transition-opacity break-all">
                  contact@modelmusestudio.com
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
              Proudly Serving Talent Across North Carolina
            </h2>
            <div className="w-24 h-px bg-black mx-auto mb-10"></div>
            <p className="text-lg text-gray-600 leading-relaxed max-w-4xl mx-auto">
              We work with models and actors across <span className="font-semibold text-gray-800">Fayetteville</span>, Fort Liberty, Hope Mills, Dunn, Southern Pines, Lumberton, Sanford, Pinehurst, Fuquay-Varina, Laurinburg, Holly Springs, Smithfield, Raeford, Apex, Clayton, Garner, <span className="font-semibold text-gray-800">Wilmington</span>, Rockingham, <span className="font-semibold text-gray-800">Raleigh</span>, <span className="font-semibold text-gray-800">Durham</span>, and Cary, NC.
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
