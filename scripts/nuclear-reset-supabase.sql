-- NUCLEAR OPTION: Complete Supabase Reset
-- ⚠️ WARNING: This will delete ALL data and start fresh

-- 1. Drop all triggers on auth.users
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN (
    SELECT t.tgname
    FROM pg_trigger t
    JOIN pg_class c ON t.tgrelid = c.oid
    JOIN pg_namespace n ON c.relnamespace = n.oid
    WHERE n.nspname = 'auth'
      AND c.relname = 'users'
      AND NOT t.tgisinternal
  ) LOOP
    BEGIN
      EXECUTE format('DROP TRIGGER IF EXISTS %I ON auth.users CASCADE', r.tgname);
      RAISE NOTICE 'Dropped trigger: %', r.tgname;
    EXCEPTION
      WHEN OTHERS THEN
        RAISE NOTICE 'Could not drop trigger %: %', r.tgname, SQLERRM;
    END;
  END LOOP;
END $$;

-- 2. Delete all users from auth.users (this will cascade to public.users)
DELETE FROM auth.users;

-- 3. Delete everything from public tables
DELETE FROM public.activity_logs;
DELETE FROM public.favorites;
DELETE FROM public.photos;
DELETE FROM public.galleries;
DELETE FROM public.customer_profiles;
DELETE FROM public.users;

-- 4. Drop and recreate the trigger function with better error handling
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, role, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'customer'),
    COALESCE(NULLIF(NEW.raw_user_meta_data->>'full_name', ''), 'User')
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    updated_at = NOW();

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Never fail auth due to trigger issues
    RAISE WARNING 'handle_new_user error: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- 6. Create fresh admin user
DO $$
DECLARE
  new_admin_id UUID := gen_random_uuid();
BEGIN
  -- Insert into auth.users
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    confirmation_token,
    recovery_token,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    is_sso_user
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    new_admin_id,
    'authenticated',
    'authenticated',
    'modelmuse805@gmail.com',
    crypt('ModelMuse805!', gen_salt('bf')),
    NOW(),
    '',
    '',
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"role":"admin","full_name":"Studio Admin"}'::jsonb,
    NOW(),
    NOW(),
    false
  );

  -- The trigger will create the public.users record, but ensure it's admin
  UPDATE public.users
  SET role = 'admin', full_name = 'Studio Admin'
  WHERE id = new_admin_id;

  RAISE NOTICE '✅ COMPLETE RESET SUCCESSFUL!';
  RAISE NOTICE 'Admin ID: %', new_admin_id;
  RAISE NOTICE 'Email: modelmuse805@gmail.com';
  RAISE NOTICE 'Password: ModelMuse805!';
END $$;

-- 7. Verify everything
SELECT 'Auth Users' as table_name, COUNT(*) as count FROM auth.users
UNION ALL
SELECT 'Public Users', COUNT(*) FROM public.users
UNION ALL
SELECT 'Triggers', COUNT(*) FROM pg_trigger t
  JOIN pg_class c ON t.tgrelid = c.oid
  JOIN pg_namespace n ON c.relnamespace = n.oid
  WHERE n.nspname = 'auth' AND c.relname = 'users' AND NOT t.tgisinternal;
