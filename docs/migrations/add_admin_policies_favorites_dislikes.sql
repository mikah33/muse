-- ============================================================================
-- ADD ADMIN POLICIES FOR FAVORITES AND DISLIKES
-- ============================================================================
-- This migration adds RLS policies to allow admins to view all favorites
-- and dislikes for all customers.
-- ============================================================================

-- ============================================================================
-- FAVORITES TABLE - ADMIN POLICIES
-- ============================================================================

-- Drop existing admin policy if it exists
DROP POLICY IF EXISTS "Admin can view all favorites" ON public.favorites;

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

-- ============================================================================
-- DISLIKES TABLE - ADMIN POLICIES (if not already added)
-- ============================================================================

-- Note: This should already exist from the dislikes table creation,
-- but we'll recreate it to be sure

DROP POLICY IF EXISTS "Admin can view all dislikes" ON public.dislikes;

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
-- MIGRATION COMPLETE
-- ============================================================================
-- To apply this migration:
-- 1. Go to Supabase Dashboard
-- 2. SQL Editor -> New Query
-- 3. Paste this SQL
-- 4. Click Run
-- ============================================================================
