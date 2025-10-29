import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const defaultContent: Record<string, any> = {
  about: {
    hero: { title: "More Than Just", subtitle: "Photos" },
    introduction: {
      paragraph1: "In today's visual-first world, your photos are your voice—and your first impression. That's why every session at Model Muse Studio is more than a photoshoot: it's an intentional, creative collaboration designed to showcase your personality, style, and potential.",
      paragraph2: "With expert direction, dynamic lighting, and an editorial eye, we create headshots, portraits, and creative looks that capture attention and open doors.",
      paragraph3: "Our mission is simple: to help you frame your confidence through powerful, high-quality imagery that tells your unique story."
    },
    whyChoose: {
      title: "Why Choose Model Muse Studio?",
      reason1: { title: "Tailored to You", description: "Every session is crafted around your goals—whether you're an aspiring talent or a seasoned pro." },
      reason2: { title: "Industry Insight", description: "We understand what agencies, casting directors, and brands want to see. Your images won't just look good—they'll work hard for your career." },
      reason3: { title: "Confidence Through Imagery", description: "Our studio is a safe, supportive space where you're empowered to express your authentic self—boldly and unapologetically." }
    },
    whatSetsApart: {
      title: "What Sets Us Apart?",
      feature1: { icon: "📸", title: "Personalized Sessions", description: "From clean headshots to full-body fashion editorials, every session is built around your aesthetic and career goals." },
      feature2: { icon: "✨", title: "Comfortable Studio Experience", description: "Our Fayetteville studio is designed to feel relaxed and welcoming—so you can focus on expressing yourself." },
      feature3: { icon: "⚡", title: "Fast Turnaround", description: "Fully edited photos delivered in as little as 48 hours—ready for agencies, castings, and social media." }
    },
    readySection: {
      title: "Ready to Work Together?",
      description: "Let's discuss your photography needs and create something amazing"
    },
    ctaSection: {
      title: "Let's Create Something",
      titleItalic: "Amazing",
      description: "It's time to be seen the way you deserve. Whether you're updating your portfolio or trying something new, Model Muse Studio is here to help you show up, stand out, and move forward.",
      phone: "910-703-7477",
      email: "contact@modelmusestudio.com"
    },
    serviceAreas: {
      title: "Proudly Serving Talent Across North Carolina",
      description: "We work with models and actors across Fayetteville, Fort Liberty, Hope Mills, Dunn, Southern Pines, Lumberton, Sanford, Pinehurst, Fuquay-Varina, Laurinburg, Holly Springs, Smithfield, Raeford, Apex, Clayton, Garner, Wilmington, Rockingham, Raleigh, Durham, and Cary, NC."
    }
  },
  contact: {
    hero: { title: "Get in Touch", subtitle: "Ready to elevate your portfolio?" },
    contactInfo: {
      email: "contact@modelmusestudio.com",
      phone: "910-703-7477",
      hours: { weekday: "Monday - Friday: 9:00 AM - 6:00 PM", saturday: "Saturday: 10:00 AM - 4:00 PM", sunday: "Sunday: By Appointment Only" }
    }
  },
  services: {
    hero: { title: "Professional Photography", subtitle: "Services & Packages" },
    introduction: {
      paragraph1: "Model Muse Studio is Fayetteville's premier photography studio.",
      paragraph2: "We offer comprehensive services with fast turnaround times."
    }
  },
  portfolio: {
    hero: { title: "Portfolio", subtitle: "A curated collection of our finest work" }
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ page: string }> }
) {
  try {
    const supabase = await createClient()
    const { page } = await params

    const { data, error } = await supabase
      .from('page_content')
      .select('content')
      .eq('page_name', page)
      .single()

    if (error || !data) {
      // Return default content if not found
      const content = defaultContent[page] || {}

      // Try to insert it
      await supabase
        .from('page_content')
        .insert({ page_name: page, content })
        .select()
        .single()

      return NextResponse.json(content)
    }

    return NextResponse.json(data.content)
  } catch (error) {
    console.error('Error fetching page content:', error)
    return NextResponse.json({}, { status: 500 })
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ page: string }> }
) {
  try {
    const supabase = await createClient()
    const { page } = await params
    const content = await request.json()

    const { error } = await supabase
      .from('page_content')
      .upsert({
        page_name: page,
        content,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'page_name'
      })

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error saving page content:', error)
    return NextResponse.json({ error: 'Failed to save content' }, { status: 500 })
  }
}
