-- Create Test Customer Script
-- Run this in Supabase SQL Editor to create a test customer account

DO $$
DECLARE
  new_user_id UUID;
  new_gallery_id UUID;
BEGIN
  -- Create customer user in auth.users
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
    updated_at
  )
  VALUES (
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'customer@example.com',
    crypt('TestPassword123!', gen_salt('bf')),
    NOW(),
    '{"role": "customer", "full_name": "Test Customer"}'::jsonb,
    '{"provider": "email", "providers": ["email"]}'::jsonb,
    NOW(),
    NOW()
  )
  RETURNING id INTO new_user_id;

  -- Create customer profile
  INSERT INTO public.customer_profiles (
    user_id,
    address,
    phone,
    notes,
    created_by_admin
  )
  VALUES (
    new_user_id,
    '123 Test Street, Test City, TS 12345',
    '(555) 123-4567',
    'Test customer account for development',
    (SELECT id FROM public.users WHERE role = 'admin' LIMIT 1)
  );

  -- Create a test gallery
  INSERT INTO public.galleries (
    customer_id,
    gallery_name,
    description,
    shoot_date,
    is_active,
    created_by_admin
  )
  VALUES (
    new_user_id,
    'Test Portfolio Session',
    'Sample gallery for testing the customer portal',
    CURRENT_DATE,
    TRUE,
    (SELECT id FROM public.users WHERE role = 'admin' LIMIT 1)
  )
  RETURNING id INTO new_gallery_id;

  RAISE NOTICE 'Test customer created:';
  RAISE NOTICE 'Email: customer@example.com';
  RAISE NOTICE 'Password: TestPassword123!';
  RAISE NOTICE 'User ID: %', new_user_id;
  RAISE NOTICE 'Gallery ID: %', new_gallery_id;
  RAISE NOTICE '';
  RAISE NOTICE 'Upload test photos to Storage bucket, then assign them to gallery ID: %', new_gallery_id;
END $$;
