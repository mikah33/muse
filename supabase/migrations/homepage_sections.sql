-- Homepage Sections Table for Admin Editing
-- Allows admins to edit the 5 service categories on the homepage

CREATE TABLE IF NOT EXISTS public.homepage_sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section_number TEXT NOT NULL UNIQUE CHECK (section_number IN ('01', '02', '03', '04', '05')),
  icon TEXT NOT NULL DEFAULT '📸',
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT TRUE,
  display_order INTEGER NOT NULL,
  updated_by UUID REFERENCES public.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.homepage_sections ENABLE ROW LEVEL SECURITY;

-- Admin full access policy
CREATE POLICY "Admin full access to homepage_sections"
  ON public.homepage_sections
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

-- Public read access (for displaying on homepage)
CREATE POLICY "Public can view active homepage_sections"
  ON public.homepage_sections
  FOR SELECT
  TO anon, authenticated
  USING (is_active = TRUE);

-- Trigger for updated_at
CREATE TRIGGER update_homepage_sections_updated_at
  BEFORE UPDATE ON public.homepage_sections
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Index for performance
CREATE INDEX idx_homepage_sections_display_order ON public.homepage_sections(display_order);
CREATE INDEX idx_homepage_sections_is_active ON public.homepage_sections(is_active);

-- Insert default data (the 5 current service categories)
INSERT INTO public.homepage_sections (section_number, icon, title, description, items, display_order) VALUES
('01', '📸', 'Professional Photography Services - Fayetteville NC',
 'Model Muse Studio offers expert photography services in Fayetteville, North Carolina for models, actors, and professionals seeking high-quality portfolio images. Our Fayetteville photography studio specializes in model portfolios, professional headshots, and creative portraiture serving Cumberland County and surrounding NC areas.',
 '["Model Portfolio Photography Fayetteville NC: Professional model portfolio sessions in our Fayetteville studio featuring multiple outfit changes, studio and outdoor photography locations throughout Cumberland County, full body shots, and detailed close-ups. Perfect for aspiring and professional models in Fayetteville seeking agency-quality portfolio photography for submissions to modeling agencies.", "Professional Actor Headshots Fayetteville NC: Casting-ready headshot photography for theater, film, television, and commercial auditions. Our Fayetteville NC photography studio creates industry-standard actor headshots used by talent agencies and casting directors throughout North Carolina and the Southeast region.", "Business Headshot Photography Fayetteville: Professional corporate headshots and business portraits in Fayetteville NC for professionals, executives, and entrepreneurs. Our photography studio provides LinkedIn headshots, company headshots, and professional portraits for individuals and businesses in Cumberland County.", "Comp Card Design Services Fayetteville: Expert comp card and Z-card design for modeling agencies. Our Fayetteville photography studio creates professionally formatted comp cards with optimized image layouts meeting top modeling agency requirements across North Carolina and nationwide."]'::jsonb,
 1),

('02', '💼', 'Affordable Photography Packages - Fayetteville NC',
 'Flexible photography packages designed for every budget in Fayetteville, North Carolina. Model Muse Studio offers competitive pricing for professional photography services serving military families, models, actors, and professionals throughout Cumberland County.',
 '["Starter Photography Package Fayetteville NC: Affordable entry-level photography package including 1-2 outfit changes, professional studio lighting in our Fayetteville location, basic photo editing, and high-resolution digital image delivery. Perfect for headshots, basic portfolios, digitals, and first-time photography clients in the Fayetteville area.", "Professional Model Package Cumberland County: Comprehensive photography package featuring 3-5 looks, professional comp card design, advanced photo retouching, and professional hair & makeup artist services. The complete photography solution for serious models and actors in Fayetteville NC, Hope Mills, and throughout Cumberland County.", "Custom Photography Services: Tailored photography sessions designed for specific modeling agency requirements, brand guidelines, or creative vision. Custom packages available for photography clients throughout Fayetteville NC with flexible scheduling and friendly pricing."]'::jsonb,
 2),

