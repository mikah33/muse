-- =====================================================
-- Fix Hero Image Public Access
-- Run this SQL in your Supabase SQL Editor
-- =====================================================

-- This allows ANYONE (including non-logged-in users) to read site_settings
-- while keeping write operations restricted to authenticated users

-- 1. Drop existing restrictive read policy
DROP POLICY IF EXISTS "Allow authenticated read" ON site_settings;

-- 2. Create new public read policy for ALL users (authenticated and anonymous)
CREATE POLICY "Allow public read access" ON site_settings
  FOR SELECT
  USING (true);

-- 3. Keep the authenticated-only policies for write operations (these are fine)
-- The insert and update policies already exist and should remain:
-- - "Allow authenticated insert"
-- - "Allow authenticated update"

-- =====================================================
-- VERIFICATION
-- =====================================================
-- After running this, verify the policies:
-- SELECT * FROM pg_policies WHERE tablename = 'site_settings';
--
-- You should see:
-- 1. "Allow public read access" - SELECT policy with USING = true
-- 2. "Allow authenticated insert" - INSERT policy
-- 3. "Allow authenticated update" - UPDATE policy
-- =====================================================
