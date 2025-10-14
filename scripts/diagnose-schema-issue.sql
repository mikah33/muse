-- Diagnose schema issues causing 500 error

-- 1. Check if trigger exists
SELECT
  'Trigger Check' as check_type,
  trigger_name,
  event_manipulation,
  event_object_table,
  action_statement
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';

-- 2. Check if function exists
SELECT
  'Function Check' as check_type,
  routine_name,
  routine_type
FROM information_schema.routines
WHERE routine_name = 'handle_new_user';

-- 3. List all users in auth.users
SELECT
  'auth.users' as table_name,
  id,
  email,
  email_confirmed_at,
  created_at
FROM auth.users
LIMIT 10;

-- 4. List all users in public.users
SELECT
  'public.users' as table_name,
  id,
  email,
  role,
  created_at
FROM public.users
LIMIT 10;

-- 5. Check for orphaned auth users without public.users records
SELECT
  'Orphaned Users' as check_type,
  au.id,
  au.email,
  'Missing in public.users' as issue
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
WHERE pu.id IS NULL;
