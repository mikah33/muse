-- =====================================================
-- Hero Image Settings - Database Setup
-- Run this SQL in your Supabase SQL Editor
-- =====================================================

-- 1. Create settings table for site-wide settings
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id)
);

-- 2. Enable Row Level Security
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- 3. Allow authenticated users to read settings
CREATE POLICY "Allow authenticated read" ON site_settings
  FOR SELECT TO authenticated USING (true);

-- 4. Allow authenticated users to insert settings
CREATE POLICY "Allow authenticated insert" ON site_settings
  FOR INSERT TO authenticated WITH CHECK (true);

-- 5. Allow authenticated users to update settings
CREATE POLICY "Allow authenticated update" ON site_settings
  FOR UPDATE TO authenticated USING (true);

-- 6. Insert default hero image setting
INSERT INTO site_settings (key, value)
VALUES ('hero_image', '/images/hero-image.jpg')
ON CONFLICT (key) DO NOTHING;

-- 7. Create trigger function to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 8. Create trigger on site_settings
CREATE TRIGGER update_site_settings_updated_at
  BEFORE UPDATE ON site_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- DONE! Now create the storage bucket:
-- 1. Go to Supabase Dashboard → Storage
-- 2. Click "New Bucket"
-- 3. Name: site-images
-- 4. Public bucket: YES
-- 5. Click "Create bucket"
-- =====================================================
