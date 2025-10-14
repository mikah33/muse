-- Check admin user setup and permissions

-- 1. Check if user exists in auth.users
SELECT
  'auth.users' as table_name,
  id,
  email,
  created_at,
  email_confirmed_at,
  raw_user_meta_data->>'role' as metadata_role
FROM auth.users
WHERE email = 'modelmuse805@gmail.com';

-- 2. Check if user exists in public.users
SELECT
  'public.users' as table_name,
  id,
  email,
  role,
  full_name,
  created_at
FROM public.users
WHERE email = 'modelmuse805@gmail.com';

-- 3. Check RLS policies on public.users
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'users';
