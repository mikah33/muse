# Model Muse Studio - Complete Setup Guide

## 🚀 Quick Start

Follow these steps to get your photography studio website up and running.

## Step 1: Database Setup

### 1.1 Apply Database Schema

1. Go to [Supabase Dashboard](https://supabase.com/dashboard/project/jotarlqbmtywbyhgslbe)
2. Navigate to **SQL Editor**
3. Click **New Query**
4. Copy the entire contents of `supabase/schema.sql`
5. Paste into the editor
6. Click **Run** or press `Cmd/Ctrl + Enter`

This will create:
- All tables (users, customer_profiles, galleries, photos, favorites, activity_logs)
- Row Level Security (RLS) policies
- Storage bucket for photos
- Indexes for performance
- Triggers for automation

### 1.2 Create Your Admin Account

Run this SQL in Supabase SQL Editor:

```sql
-- Create admin user in auth.users
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_user_meta_data,
  created_at,
  updated_at
)
VALUES (
  gen_random_uuid(),
  'admin@modelmusestudio.com',  -- Change this email
  crypt('YourSecurePassword123!', gen_salt('bf')),  -- Change this password
  NOW(),
  '{"role": "admin", "full_name": "Admin User"}'::jsonb,
  NOW(),
  NOW()
);
```

**Important:**
- Replace `admin@modelmusestudio.com` with your email
- Replace `YourSecurePassword123!` with a strong password
- Save your credentials securely!

### 1.3 Verify Storage Bucket

1. Go to **Storage** in Supabase Dashboard
2. You should see a bucket named `photos`
3. If not, create it:
   - Click **New Bucket**
   - Name: `photos`
   - Public: **OFF** (photos should be private)
   - Click **Create bucket**

## Step 2: Local Development

### 2.1 Install Dependencies

```bash
cd ~/model-muse-studio
npm install
```

### 2.2 Verify Environment Variables

Check `.env.local` contains:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://jotarlqbmtywbyhgslbe.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 2.3 Start Development Server

```bash
npm run dev
```

Open http://localhost:3000

## Step 3: Test Login Systems

### 3.1 Test Admin Login

1. Navigate to http://localhost:3000/admin/login
2. Enter your admin credentials
3. You should be redirected to `/admin` dashboard
4. Verify you see:
   - Stats cards (customers, galleries, photos)
   - Quick action buttons
   - Recent activity

### 3.2 Create a Test Customer

Using Supabase SQL Editor:

```sql
-- Create a test customer
DO $$
DECLARE
  new_user_id UUID;
BEGIN
  -- Create auth user
  INSERT INTO auth.users (
    id,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_user_meta_data,
    created_at,
    updated_at
  )
  VALUES (
    gen_random_uuid(),
    'customer@example.com',
    crypt('TestPassword123!', gen_salt('bf')),
    NOW(),
    '{"role": "customer", "full_name": "Test Customer"}'::jsonb,
    NOW(),
    NOW()
  )
  RETURNING id INTO new_user_id;

  -- Create customer profile
  INSERT INTO public.customer_profiles (user_id, notes)
  VALUES (new_user_id, 'Test customer account');
END $$;
```

### 3.3 Test Customer Login

1. Navigate to http://localhost:3000/login
2. Email: `customer@example.com`
3. Password: `TestPassword123!`
4. You should be redirected to `/portal`
5. Verify customer portal loads

## Step 4: Test Photo Upload (Manual)

For now, photos can be uploaded manually through Supabase:

1. Go to **Storage** > `photos` bucket
2. Click **Upload File**
3. Upload a test image
4. Copy the file name

Then insert into database:

```sql
-- First, create a gallery for the test customer
INSERT INTO public.galleries (customer_id, gallery_name, description, is_active)
SELECT id, 'Test Gallery', 'My first gallery', TRUE
FROM public.users
WHERE email = 'customer@example.com'
RETURNING id;

-- Copy the gallery ID, then insert photo
INSERT INTO public.photos (
  gallery_id,
  photo_url,
  thumbnail_url,
  title,
  description
)
VALUES (
  'PASTE-GALLERY-ID-HERE',
  'https://jotarlqbmtywbyhgslbe.supabase.co/storage/v1/object/public/photos/YOUR-FILE-NAME.jpg',
  'https://jotarlqbmtywbyhgslbe.supabase.co/storage/v1/object/public/photos/YOUR-FILE-NAME.jpg',
  'Test Photo',
  'First photo in the gallery'
);
```

Now log in as customer and you should see the gallery with the photo!

## Step 5: Deploy to Production

### 5.1 Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel
```

Follow the prompts:
- Set up and deploy? **Y**
- Which scope? Select your account
- Link to existing project? **N**
- Project name? **model-muse-studio**
- Which directory? **./model-muse-studio** (or wherever your project is)
- Override settings? **N**

### 5.2 Set Environment Variables in Vercel

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** > **Environment Variables**
4. Add these variables:

```
NEXT_PUBLIC_SUPABASE_URL = https://jotarlqbmtywbyhgslbe.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = [your-anon-key]
SUPABASE_SERVICE_ROLE_KEY = [your-service-role-key]
```

### 5.3 Redeploy

```bash
vercel --prod
```

Your site is now live! 🎉

## Step 6: Create Actual Customer Accounts

### Option A: Admin Creates Customer (Manual)

Run this SQL for each customer:

```sql
DO $$
DECLARE
  new_user_id UUID;
BEGIN
  INSERT INTO auth.users (
    id,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_user_meta_data,
    created_at,
    updated_at
  )
  VALUES (
    gen_random_uuid(),
    'jane.model@example.com',  -- Customer email
    crypt('TempPassword123!', gen_salt('bf')),  -- Temporary password
    NOW(),
    '{"role": "customer", "full_name": "Jane Model"}'::jsonb,
    NOW(),
    NOW()
  )
  RETURNING id INTO new_user_id;

  INSERT INTO public.customer_profiles (
    user_id,
    address,
    phone,
    notes
  )
  VALUES (
    new_user_id,
    '123 Main St, City, State',
    '(555) 123-4567',
    'Fashion model, signed with XYZ agency'
  );
END $$;
```

Then send the customer their credentials via email.

### Option B: Build Admin UI (Future)

You can build an admin form that does this programmatically. See README TODO section.

## Step 7: Assign Photos to Customers

### Create Gallery for Customer

```sql
-- Create a gallery
INSERT INTO public.galleries (
  customer_id,
  gallery_name,
  description,
  shoot_date,
  is_active,
  created_by_admin
)
SELECT
  u.id,
  'Spring 2024 Portfolio Shoot',
  'Professional portfolio photos from spring session',
  '2024-03-15',
  TRUE,
  (SELECT id FROM public.users WHERE role = 'admin' LIMIT 1)
FROM public.users u
WHERE u.email = 'jane.model@example.com';
```

### Upload and Assign Photos

1. Upload photos to Storage bucket
2. Insert into photos table with gallery_id

```sql
INSERT INTO public.photos (
  gallery_id,
  photo_url,
  thumbnail_url,
  title,
  order_position
)
VALUES
  ('GALLERY-ID', 'url-1.jpg', 'thumb-1.jpg', 'Photo 1', 1),
  ('GALLERY-ID', 'url-2.jpg', 'thumb-2.jpg', 'Photo 2', 2),
  ('GALLERY-ID', 'url-3.jpg', 'thumb-3.jpg', 'Photo 3', 3);
```

## 🎨 Customization

### Change Branding

Edit `components/shared/Header.tsx` and `components/shared/Footer.tsx`:
```tsx
MODEL MUSE
STUDIO
```

Replace with your studio name.

### Add Hero Image

Place your hero image at `public/images/hero-image.jpg`

### Customize Colors

Edit `tailwind.config.ts`:
```ts
colors: {
  'pure-black': '#000000',
  // ...change colors here
}
```

## 🔒 Security Checklist

- [x] RLS policies enabled on all tables
- [x] Admin routes protected by middleware
- [x] Customer routes protected by middleware
- [x] Role verification on login
- [x] Storage bucket private with signed URLs
- [ ] SSL certificate (handled by Vercel)
- [ ] Rate limiting (add later)
- [ ] Email verification (add later)

## 🐛 Troubleshooting

### Can't log in as admin
- Verify user exists in `auth.users`
- Check `raw_user_meta_data` contains `{"role": "admin"}`
- Verify password is correct
- Check browser console for errors

### Customer can't see galleries
- Verify `customer_id` in galleries table matches user ID
- Check `is_active = true` on gallery
- Verify RLS policies are enabled
- Check `gallery_id` is set on photos

### Photos not loading
- Check storage bucket exists
- Verify photos table has correct URLs
- Test URLs directly in browser
- Check storage policies are correct

## 📞 Need Help?

- Check README.md for full documentation
- Review database schema in `supabase/schema.sql`
- Check Next.js logs for errors
- Review Supabase logs in dashboard

## Next Steps

1. Build admin photo upload UI
2. Add email notifications for new galleries
3. Implement photo download feature
4. Add gallery sharing links
5. Create password reset flow
6. Add analytics dashboard

---

**Congratulations!** Your photography studio website is ready to use! 🎉
