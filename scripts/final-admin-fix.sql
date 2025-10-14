-- Final admin fix - disable trigger temporarily, then re-enable

DO $$
DECLARE
  old_user_id UUID;
  new_user_id UUID := gen_random_uuid();
BEGIN
  -- Disable the trigger temporarily
  ALTER TABLE auth.users DISABLE TRIGGER on_auth_user_created;

  -- Get existing user ID if exists
  SELECT id INTO old_user_id FROM auth.users WHERE email = 'modelmuse805@gmail.com';

  IF old_user_id IS NOT NULL THEN
    -- Delete from public tables first
    DELETE FROM public.customer_profiles WHERE user_id = old_user_id;
    DELETE FROM public.galleries WHERE customer_id = old_user_id OR created_by_admin = old_user_id;
    DELETE FROM public.favorites WHERE customer_id = old_user_id;
    DELETE FROM public.activity_logs WHERE admin_id = old_user_id OR customer_id = old_user_id;
    DELETE FROM public.users WHERE id = old_user_id;

    -- Delete from auth.users
    DELETE FROM auth.users WHERE id = old_user_id;

    RAISE NOTICE 'Deleted old user: %', old_user_id;
  END IF;

  -- Create fresh admin user in auth.users (trigger is disabled)
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
    created_at,
    updated_at,
    is_sso_user
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    new_user_id,
    'authenticated',
    'authenticated',
    'modelmuse805@gmail.com',
    crypt('ModelMuse805!', gen_salt('bf')),
    NOW(),
    '',
    '',
    '',
    '',
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"role":"admin","full_name":"Studio Admin"}'::jsonb,
    NOW(),
    NOW(),
    false
  );

  -- Manually create record in public.users (since trigger is disabled)
  INSERT INTO public.users (id, email, role, full_name, created_at, updated_at)
  VALUES (
    new_user_id,
    'modelmuse805@gmail.com',
    'admin',
    'Studio Admin',
    NOW(),
    NOW()
  );

  -- Re-enable the trigger
  ALTER TABLE auth.users ENABLE TRIGGER on_auth_user_created;

  RAISE NOTICE '✅ Admin user created successfully!';
  RAISE NOTICE 'User ID: %', new_user_id;
  RAISE NOTICE 'Email: modelmuse805@gmail.com';
  RAISE NOTICE 'Password: ModelMuse805!';
  RAISE NOTICE 'Email Confirmed: YES';
  RAISE NOTICE 'Trigger re-enabled: YES';

EXCEPTION
  WHEN OTHERS THEN
    -- Make sure to re-enable trigger even if there's an error
    ALTER TABLE auth.users ENABLE TRIGGER on_auth_user_created;
    RAISE;
END $$;
