-- Create page_content table for editable pages
CREATE TABLE IF NOT EXISTS page_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_name TEXT NOT NULL UNIQUE, -- 'about', 'services', 'portfolio', 'contact'
  content JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id)
);

-- Disable RLS for simplicity (admin-only access)
ALTER TABLE page_content DISABLE ROW LEVEL SECURITY;

-- Insert default content for each page
INSERT INTO page_content (page_name, content) VALUES
  ('about', '{
    "hero": {
      "title": "More Than Just",
      "subtitle": "Photos"
    },
    "introduction": {
      "paragraph1": "In today''s visual-first world, your photos are your voice—and your first impression. That''s why every session at Model Muse Studio is more than a photoshoot: it''s an intentional, creative collaboration designed to showcase your personality, style, and potential.",
      "paragraph2": "With expert direction, dynamic lighting, and an editorial eye, we create headshots, portraits, and creative looks that capture attention and open doors.",
      "paragraph3": "Our mission is simple: to help you frame your confidence through powerful, high-quality imagery that tells your unique story."
    },
    "whyChoose": {
      "title": "Why Choose Model Muse Studio?",
      "reason1": {
        "title": "Tailored to You",
        "description": "Every session is crafted around your goals—whether you''re an aspiring talent or a seasoned pro."
      },
      "reason2": {
        "title": "Industry Insight",
        "description": "We understand what agencies, casting directors, and brands want to see. Your images won''t just look good—they''ll work hard for your career."
      },
      "reason3": {
        "title": "Confidence Through Imagery",
        "description": "Our studio is a safe, supportive space where you''re empowered to express your authentic self—boldly and unapologetically."
      }
    }
  }'),
  ('services', '{
    "hero": {
      "title": "Professional Photography",
      "subtitle": "Services & Packages"
    },
    "introduction": {
      "paragraph1": "Model Muse Studio is Fayetteville''s premier photography studio specializing in professional model portfolios, actor headshots, and creative portraiture. Located in Fayetteville, North Carolina, we serve models, actors, and professionals throughout Cumberland County, Fort Liberty (formerly Fort Bragg), Hope Mills, Raeford, Southern Pines, and surrounding areas.",
      "paragraph2": "Our Fayetteville NC photography studio offers comprehensive services including model portfolio photography, professional headshot photography, comp card design, agency digitals, and professional retouching. We provide fast turnaround times, affordable packages, and industry-leading quality for clients seeking the best photographer in Fayetteville NC."
    }
  }'),
  ('portfolio', '{
    "hero": {
      "title": "Portfolio",
      "subtitle": "A curated collection of our finest work in fashion and beauty photography"
    }
  }'),
  ('contact', '{
    "hero": {
      "title": "Get in Touch",
      "subtitle": "Ready to elevate your portfolio? Reach out to book your session or ask any questions."
    },
    "contactInfo": {
      "email": "contact@modelmusestudio.com",
      "phone": "910-703-7477",
      "hours": {
        "weekday": "Monday - Friday: 9:00 AM - 6:00 PM",
        "saturday": "Saturday: 10:00 AM - 4:00 PM",
        "sunday": "Sunday: By Appointment Only"
      }
    }
  }')
ON CONFLICT (page_name) DO NOTHING;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_page_content_page_name ON page_content(page_name);
