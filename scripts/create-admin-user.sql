-- Create admin user record in public.users table
-- Run this in Supabase SQL Editor

-- First, check if the user exists in auth.users
-- Get the user ID from the error message: f1e6c6a7-9906-47bc-83a4-bc4605d07454

-- Insert the user into public.users table with admin role
INSERT INTO public.users (id, email, role, full_name)
VALUES (
  'f1e6c6a7-9906-47bc-83a4-bc4605d07454',
  'modelmuse805@gmail.com',
  'admin',
  'Model Muse Admin'
)
ON CONFLICT (id) DO UPDATE
SET
  role = 'admin',
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name;

-- Verify the user was created
SELECT id, email, role, full_name FROM public.users WHERE email = 'modelmuse805@gmail.com';
