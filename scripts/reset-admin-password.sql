-- Reset admin password for modelmuse805@gmail.com

DO $$
DECLARE
  admin_user_id UUID;
BEGIN
  -- Get the user ID
  SELECT id INTO admin_user_id
  FROM auth.users
  WHERE email = 'modelmuse805@gmail.com';

  IF admin_user_id IS NULL THEN
    RAISE EXCEPTION 'User not found';
  END IF;

  -- Update the password
  UPDATE auth.users
  SET
    encrypted_password = crypt('ModelMuse805!', gen_salt('bf')),
    updated_at = NOW()
  WHERE id = admin_user_id;

  -- Ensure user is confirmed
  UPDATE auth.users
  SET
    email_confirmed_at = COALESCE(email_confirmed_at, NOW()),
    confirmation_token = '',
    recovery_token = ''
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

  RAISE NOTICE 'Password reset successful!';
  RAISE NOTICE 'Email: modelmuse805@gmail.com';
  RAISE NOTICE 'Password: ModelMuse805!';
  RAISE NOTICE 'User ID: %', admin_user_id;
END $$;
