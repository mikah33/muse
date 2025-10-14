-- Insert Admin User into existing database
-- This assumes the schema already exists

DO $$
DECLARE
  new_user_id UUID;
  existing_user_id UUID;
BEGIN
  -- Check if user already exists
  SELECT id INTO existing_user_id
  FROM auth.users
  WHERE email = 'modelmuse805@gmail.com';

  IF existing_user_id IS NOT NULL THEN
    -- User exists, update their role to admin in public.users
    UPDATE public.users
    SET role = 'admin', full_name = 'Studio Admin'
    WHERE id = existing_user_id;

    RAISE NOTICE 'Updated existing user to admin: %', existing_user_id;
  ELSE
    -- Create new admin user
    INSERT INTO auth.users (
      id,
      instance_id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_user_meta_data,
      raw_app_meta_data,
      created_at,
      updated_at,
      confirmation_token,
      recovery_token
    )
    VALUES (
      gen_random_uuid(),
      '00000000-0000-0000-0000-000000000000',
      'authenticated',
      'authenticated',
      'modelmuse805@gmail.com',
      crypt('ModelMuse805!', gen_salt('bf')),
      NOW(),
      '{"role": "admin", "full_name": "Studio Admin"}'::jsonb,
      '{"provider": "email", "providers": ["email"]}'::jsonb,
      NOW(),
      NOW(),
      '',
      ''
    )
    RETURNING id INTO new_user_id;

    RAISE NOTICE 'Admin user created with ID: %', new_user_id;
  END IF;

  RAISE NOTICE 'Email: modelmuse805@gmail.com';
  RAISE NOTICE 'Password: ModelMuse805!';
END $$;
