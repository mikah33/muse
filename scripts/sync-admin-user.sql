-- Sync admin user from auth.users to public.users
-- Run this AFTER creating the admin account in Supabase Auth Dashboard

INSERT INTO public.users (id, email, role, full_name, created_at, updated_at)
SELECT
  id,
  email,
  'admin' as role,
  'Studio Admin' as full_name,
  created_at,
  NOW() as updated_at
FROM auth.users
WHERE email = 'modelmuse805@gmail.com'
ON CONFLICT (id) DO UPDATE SET
  role = 'admin',
  full_name = 'Studio Admin',
  updated_at = NOW();

-- Verify the sync
SELECT id, email, role, full_name, created_at
FROM public.users
WHERE email = 'modelmuse805@gmail.com';
