-- Temporarily disable RLS on users table to break infinite recursion
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- Drop all policies on users
DROP POLICY IF EXISTS "Users can view own record" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Admin full access to users" ON public.users;
DROP POLICY IF EXISTS "Authenticated users full access" ON public.users;
