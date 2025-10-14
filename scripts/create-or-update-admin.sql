-- Create or update admin user (safe version - no deletion)

DO $$
DECLARE
  admin_user_id UUID;
  user_exists BOOLEAN;
BEGIN
  -- Check if user exists in auth.users
  SELECT id INTO admin_user_id
  FROM auth.users
  WHERE email = 'modelmuse805@gmail.com';

  IF admin_user_id IS NOT NULL THEN
    -- User exists, update password and confirm email
    UPDATE auth.users
    SET
      encrypted_password = crypt('ModelMuse805!', gen_salt('bf')),
      email_confirmed_at = NOW(),
      confirmation_token = '',
      recovery_token = '',
      raw_user_meta_data = '{"role":"admin","full_name":"Studio Admin"}'::jsonb,
      updated_at = NOW()
    WHERE id = admin_user_id;

    -- Ensure record exists in public.users with admin role
    INSERT INTO public.users (id, email, role, full_name, created_at, updated_at)
    VALUES (
      admin_user_id,
      'modelmuse805@gmail.com',
      'admin',
      'Studio Admin',
      NOW(),
      NOW()
    )
    ON CONFLICT (id)
    DO UPDATE SET
      role = 'admin',
      email = 'modelmuse805@gmail.com',
      full_name = 'Studio Admin',
      updated_at = NOW();

    RAISE NOTICE '✅ Existing user updated!';
  ELSE
    -- Create new user
    admin_user_id := gen_random_uuid();

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
      admin_user_id,
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

    -- Create record in public.users (will be created automatically by trigger, but ensure it's admin)
    INSERT INTO public.users (id, email, role, full_name, created_at, updated_at)
    VALUES (
      admin_user_id,
      'modelmuse805@gmail.com',
      'admin',
      'Studio Admin',
      NOW(),
      NOW()
    )
    ON CONFLICT (id)
    DO UPDATE SET
      role = 'admin',
      updated_at = NOW();

    RAISE NOTICE '✅ New admin user created!';
  END IF;

  RAISE NOTICE 'User ID: %', admin_user_id;
  RAISE NOTICE 'Email: modelmuse805@gmail.com';
  RAISE NOTICE 'Password: ModelMuse805!';
  RAISE NOTICE 'Email confirmed: YES';
END $$;
