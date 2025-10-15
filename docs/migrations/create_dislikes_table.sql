-- ============================================================================
-- DISLIKES TABLE MIGRATION
-- ============================================================================
-- This migration creates a 'dislikes' table that mirrors the 'favorites' table
-- structure, allowing customers to mark photos they don't want.
--
-- Features:
-- - Same structure as favorites table
-- - Foreign keys to auth.users and photos table
-- - RLS policies for customer access control
-- - Unique constraint to prevent duplicate dislikes
-- - Indexes for performance optimization
-- ============================================================================

-- ============================================================================
-- CREATE DISLIKES TABLE
-- ============================================================================
CREATE TABLE public.dislikes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  photo_id UUID NOT NULL REFERENCES public.photos(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(customer_id, photo_id)
);

-- ============================================================================
-- CREATE INDEXES FOR PERFORMANCE
-- ============================================================================
CREATE INDEX idx_dislikes_customer_id ON public.dislikes(customer_id);
CREATE INDEX idx_dislikes_photo_id ON public.dislikes(photo_id);

-- ============================================================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================================================
ALTER TABLE public.dislikes ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- RLS POLICIES: ADMIN ACCESS
-- ============================================================================

-- Admin can view all dislikes
CREATE POLICY "Admin can view all dislikes"
  ON public.dislikes
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================================================
-- RLS POLICIES: CUSTOMER DISLIKES MANAGEMENT
-- ============================================================================

-- Customers can view their own dislikes
CREATE POLICY "Customers can view own dislikes"
  ON public.dislikes
  FOR SELECT
  TO authenticated
  USING (customer_id = auth.uid());

-- Customers can add dislikes (only for photos in their assigned galleries)
CREATE POLICY "Customers can add dislikes"
  ON public.dislikes
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

-- Customers can remove their own dislikes
CREATE POLICY "Customers can remove own dislikes"
  ON public.dislikes
  FOR DELETE
  TO authenticated
  USING (customer_id = auth.uid());

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================
-- To apply this migration, run:
-- psql -U postgres -d your_database -f create_dislikes_table.sql
--
-- Or in Supabase Dashboard:
-- SQL Editor -> New Query -> Paste contents -> Run
-- ============================================================================
