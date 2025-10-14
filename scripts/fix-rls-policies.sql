-- Fix RLS policies to allow users to read their own record
-- This fixes the circular dependency issue

-- Drop the existing restrictive policies
DROP POLICY IF EXISTS "Customers can view own profile" ON public.users;
DROP POLICY IF EXISTS "Customers can update own profile" ON public.users;

-- Allow any authenticated user to read their OWN user record
-- This is needed for login to work
CREATE POLICY "Users can view own record"
  ON public.users
  FOR SELECT
  TO authenticated
  USING (id = auth.uid());

-- Allow any authenticated user to update their OWN profile (not role)
CREATE POLICY "Users can update own profile"
  ON public.users
  FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (
    id = auth.uid()
    AND role = (SELECT role FROM public.users WHERE id = auth.uid()) -- Prevent role changes
  );

-- Admin policy remains the same (admins can do everything)
-- The "Admin full access to users" policy is already in place

-- Verify the new policies
SELECT policyname, cmd, qual
FROM pg_policies
WHERE tablename = 'users'
ORDER BY policyname;
