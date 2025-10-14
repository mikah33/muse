'use client'

import { useState } from 'react';

const faqs = [
  {
    question: 'How much do professional headshots cost in Fayetteville NC?',
    answer: 'Professional headshots in Fayetteville NC typically cost between $150-$500 depending on the package. At Model Muse Studio in Fayetteville, our starter headshot package includes 1-2 outfit changes, professional studio lighting, basic editing, and high-resolution digital files starting at an affordable rate. Our professional package with 3-5 looks, advanced retouching, and hair & makeup services provides comprehensive headshot photography for models, actors, and business professionals in Cumberland County. We offer competitive pricing for Fort Liberty military families and flexible payment options for photography clients throughout Fayetteville NC.',
  },
  {
    question: 'Where can I get professional headshots taken near Fort Liberty?',
    answer: 'Model Muse Studio is the premier photography studio near Fort Liberty (Fort Bragg) in Fayetteville, North Carolina offering professional headshots for military families, models, actors, and business professionals. Located conveniently in Fayetteville NC, we serve clients throughout Cumberland County including Hope Mills, Raeford, Spring Lake, and the Fort Liberty area. Our photography studio is just minutes from Fort Liberty and offers flexible scheduling including evenings and weekends to accommodate military schedules. Book your professional headshot session by contacting our Fayetteville NC photography studio directly.',
  },
  {
    question: 'What should I wear for professional headshots?',
    answer: 'For professional headshots, wear solid colors that complement your skin tone and avoid busy patterns or logos. Bring 2-3 outfit options including one formal business look (suit jacket or blazer), one business casual option, and one that reflects your industry or personality. For actor headshots in Fayetteville NC, choose clothing that represents the roles you\'re auditioning for. For business headshots, stick to professional attire in navy, black, gray, or white. Our Fayetteville photography studio provides detailed wardrobe consultation before your session to ensure you look your best in your professional headshots.',
  },
  {
    question: 'How long does a professional headshot session take?',
    answer: 'A professional headshot session in Fayetteville NC typically takes 30-60 minutes depending on the package. Our basic headshot sessions (1-2 looks) take approximately 30-45 minutes, while comprehensive sessions with multiple outfit changes, hair & makeup, and various backdrops take 60-90 minutes. At Model Muse Studio in Fayetteville, we allow enough time for outfit changes, lighting adjustments, and multiple poses to ensure we capture the perfect professional headshot. Team photography sessions for businesses in Cumberland County are scheduled based on group size with efficient workflows to minimize disruption.',
  },
  {
    question: 'How fast can I get my professional headshots back?',
    answer: 'Most clients receive their professional headshots within 5-7 business days after the photography session at our Fayetteville NC studio. For urgent needs like job interviews, auditions, or modeling agency submissions, we offer rush processing with 24-48 hour turnaround available for an additional fee. All clients receive access to a private online gallery where you can view, select, and download your professional headshots immediately after editing is complete. Model Muse Studio in Fayetteville provides some of the fastest turnaround times for professional photography in Cumberland County NC.',
  },
  {
    question: 'Do you offer model portfolio photography in Fayetteville NC?',
    answer: 'Yes! Model Muse Studio specializes in professional model portfolio photography in Fayetteville, North Carolina. Our model portfolio sessions include multiple outfit changes, diverse poses (full body, three-quarter, and close-up shots), various lighting styles, and both studio and outdoor locations throughout Cumberland County. We create modeling portfolios that meet agency standards for submissions to modeling agencies in New York, Los Angeles, Miami, Charlotte, Raleigh, and nationwide. Our Fayetteville NC photography studio understands what casting directors and modeling agencies look for, providing comprehensive portfolio development for aspiring and professional models throughout North Carolina.',
  },
  {
    question: 'What is the difference between headshots and portraits?',
    answer: 'Professional headshots are tightly cropped photographs focusing on your face and upper shoulders, typically used for business profiles, LinkedIn, acting submissions, and professional purposes. Headshots in Fayetteville NC are shot with neutral backgrounds and professional lighting to highlight facial features and expression. Portrait photography is broader, including more of the body and environment, often with creative backgrounds and poses. At Model Muse Studio in Fayetteville, we offer both professional headshot photography for business and acting purposes, as well as creative portrait photography for personal branding, modeling portfolios, and artistic expression throughout Cumberland County.',
  },
  {
    question: 'Can I get same-day headshots in Fayetteville NC?',
    answer: 'While we cannot guarantee same-day editing and delivery, Model Muse Studio in Fayetteville NC offers same-day photography sessions based on availability. If you need urgent professional headshots in Fayetteville, contact us directly and we\'ll do our best to accommodate rush bookings for Fort Liberty military families, job seekers, and actors with urgent auditions in Cumberland County. Our fastest turnaround option provides fully edited professional headshots within 24-48 hours after your session. For truly emergency headshot needs in Fayetteville NC, call our studio to discuss express service options.',
  },
  {
    question: 'Do you photograph actors and actresses in Fayetteville?',
    answer: 'Absolutely! Model Muse Studio is Fayetteville NC\'s premier photographer for actors and actresses seeking professional headshots and comp cards. Our actor headshot sessions create casting-ready photographs for theater, film, television, and commercial auditions throughout North Carolina and beyond. We understand industry-standard formatting for theatrical headshots versus commercial headshots, and provide guidance on expressions, angles, and styling for actors. Our Fayetteville photography studio has experience working with talent agencies and casting directors, creating professional actor headshots that help you book roles in the competitive entertainment industry.',
  },
  {
    question: 'What is a comp card and do I need one for modeling?',
    answer: 'A comp card (composite card or Z-card) is a professional marketing tool for models featuring 4-6 photographs showcasing different looks, poses, and expressions along with your measurements and contact information. Comp cards are essential for modeling agency submissions and in-person castings. At Model Muse Studio in Fayetteville NC, we create professionally designed comp cards that meet modeling industry standards. Our comprehensive model packages include photography session, professional editing, and custom comp card design optimized for modeling agencies throughout North Carolina and nationwide. If you\'re serious about modeling in Fayetteville, Cumberland County, or pursuing agencies in major markets, you need a professional comp card.',
  },
  {
    question: 'Do you offer business headshots for companies in Fayetteville NC?',
    answer: 'Yes! Model Muse Studio provides professional business headshots and corporate photography services for companies throughout Fayetteville, Cumberland County, and Fort Liberty areas. We offer on-site corporate headshot sessions at your Fayetteville NC office or in our professional photography studio. Our business photography packages include team headshots, executive portraits, LinkedIn profile photos, and company website photography with consistent styling across all employees. We work efficiently to photograph teams of any size (5-100+ employees) with minimal disruption to your business day. Many Fayetteville NC companies trust Model Muse Studio for professional, affordable corporate photography services.',
  },
  {
    question: 'What makes a good professional headshot?',
    answer: 'A good professional headshot has clean, professional lighting that flatters your face, a neutral or simple background that doesn\'t distract, sharp focus on your eyes, natural and confident expression, and appropriate framing (typically from mid-chest up). Professional headshots in Fayetteville NC should be high-resolution for both print and digital use, properly color-corrected, and authentically represent how you look in person. At Model Muse Studio in Fayetteville, we use professional camera equipment, studio lighting, and expert posing guidance to create headshots that convey approachability, confidence, and professionalism whether you\'re an actor, business professional, or model in Cumberland County NC.',
  },
  {
    question: 'How should I prepare for my headshot session in Fayetteville?',
    answer: 'To prepare for your professional headshot session at Model Muse Studio in Fayetteville NC: (1) Get plenty of sleep the night before to look refreshed, (2) Stay hydrated and avoid alcohol/salty foods that cause puffiness, (3) Choose 2-3 outfit options in solid colors without busy patterns, (4) For men, shave or groom facial hair the morning of, (5) For women, apply natural makeup or book our professional makeup artist, (6) Bring any props like glasses or accessories for variety, (7) Review example headshots to identify poses and expressions you like. Our Fayetteville photography studio provides detailed preparation guides when you book to ensure you get the best professional headshots in Cumberland County.',
  },
  {
    question: 'Can you do outdoor headshots in Fayetteville NC?',
    answer: 'Yes! Model Muse Studio offers both indoor studio headshots and outdoor photography sessions throughout Fayetteville, North Carolina. Outdoor headshots provide natural lighting and environmental backdrops that can create a more relaxed, approachable look perfect for creative professionals, actors, and models. We photograph outdoor sessions at beautiful locations throughout Cumberland County including downtown Fayetteville, parks, urban settings near Fort Liberty, and natural areas in Hope Mills and Raeford. Weather permitting, outdoor headshots in Fayetteville NC offer a fresh alternative to traditional studio photography while maintaining the professional quality required for business, acting, and modeling purposes.',
  },
  {
    question: 'Do I need professional hair and makeup for headshots?',
    answer: 'While not required, professional hair and makeup services significantly improve the quality of your headshots. Professional makeup for photography differs from everyday makeup - it photographs better under studio lighting and creates a polished, flawless look in your final images. At Model Muse Studio in Fayetteville NC, we offer professional hair and makeup artists (HMUA) as an add-on service for headshot sessions. Professional makeup is especially recommended for actors, models, business professionals, and anyone wanting the most polished professional headshots in Fayetteville. Our makeup artists specialize in camera-ready looks for photography sessions in Cumberland County and understand how to create natural yet refined appearances for professional headshots.',
  },
];

