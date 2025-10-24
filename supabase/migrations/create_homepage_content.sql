-- Create homepage_content table
CREATE TABLE IF NOT EXISTS homepage_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section TEXT NOT NULL UNIQUE, -- 'hero', 'about', 'services', etc.
  content JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id)
);

-- Disable RLS for simplicity (admin-only access)
ALTER TABLE homepage_content DISABLE ROW LEVEL SECURITY;

-- Insert default homepage content
INSERT INTO homepage_content (section, content) VALUES
  ('hero', '{
    "title": "Professional Photography",
    "subtitle": "Headshots & Portfolios",
    "tagline": "EXPERT MODELING PORTFOLIOS, ACTOR HEADSHOTS & CREATIVE PORTRAITS",
    "description": "Premium studio photography services for models, actors, and professionals seeking exceptional headshots and portfolio imagery",
    "primaryButton": "Book Photography Session",
    "secondaryButton": "View Professional Portfolio"
  }'),
  ('about', '{
    "heading": "Capturing Your Story",
    "subheading": "Through the Lens",
    "paragraph1": "Every face tells a story, and every moment deserves to be remembered beautifully. Our studio photography approach combines technical excellence with artistic vision, creating images that don't just document—they inspire. Whether you're seeking professional headshots that command attention or creative photography that captures your unique essence, we bring decades of experience to every session.",
    "paragraph2": "We believe professional photography is more than just clicking a shutter. It's about understanding light, reading emotions, and creating an environment where authenticity shines through. From corporate executives needing commanding team photography to families wanting to preserve precious memories, our photography services are tailored to reveal the best version of you.",
    "paragraph3": "What sets our artistic photography apart is our commitment to your vision. We don't believe in cookie-cutter approaches. Each digital photography session begins with understanding your goals—whether that's elevating your personal brand with professional headshots, showcasing your team's dynamic energy, or creating portfolio pieces that open doors. We've helped countless clients transform how they present themselves to the world, and we're ready to do the same for you."
  }'),
  ('services_header', '{
    "title": "Professional Photography Services",
    "subtitle": "Fayetteville, North Carolina",
    "description": "Model Muse Studio is Fayetteville''s premier photography studio specializing in professional model portfolios, actor headshots, business portraits, and creative photography serving Cumberland County, Fort Liberty, Hope Mills, Raeford, and surrounding North Carolina areas.",
    "subdescription": "Comprehensive photography services for models, actors, military families, and professionals including professional headshots, portfolio photography, comp card design, and creative portraits in Fayetteville NC."
  }')
ON CONFLICT (section) DO NOTHING;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_homepage_content_section ON homepage_content(section);