('03', '🖼️', 'Fast Photo Editing & Delivery - Fayetteville NC',
 'Professional post-production photography services with industry-leading turnaround times. Model Muse Studio in Fayetteville NC provides fast photo editing, online galleries, and professional printing for photography clients throughout Cumberland County and North Carolina.',
 '["Online Photography Gallery Fayetteville: Secure private online proof gallery for easy photo selection, downloading, and sharing with modeling agents and casting directors. Access your professional photographs from anywhere with our convenient online delivery system - perfect for Fayetteville NC clients and those in surrounding areas.", "Rush Photography Services Fayetteville NC: Express photography editing and delivery available with 48-hour turnaround options for urgent auditions, castings, and modeling agency submissions. Our Fayetteville photography studio offers same-week delivery for time-sensitive photography needs throughout Cumberland County.", "Photography Usage Rights & Licensing: Complete commercial usage rights included with all Fayetteville NC photography packages for print portfolios, digital portfolios, social media, modeling comp cards, and professional marketing materials. No hidden fees - you own your images.", "Professional Photo Printing Fayetteville NC: High-end printing services for comp cards, headshot prints, and gallery-quality portfolio prints. Local photography printing available in Fayetteville with fast turnaround and professional quality."]'::jsonb,
 3),

('04', '✨', 'Premium Add-On Services - Fayetteville Photography Studio',
 'Elevate your photography experience with professional services at our Fayetteville NC studio. From expert retouching to professional styling, hair & makeup artists, and modeling career preparation—we offer everything Cumberland County clients need for exceptional results.',
 '["Professional Photo Retouching Fayetteville: Advanced photo retouching by expert photographers in Fayetteville NC including skin smoothing, color correction, blemish removal, background cleanup, and professional-grade editing for flawless portfolio images. Industry-standard retouching for models, actors, and professionals throughout Cumberland County.", "Hair & Makeup Artist Services Fayetteville NC: Professional makeup artist (MUA) and hair stylist available for photography sessions in Fayetteville. On-location services ensuring camera-ready appearance for models, actors, and headshot clients throughout Cumberland County. Our experienced team delivers polished, professional results perfect for any photography session.", "Photography Wardrobe Styling Consultation: Expert wardrobe consultation and styling guidance for photography sessions in Fayetteville NC. Professional styling support before and during photo shoots ensuring optimal visual impact for model portfolios, headshots, and creative portraits. Our stylists help you select outfits that photograph beautifully and align with your vision.", "Modeling Career Portfolio Packages Fayetteville: Photography portfolios formatted and optimized for modeling career advancement. Our Fayetteville NC studio creates professional submission packages that showcase your best work with proper formatting, sizing, and presentation standards. We prepare you for success in the modeling industry with portfolios that make a strong first impression.", "Brand Photography Content Creation Fayetteville NC: Professional brand photography services for influencers, entrepreneurs, small businesses, and content creators in Fayetteville and Cumberland County. Build your personal or business brand with polished photography content for social media, websites, and marketing. Strategic photography that elevates your professional presence and connects with your audience."]'::jsonb,
 4),

('05', '🎓', 'Photography Workshops & Training - Fayetteville NC',
 'Educational photography services and professional development for models, actors, and photography enthusiasts in Fayetteville, North Carolina. Model Muse Studio offers coaching, workshops, and portfolio building services throughout Cumberland County.',
 '["Portfolio Building Photography Sessions Fayetteville: Multi-session photography packages designed to build comprehensive, diverse portfolios over time. Perfect for models and actors in Fayetteville NC developing their careers with professional photography guidance throughout the portfolio building process.", "Professional Posing & Expression Coaching Cumberland County: Expert coaching on posing techniques, facial expressions, body angles, and movement during photography sessions. Our Fayetteville photographers provide personalized guidance for natural, confident photographs that showcase your best angles and expressions.", "Photography Workshops in Fayetteville NC: Small group and private photography training sessions for aspiring models, actors, content creators, and photography enthusiasts. Learn professional photography techniques, posing, lighting, and industry standards from experienced Fayetteville NC photographers.", "Social Media Photography Strategy Fayetteville: Professional photography content kits and strategic layout guidance for building strong online presence. Optimize your Instagram, TikTok, Facebook, and professional profiles with high-quality photographs from our Fayetteville NC photography studio."]'::jsonb,
 5)

ON CONFLICT (section_number) DO NOTHING;
