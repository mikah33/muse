-- Photography Studio Database Schema with Dual Login System
-- This schema implements complete role-based access control with RLS policies

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- USERS TABLE (extends Supabase auth.users)
-- ============================================================================
CREATE TABLE public.users (
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
CREATE TABLE public.customer_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  address TEXT,
  notes TEXT,
  created_by_admin UUID REFERENCES public.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- ============================================================================
-- GALLERIES TABLE
-- ============================================================================
CREATE TABLE public.galleries (
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
CREATE TABLE public.photos (
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
CREATE TABLE public.favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  photo_id UUID NOT NULL REFERENCES public.photos(id) ON DELETE CASCADE,
  favorited_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(customer_id, photo_id)
);

-- ============================================================================
-- ACTIVITY LOGS TABLE
-- ============================================================================
CREATE TABLE public.activity_logs (
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
-- INDEXES for Performance
-- ============================================================================
CREATE INDEX idx_users_role ON public.users(role);
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_galleries_customer_id ON public.galleries(customer_id);
CREATE INDEX idx_galleries_is_active ON public.galleries(is_active);
CREATE INDEX idx_photos_gallery_id ON public.photos(gallery_id);
CREATE INDEX idx_photos_order_position ON public.photos(order_position);
CREATE INDEX idx_favorites_customer_id ON public.favorites(customer_id);
CREATE INDEX idx_favorites_photo_id ON public.favorites(photo_id);

-- ============================================================================
-- ENABLE ROW LEVEL SECURITY (RLS) ON ALL TABLES
-- ============================================================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.galleries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- RLS POLICIES: ADMIN FULL ACCESS
-- ============================================================================

-- Admin can do everything on users table
CREATE POLICY "Admin full access to users"
  ON public.users
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

-- Admin can do everything on customer_profiles
CREATE POLICY "Admin full access to customer_profiles"
  ON public.customer_profiles
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

-- Admin can do everything on galleries
CREATE POLICY "Admin full access to galleries"
  ON public.galleries
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

-- Admin can do everything on photos
CREATE POLICY "Admin full access to photos"
  ON public.photos
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

-- Admin can view all favorites
CREATE POLICY "Admin can view all favorites"
  ON public.favorites
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admin can view all activity logs
CREATE POLICY "Admin can view activity logs"
  ON public.activity_logs
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================================================
-- RLS POLICIES: CUSTOMER READ ACCESS (Own Data Only)
-- ============================================================================

-- Customers can view their own user record
CREATE POLICY "Customers can view own profile"
  ON public.users
  FOR SELECT
  TO authenticated
  USING (id = auth.uid() AND role = 'customer');

-- Customers can update their own user record
CREATE POLICY "Customers can update own profile"
  ON public.users
  FOR UPDATE
  TO authenticated
  USING (id = auth.uid() AND role = 'customer')
  WITH CHECK (id = auth.uid() AND role = 'customer');

-- Customers can view their own customer profile
CREATE POLICY "Customers can view own customer_profile"
  ON public.customer_profiles
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Customers can only see galleries assigned to them (and only active ones)
CREATE POLICY "Customers view own galleries"
  ON public.galleries
  FOR SELECT
  TO authenticated
  USING (
    customer_id = auth.uid()
    AND is_active = TRUE
    AND EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'customer'
    )
  );

-- Customers can only see photos in their assigned galleries
CREATE POLICY "Customers view own photos"
  ON public.photos
  FOR SELECT
  TO authenticated
  USING (
    gallery_id IN (
      SELECT id FROM public.galleries
      WHERE customer_id = auth.uid()
      AND is_active = TRUE
    )
    AND EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'customer'
    )
  );

-- ============================================================================
-- RLS POLICIES: CUSTOMER FAVORITES MANAGEMENT
-- ============================================================================

-- Customers can view their own favorites
CREATE POLICY "Customers can view own favorites"
  ON public.favorites
  FOR SELECT
  TO authenticated
  USING (customer_id = auth.uid());

-- Customers can add favorites
CREATE POLICY "Customers can add favorites"
  ON public.favorites
  FOR INSERT
  TO authenticated
  WITH CHECK (
    customer_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.photos p
      JOIN public.galleries g ON p.gallery_id = g.id
      WHERE p.id = photo_id
      AND g.customer_id = auth.uid()
      AND g.is_active = TRUE
    )
  );

-- Customers can remove their own favorites
CREATE POLICY "Customers can remove own favorites"
  ON public.favorites
  FOR DELETE
  TO authenticated
  USING (customer_id = auth.uid());

-- ============================================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customer_profiles_updated_at BEFORE UPDATE ON public.customer_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_galleries_updated_at BEFORE UPDATE ON public.galleries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically create user profile when user is created
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, role, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'customer'),
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to handle new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================================
-- STORAGE BUCKET FOR PHOTOS
-- ============================================================================

-- Create storage bucket for photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('photos', 'photos', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for admin
CREATE POLICY "Admin can upload photos"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'photos'
    AND EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admin can update photos"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'photos'
    AND EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admin can delete photos"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'photos'
    AND EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Storage policy for customers to view their assigned photos
CREATE POLICY "Customers can view assigned photos"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'photos'
    AND (
      -- Admin can view all
      EXISTS (
        SELECT 1 FROM public.users
        WHERE id = auth.uid() AND role = 'admin'
      )
      OR
      -- Customer can only view photos in their galleries
      EXISTS (
        SELECT 1 FROM public.photos p
        JOIN public.galleries g ON p.gallery_id = g.id
        WHERE (p.photo_url LIKE '%' || name || '%' OR p.thumbnail_url LIKE '%' || name || '%')
        AND g.customer_id = auth.uid()
        AND g.is_active = TRUE
      )
    )
  );
