-- Model Muse Studio Schema - NO TRIGGERS VERSION
-- Uses API routes with service role instead of auth triggers

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- PUBLIC.USERS TABLE (manually synced via API, no trigger)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'customer')),
  full_name TEXT NOT NULL,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- CUSTOMER PROFILES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.customer_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
  address TEXT,
  notes TEXT,
  created_by_admin UUID REFERENCES public.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- GALLERIES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.galleries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  gallery_name TEXT NOT NULL,
  description TEXT,
  shoot_date DATE,
  is_active BOOLEAN DEFAULT TRUE,
  created_by_admin UUID REFERENCES public.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- PHOTOS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  gallery_id UUID REFERENCES public.galleries(id) ON DELETE CASCADE,
  photo_url TEXT NOT NULL,
  thumbnail_url TEXT NOT NULL,
  title TEXT,
  description TEXT,
  file_size INTEGER,
  dimensions TEXT,
  order_position INTEGER DEFAULT 0,
  uploaded_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- FAVORITES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  photo_id UUID NOT NULL REFERENCES public.photos(id) ON DELETE CASCADE,
  favorited_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(customer_id, photo_id)
);

-- ============================================================================
-- ACTIVITY LOGS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID REFERENCES public.users(id),
  action TEXT NOT NULL,
  customer_id UUID REFERENCES public.users(id),
  gallery_id UUID REFERENCES public.galleries(id),
  photo_count INTEGER,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- INDEXES
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_galleries_customer_id ON public.galleries(customer_id);
CREATE INDEX IF NOT EXISTS idx_galleries_is_active ON public.galleries(is_active);
CREATE INDEX IF NOT EXISTS idx_photos_gallery_id ON public.photos(gallery_id);
CREATE INDEX IF NOT EXISTS idx_photos_order_position ON public.photos(order_position);
CREATE INDEX IF NOT EXISTS idx_favorites_customer_id ON public.favorites(customer_id);
CREATE INDEX IF NOT EXISTS idx_favorites_photo_id ON public.favorites(photo_id);

-- ============================================================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.galleries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- RLS POLICIES: USERS CAN VIEW OWN RECORD
-- ============================================================================
CREATE POLICY "Users can view own record"
  ON public.users FOR SELECT
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid() AND role = (SELECT role FROM public.users WHERE id = auth.uid()));

-- ============================================================================
-- RLS POLICIES: ADMIN FULL ACCESS
-- ============================================================================
CREATE POLICY "Admin full access to users"
  ON public.users FOR ALL
  TO authenticated
  USING ((SELECT role FROM public.users WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Admin full access to customer_profiles"
  ON public.customer_profiles FOR ALL
  TO authenticated
  USING ((SELECT role FROM public.users WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Admin full access to galleries"
  ON public.galleries FOR ALL
  TO authenticated
  USING ((SELECT role FROM public.users WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Admin full access to photos"
  ON public.photos FOR ALL
  TO authenticated
  USING ((SELECT role FROM public.users WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Admin can view all favorites"
  ON public.favorites FOR SELECT
  TO authenticated
  USING ((SELECT role FROM public.users WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Admin full access to activity_logs"
  ON public.activity_logs FOR ALL
  TO authenticated
  USING ((SELECT role FROM public.users WHERE id = auth.uid()) = 'admin');

-- ============================================================================
-- RLS POLICIES: CUSTOMER ACCESS
-- ============================================================================
CREATE POLICY "Customers can view own customer_profile"
  ON public.customer_profiles FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Customers view own active galleries"
  ON public.galleries FOR SELECT
  TO authenticated
  USING (
    customer_id = auth.uid()
    AND is_active = TRUE
  );

CREATE POLICY "Customers view own photos"
  ON public.photos FOR SELECT
  TO authenticated
  USING (
    gallery_id IN (
      SELECT id FROM public.galleries
      WHERE customer_id = auth.uid()
      AND is_active = TRUE
    )
  );

CREATE POLICY "Customers manage own favorites"
  ON public.favorites FOR ALL
  TO authenticated
  USING (customer_id = auth.uid())
  WITH CHECK (customer_id = auth.uid());

-- ============================================================================
-- UPDATED_AT TRIGGERS
-- ============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customer_profiles_updated_at BEFORE UPDATE ON public.customer_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_galleries_updated_at BEFORE UPDATE ON public.galleries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- STORAGE BUCKET
-- ============================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('photos', 'photos', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for admin
CREATE POLICY "Admin can upload photos"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'photos'
    AND (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
  );

CREATE POLICY "Admin can update photos"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'photos'
    AND (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
  );

CREATE POLICY "Admin can delete photos"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'photos'
    AND (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
  );

-- Storage policy for customers to view their photos
CREATE POLICY "Customers can view assigned photos"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'photos'
    AND (
      (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
      OR EXISTS (
        SELECT 1 FROM public.photos p
        JOIN public.galleries g ON p.gallery_id = g.id
        WHERE (p.photo_url LIKE '%' || name || '%' OR p.thumbnail_url LIKE '%' || name || '%')
        AND g.customer_id = auth.uid()
        AND g.is_active = TRUE
      )
    )
  );
