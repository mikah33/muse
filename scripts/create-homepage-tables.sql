-- ============================================================================
-- HOMEPAGE CONTENT TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.homepage_content (
  section TEXT PRIMARY KEY,
  content JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on homepage_content
ALTER TABLE public.homepage_content ENABLE ROW LEVEL SECURITY;

-- Admin can do everything
CREATE POLICY "Admin full access to homepage_content"
  ON public.homepage_content
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Public read access (for displaying on website)
CREATE POLICY "Public can read homepage_content"
  ON public.homepage_content
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Insert default homepage content
INSERT INTO public.homepage_content (section, content) VALUES
('hero', '{
  "title": "Professional Photography",
  "subtitle": "Headshots & Portfolios",
  "tagline": "EXPERT MODELING PORTFOLIOS, ACTOR HEADSHOTS & CREATIVE PORTRAITS",
  "description": "Premium studio photography services for models, actors, and professionals seeking exceptional headshots and portfolio imagery",
  "primaryButton": "Book Photography Session",
  "secondaryButton": "View Professional Portfolio"
}'::jsonb),
('about', '{
  "heading": "Capturing Your Story",
  "subheading": "Through the Lens",
  "paragraph1": "Every face tells a story, and every moment deserves to be remembered beautifully. Our studio photography approach combines technical excellence with artistic vision, creating images that don''t just document—they inspire. Whether you''re seeking professional headshots that command attention or creative photography that captures your unique essence, we bring decades of experience to every session.",
  "paragraph2": "We believe professional photography is more than just clicking a shutter. It''s about understanding light, reading emotions, and creating an environment where authenticity shines through. From corporate executives needing commanding team photography to families wanting to preserve precious memories, our photography services are tailored to reveal the best version of you.",
  "paragraph3": "What sets our artistic photography apart is our commitment to your vision. We don''t believe in cookie-cutter approaches. Each digital photography session begins with understanding your goals—whether that''s elevating your personal brand with professional headshots, showcasing your team''s dynamic energy, or creating portfolio pieces that open doors. We''ve helped countless clients transform how they present themselves to the world, and we''re ready to do the same for you."
}'::jsonb),
('services_header', '{
  "title": "Professional Photography Services",
  "subtitle": "Fayetteville, North Carolina",
  "description": "Model Muse Studio is Fayetteville''s premier photography studio specializing in professional model portfolios, actor headshots, business portraits, and creative photography serving Cumberland County, Fort Liberty, Hope Mills, Raeford, and surrounding North Carolina areas.",
  "subdescription": "Comprehensive photography services for models, actors, military families, and professionals including professional headshots, portfolio photography, comp card design, and creative portraits in Fayetteville NC."
}'::jsonb)
ON CONFLICT (section) DO NOTHING;

-- ============================================================================
-- SERVICES TABLE (for the 5 service cards)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT,
  order_position INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on services
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- Admin can do everything
CREATE POLICY "Admin full access to services"
  ON public.services
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Public read access for active services
CREATE POLICY "Public can read active services"
  ON public.services
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

-- Insert default 5 services
INSERT INTO public.services (title, description, icon, order_position) VALUES
('Professional Headshots', 'Executive portraits and professional headshots designed to make a lasting impression in your industry.', 'user', 1),
('Model Portfolio Photography', 'Comprehensive portfolio shoots that showcase your versatility and help you stand out to agencies and clients.', 'camera', 2),
('Actor Headshots', 'Industry-standard headshots that capture your unique character and help you book more auditions.', 'film', 3),
('Creative Portraits', 'Artistic portrait sessions that express your personality and style through innovative lighting and composition.', 'palette', 4),
('Team & Corporate Photography', 'Professional team photos and corporate imagery that strengthen your company''s brand identity.', 'users', 5)
ON CONFLICT DO NOTHING;

-- Trigger for updated_at on homepage_content
CREATE TRIGGER update_homepage_content_updated_at
  BEFORE UPDATE ON public.homepage_content
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger for updated_at on services
CREATE TRIGGER update_services_updated_at
  BEFORE UPDATE ON public.services
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create index for services order
CREATE INDEX IF NOT EXISTS idx_services_order_position ON public.services(order_position);
CREATE INDEX IF NOT EXISTS idx_services_is_active ON public.services(is_active);
