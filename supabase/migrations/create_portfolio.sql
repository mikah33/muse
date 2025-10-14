-- Create portfolio_items table
CREATE TABLE IF NOT EXISTS public.portfolio_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  category TEXT,
  order_position INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_portfolio_slug ON public.portfolio_items(slug);
CREATE INDEX IF NOT EXISTS idx_portfolio_published ON public.portfolio_items(published);
CREATE INDEX IF NOT EXISTS idx_portfolio_category ON public.portfolio_items(category);
CREATE INDEX IF NOT EXISTS idx_portfolio_order ON public.portfolio_items(order_position);

-- Enable RLS
ALTER TABLE public.portfolio_items ENABLE ROW LEVEL SECURITY;

-- Public can view published items
CREATE POLICY "Anyone can view published portfolio items"
  ON public.portfolio_items FOR SELECT
  USING (published = TRUE);

-- Authenticated users can manage (no user table check)
CREATE POLICY "Authenticated users can manage portfolio items"
  ON public.portfolio_items FOR ALL
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- Updated at trigger
CREATE TRIGGER update_portfolio_items_updated_at
  BEFORE UPDATE ON public.portfolio_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Storage bucket for portfolio images
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio-images', 'portfolio-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;
