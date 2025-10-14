-- Complete admin user reset - handles all foreign keys properly

DO $$
DECLARE
  old_user_id UUID;
  new_user_id UUID := gen_random_uuid();
BEGIN
  -- Get existing user ID if exists
  SELECT id INTO old_user_id FROM auth.users WHERE email = 'modelmuse805@gmail.com';

  IF old_user_id IS NOT NULL THEN
    -- Delete from public.users first (child table)
    DELETE FROM public.customer_profiles WHERE user_id = old_user_id;
    DELETE FROM public.galleries WHERE customer_id = old_user_id OR created_by_admin = old_user_id;
    DELETE FROM public.favorites WHERE customer_id = old_user_id;
    DELETE FROM public.activity_logs WHERE admin_id = old_user_id OR customer_id = old_user_id;
    DELETE FROM public.users WHERE id = old_user_id;

    -- Now delete from auth.users
    DELETE FROM auth.users WHERE id = old_user_id;

    RAISE NOTICE 'Deleted old user: %', old_user_id;
  END IF;

  -- Create fresh admin user in auth.users
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
    email_change_token_new,
    email_change,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    created_at,
    updated_at,
    is_sso_user,
    deleted_at
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    new_user_id,
    'authenticated',
    'authenticated',
    'modelmuse805@gmail.com',
    crypt('ModelMuse805!', gen_salt('bf')),
    NOW(), -- Confirm email immediately
    '',
    '',
    '',
    '',
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"role":"admin","full_name":"Studio Admin"}'::jsonb,
    false,
    NOW(),
    NOW(),
    false,
    NULL
  );

  -- Create record in public.users
  INSERT INTO public.users (id, email, role, full_name, created_at, updated_at)
  VALUES (
    new_user_id,
    'modelmuse805@gmail.com',
    'admin',
    'Studio Admin',
    NOW(),
    NOW()
  );

  RAISE NOTICE '✅ Admin user created successfully!';
  RAISE NOTICE 'User ID: %', new_user_id;
  RAISE NOTICE 'Email: modelmuse805@gmail.com';
  RAISE NOTICE 'Password: ModelMuse805!';
  RAISE NOTICE 'Email Confirmed: YES';
  RAISE NOTICE '';
  RAISE NOTICE 'You can now login at: http://localhost:3002/admin/login';

END $$;
