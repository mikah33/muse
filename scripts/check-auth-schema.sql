-- Check if auth schema is intact

-- 1. List all tables in auth schema
SELECT
  'auth schema tables' as check_type,
  schemaname,
  tablename
FROM pg_tables
WHERE schemaname = 'auth'
ORDER BY tablename;

-- 2. Check if critical auth tables exist
SELECT
  'Critical tables check' as check_type,
  EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'auth' AND table_name = 'users') as users_exists,
  EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'auth' AND table_name = 'identities') as identities_exists,
  EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'auth' AND table_name = 'sessions') as sessions_exists;

-- 3. Check column structure of auth.users
SELECT
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_schema = 'auth'
  AND table_name = 'users'
ORDER BY ordinal_position;

-- 4. Count users in auth.users
SELECT
  'User count in auth.users' as check_type,
  COUNT(*) as total_users,
  COUNT(CASE WHEN email_confirmed_at IS NOT NULL THEN 1 END) as confirmed_users,
  COUNT(CASE WHEN email_confirmed_at IS NULL THEN 1 END) as unconfirmed_users
FROM auth.users;

-- 5. Check for the specific admin user
SELECT
  'Admin user details' as check_type,
  id,
  email,
  email_confirmed_at IS NOT NULL as email_confirmed,
  encrypted_password IS NOT NULL as has_password,
  banned_until,
  deleted_at,
  created_at
FROM auth.users
WHERE email = 'modelmuse805@gmail.com';
