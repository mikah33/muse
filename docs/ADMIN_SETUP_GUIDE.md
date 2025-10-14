# Admin User Setup Guide

## Method 1: Use Supabase Dashboard (RECOMMENDED)

This is the most reliable way to create an admin user.

### Steps:

1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/jotarlqbmtywbyhgslbe

2. Click **Authentication** in the left sidebar

3. Click **Users** tab

4. Click **Add user** (green button, top right)

5. Fill in the form:
   - **Email**: `modelmuse805@gmail.com`
   - **Password**: `ModelMuse805!`
   - **Auto Confirm User**: ✅ CHECK THIS BOX (very important!)

6. Click **Create user**

7. After the user is created, run this SQL in the SQL Editor to set them as admin:

```sql
UPDATE public.users
SET role = 'admin', full_name = 'Studio Admin'
WHERE email = 'modelmuse805@gmail.com';
```

8. Now try logging in at http://localhost:3002/admin/login with:
   - Email: `modelmuse805@gmail.com`
   - Password: `ModelMuse805!`

## Method 2: Fix Existing User

If the user already exists but can't login, run this:

```sql
-- Reset everything for the user
UPDATE auth.users
SET
  encrypted_password = crypt('ModelMuse805!', gen_salt('bf')),
  email_confirmed_at = NOW(),
  confirmation_token = '',
  recovery_token = '',
  banned_until = NULL
WHERE email = 'modelmuse805@gmail.com';

-- Ensure admin role in public.users
UPDATE public.users
SET role = 'admin', full_name = 'Studio Admin'
WHERE email = 'modelmuse805@gmail.com';
```

## Troubleshooting

If you still get "Database error querying schema":

1. Check that the user exists in BOTH tables:
   - `auth.users`
   - `public.users`

2. Make sure the IDs match in both tables

3. Verify email is confirmed in auth.users (email_confirmed_at should not be NULL)
