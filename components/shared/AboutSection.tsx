'use client'

import { useState, useEffect } from 'react'

export default function AboutSection() {
  const [content, setContent] = useState({
    heading: "Capturing Your Story",
    subheading: "Through the Lens",
    paragraph1: "Every face tells a story, and every moment deserves to be remembered beautifully. Our studio photography approach combines technical excellence with artistic vision, creating images that don't just document—they inspire. Whether you're seeking professional headshots that command attention or creative photography that captures your unique essence, we bring decades of experience to every session.",
    paragraph2: "We believe professional photography is more than just clicking a shutter. It's about understanding light, reading emotions, and creating an environment where authenticity shines through. From corporate executives needing commanding team photography to families wanting to preserve precious memories, our photography services are tailored to reveal the best version of you.",
    paragraph3: "What sets our artistic photography apart is our commitment to your vision. We don't believe in cookie-cutter approaches. Each digital photography session begins with understanding your goals—whether that's elevating your personal brand with professional headshots, showcasing your team's dynamic energy, or creating portfolio pieces that open doors. We've helped countless clients transform how they present themselves to the world, and we're ready to do the same for you."
  })

  useEffect(() => {
    fetch('/api/admin/homepage')
      .then(res => res.json())
      .then(data => {
        if (data.about) {
          setContent(data.about)
        }
      })
      .catch(err => console.error('Failed to load about content:', err))
  }, [])

  return (
    <section className="py-20 lg:py-32 px-6 lg:px-12 max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="font-serif text-4xl lg:text-5xl mb-6">
          {content.heading}
          <span className="block italic font-light mt-2">{content.subheading}</span>
        </h2>
        <div className="w-24 h-px bg-black mx-auto"></div>
      </div>

      <div className="space-y-8 text-gray-700 leading-relaxed">
        <p className="text-lg lg:text-xl font-light">
          {content.paragraph1}
        </p>

        <p className="text-base lg:text-lg font-light">
          {content.paragraph2}
        </p>

        <p className="text-base lg:text-lg font-light">
          {content.paragraph3}
        </p>
      </div>
    </section>
  );
}
