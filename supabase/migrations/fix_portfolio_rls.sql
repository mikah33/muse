-- Drop existing portfolio policies
DROP POLICY IF EXISTS "Anyone can view published portfolio items" ON public.portfolio_items;
DROP POLICY IF EXISTS "Authenticated users can manage portfolio items" ON public.portfolio_items;

-- Disable RLS temporarily to avoid recursion issues
ALTER TABLE public.portfolio_items DISABLE ROW LEVEL SECURITY;
