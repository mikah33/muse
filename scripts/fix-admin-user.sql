-- Fix admin user - ensure it exists in both auth.users and public.users

DO $$
DECLARE
  admin_user_id UUID;
BEGIN
  -- Get the user ID from auth.users
  SELECT id INTO admin_user_id
  FROM auth.users
  WHERE email = 'modelmuse805@gmail.com';

  IF admin_user_id IS NULL THEN
    RAISE EXCEPTION 'User modelmuse805@gmail.com not found in auth.users. Please create the user first.';
  END IF;

  -- Check if user exists in public.users
  IF NOT EXISTS (SELECT 1 FROM public.users WHERE id = admin_user_id) THEN
    -- Insert into public.users
    INSERT INTO public.users (id, email, role, full_name, created_at, updated_at)
    VALUES (
      admin_user_id,
      'modelmuse805@gmail.com',
      'admin',
      'Studio Admin',
      NOW(),
      NOW()
    );
    RAISE NOTICE 'Created public.users record for admin';
  ELSE
    -- Update existing record to ensure role is admin
    UPDATE public.users
    SET role = 'admin', full_name = 'Studio Admin', updated_at = NOW()
    WHERE id = admin_user_id;
    RAISE NOTICE 'Updated public.users record to admin role';
  END IF;

  RAISE NOTICE 'Admin user ready!';
  RAISE NOTICE 'User ID: %', admin_user_id;
  RAISE NOTICE 'Email: modelmuse805@gmail.com';
  RAISE NOTICE 'Password: ModelMuse805!';
END $$;