export default function FAQ() {
  const [modalOpen, setModalOpen] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <>
      <section className="py-20 lg:py-32 px-6 lg:px-12 bg-off-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-serif text-5xl lg:text-6xl mb-6">
            Get Your Questions
            <span className="block italic font-light mt-2">Answered</span>
          </h2>
          <div className="w-24 h-px bg-black mx-auto mb-8"></div>
          <p className="text-lg text-gray-600 font-light mb-12 max-w-2xl mx-auto">
            Everything you need to know about our professional photography services, packages, and booking process
          </p>
          <button
            onClick={() => setModalOpen(true)}
            className="inline-block px-12 py-4 bg-black text-white tracking-widest uppercase text-sm hover:bg-gray-900 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
          >
            View FAQs
          </button>
        </div>
      </section>

      {/* FAQ Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="relative bg-white w-full max-w-4xl max-h-[85vh] overflow-y-auto transform transition-all duration-300 scale-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setModalOpen(false)}
              className="sticky top-0 right-0 float-right m-6 w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition-colors bg-white z-10"
              aria-label="Close"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Content */}
            <div className="p-8 lg:p-12 pt-4">
              <div className="text-center mb-12">
                <h2 className="font-serif text-4xl lg:text-5xl mb-4">
                  Frequently Asked Questions
                </h2>
                <div className="w-24 h-px bg-black mx-auto"></div>
              </div>

              <div className="space-y-2">
                {faqs.map((faq, index) => (
                  <div
                    key={index}
                    className="border-b border-gray-200 last:border-b-0 group"
                  >
                    <button
                      onClick={() => setOpenIndex(openIndex === index ? null : index)}
                      className="w-full py-6 text-left flex items-center justify-between transition-all duration-300 hover:pl-2"
                    >
                      <span className="font-serif text-lg pr-8 transition-colors duration-300 group-hover:text-gray-600">
                        {faq.question}
                      </span>
                      <svg
                        className={`w-5 h-5 flex-shrink-0 transition-all duration-300 group-hover:scale-110 ${
                          openIndex === index ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>

                    <div
                      className={`overflow-hidden transition-all duration-300 ${
                        openIndex === index ? 'max-h-96 pb-6' : 'max-h-0'
                      }`}
                    >
                      <p className="text-gray-600 leading-relaxed font-light">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-12 pt-8 border-t border-gray-200 text-center">
                <p className="text-gray-600 mb-6 font-light">
                  Still have questions about our photography services?
                </p>
                <a
                  href="/contact"
                  className="inline-block px-12 py-4 bg-black text-white tracking-widest uppercase text-sm hover:bg-gray-900 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                >
                  Contact Us Today
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
