import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        db: { schema: 'public' },
        auth: { persistSession: false }
      }
    )

    // Insert default content - this will auto-create the table if using proper migrations
    const defaultContent = [
      {
        section: 'hero',
        content: {
          title: "Professional Photography",
          subtitle: "Headshots & Portfolios",
          tagline: "EXPERT MODELING PORTFOLIOS, ACTOR HEADSHOTS & CREATIVE PORTRAITS",
          description: "Premium studio photography services for models, actors, and professionals seeking exceptional headshots and portfolio imagery",
          primaryButton: "Book Photography Session",
          secondaryButton: "View Professional Portfolio"
        }
      },
      {
        section: 'about',
        content: {
          heading: "Capturing Your Story",
          subheading: "Through the Lens",
          paragraph1: "Every face tells a story, and every moment deserves to be remembered beautifully. Our studio photography approach combines technical excellence with artistic vision, creating images that don't just document—they inspire. Whether you're seeking professional headshots that command attention or creative photography that captures your unique essence, we bring decades of experience to every session.",
          paragraph2: "We believe professional photography is more than just clicking a shutter. It's about understanding light, reading emotions, and creating an environment where authenticity shines through. From corporate executives needing commanding team photography to families wanting to preserve precious memories, our photography services are tailored to reveal the best version of you.",
          paragraph3: "What sets our artistic photography apart is our commitment to your vision. We don't believe in cookie-cutter approaches. Each digital photography session begins with understanding your goals—whether that's elevating your personal brand with professional headshots, showcasing your team's dynamic energy, or creating portfolio pieces that open doors. We've helped countless clients transform how they present themselves to the world, and we're ready to do the same for you."
        }
      },
      {
        section: 'services_header',
        content: {
          title: "Professional Photography Services",
          subtitle: "Fayetteville, North Carolina",
          description: "Model Muse Studio is Fayetteville's premier photography studio specializing in professional model portfolios, actor headshots, business portraits, and creative photography serving Cumberland County, Fort Liberty, Hope Mills, Raeford, and surrounding North Carolina areas.",
          subdescription: "Comprehensive photography services for models, actors, military families, and professionals including professional headshots, portfolio photography, comp card design, and creative portraits in Fayetteville NC."
        }
      }
    ]

    const { error: insertError } = await supabase
      .from('homepage_content')
      .upsert(defaultContent, { onConflict: 'section' })

    if (insertError) throw insertError

    return NextResponse.json({ success: true, message: 'Homepage content initialized successfully' })
  } catch (error: any) {
    console.error('Migration error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
