-- Create admin user from scratch (delete old one if exists)

DO $$
DECLARE
  new_user_id UUID := gen_random_uuid();
BEGIN
  -- Delete existing user if exists
  DELETE FROM public.users WHERE email = 'modelmuse805@gmail.com';
  DELETE FROM auth.users WHERE email = 'modelmuse805@gmail.com';

  -- Create new admin user in auth.users
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    invited_at,
    confirmation_token,
    confirmation_sent_at,
    recovery_token,
    recovery_sent_at,
    email_change_token_new,
    email_change,
    email_change_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    created_at,
    updated_at,
    phone,
    phone_confirmed_at,
    phone_change,
    phone_change_token,
    phone_change_sent_at,
    email_change_token_current,
    email_change_confirm_status,
    banned_until,
    reauthentication_token,
    reauthentication_sent_at,
    is_sso_user,
    deleted_at
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    new_user_id,
    'authenticated',
    'authenticated',
    'modelmuse805@gmail.com',
    crypt('ModelMuse805!', gen_salt('bf')),
    NOW(),
    NULL,
    '',
    NULL,
    '',
    NULL,
    '',
    '',
    NULL,
    NULL,
    '{"provider":"email","providers":["email"]}',
    '{"role":"admin","full_name":"Studio Admin"}',
    NULL,
    NOW(),
    NOW(),
    NULL,
    NULL,
    '',
    '',
    NULL,
    '',
    0,
    NULL,
    '',
    NULL,
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
END $$;
