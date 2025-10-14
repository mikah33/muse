-- Simple fix - just update the existing user properly

DO $$
DECLARE
  admin_user_id UUID;
BEGIN
  -- Get the user ID from auth.users
  SELECT id INTO admin_user_id
  FROM auth.users
  WHERE email = 'modelmuse805@gmail.com';

  IF admin_user_id IS NULL THEN
    RAISE EXCEPTION 'User modelmuse805@gmail.com not found in auth.users. Please create via Supabase Dashboard.';
  END IF;

  -- Update password and confirm email in auth.users
  UPDATE auth.users
  SET
    encrypted_password = crypt('ModelMuse805!', gen_salt('bf')),
    email_confirmed_at = COALESCE(email_confirmed_at, NOW()),
    confirmation_token = '',
    recovery_token = '',
    banned_until = NULL,
    updated_at = NOW()
  WHERE id = admin_user_id;

  -- Ensure user exists in public.users with admin role
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

  RAISE NOTICE '✅ Admin user updated successfully!';
  RAISE NOTICE 'User ID: %', admin_user_id;
  RAISE NOTICE 'Email: modelmuse805@gmail.com';
  RAISE NOTICE 'Password: ModelMuse805!';
  RAISE NOTICE 'Role: admin';
  RAISE NOTICE '';
  RAISE NOTICE 'Try logging in now at: http://localhost:3002/admin/login';

END $$;
