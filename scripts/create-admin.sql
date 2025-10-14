-- Create Admin User Script
-- Run this in Supabase SQL Editor to create your first admin account

DO $$
DECLARE
  new_user_id UUID;
BEGIN
  -- Create admin user in auth.users
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
  RAISE NOTICE 'Email: modelmuse805@gmail.com';
  RAISE NOTICE 'Password: ModelMuse805!';
END $$;
