import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST() {
  try {
    const supabase = await createClient()

    // Create the table
    const { error: tableError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS page_content (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          page_name TEXT NOT NULL UNIQUE,
          content JSONB NOT NULL,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_by UUID REFERENCES auth.users(id)
        );

        ALTER TABLE page_content DISABLE ROW LEVEL SECURITY;

        CREATE INDEX IF NOT EXISTS idx_page_content_page_name ON page_content(page_name);
      `
    })

    // Insert default content
    const defaultContent = [
      {
        page_name: 'about',
        content: {
          hero: {
            title: "More Than Just",
            subtitle: "Photos"
          },
          introduction: {
            paragraph1: "In today's visual-first world, your photos are your voice—and your first impression. That's why every session at Model Muse Studio is more than a photoshoot: it's an intentional, creative collaboration designed to showcase your personality, style, and potential.",
            paragraph2: "With expert direction, dynamic lighting, and an editorial eye, we create headshots, portraits, and creative looks that capture attention and open doors.",
            paragraph3: "Our mission is simple: to help you frame your confidence through powerful, high-quality imagery that tells your unique story."
          },
          whyChoose: {
            title: "Why Choose Model Muse Studio?",
            reason1: {
              title: "Tailored to You",
              description: "Every session is crafted around your goals—whether you're an aspiring talent or a seasoned pro."
            },
            reason2: {
              title: "Industry Insight",
              description: "We understand what agencies, casting directors, and brands want to see. Your images won't just look good—they'll work hard for your career."
            },
            reason3: {
              title: "Confidence Through Imagery",
              description: "Our studio is a safe, supportive space where you're empowered to express your authentic self—boldly and unapologetically."
            }
          }
        }
      },
      {
        page_name: 'contact',
        content: {
          hero: {
            title: "Get in Touch",
            subtitle: "Ready to elevate your portfolio? Reach out to book your session or ask any questions."
          },
          contactInfo: {
            email: "contact@modelmusestudio.com",
            phone: "910-703-7477",
            hours: {
              weekday: "Monday - Friday: 9:00 AM - 6:00 PM",
              saturday: "Saturday: 10:00 AM - 4:00 PM",
              sunday: "Sunday: By Appointment Only"
            }
          }
        }
      }
    ]

    for (const page of defaultContent) {
      const { error } = await supabase
        .from('page_content')
        .upsert(page, { onConflict: 'page_name' })

      if (error) console.error(`Error inserting ${page.page_name}:`, error)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Migration error:', error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
