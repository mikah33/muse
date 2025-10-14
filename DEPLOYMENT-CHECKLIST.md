# Model Muse Studio - Deployment Checklist

## 📋 Pre-Deployment Checklist

### ✅ Database Setup
- [ ] Open Supabase Dashboard: https://supabase.com/dashboard/project/jotarlqbmtywbyhgslbe
- [ ] Navigate to SQL Editor
- [ ] Run `supabase/schema.sql` (creates all tables, RLS policies, storage bucket)
- [ ] Verify tables created: users, customer_profiles, galleries, photos, favorites, activity_logs
- [ ] Verify storage bucket created: `photos`
- [ ] Run `scripts/create-admin.sql` (creates your admin account)
- [ ] Update email and password in script before running
- [ ] Save admin credentials securely

### ✅ Local Testing
- [ ] `cd ~/model-muse-studio`
- [ ] `npm install` (already done - 207 packages installed)
- [ ] `npm run dev` (starts development server)
- [ ] Visit http://localhost:3000 (homepage loads)
- [ ] Visit http://localhost:3000/admin/login (admin login page)
- [ ] Login with admin credentials (redirects to /admin dashboard)
- [ ] Visit http://localhost:3000/login (customer login page)
- [ ] Run `scripts/create-test-customer.sql` (creates test customer)
- [ ] Login as customer (redirects to /portal)
- [ ] Verify role-based access working

### ✅ Environment Variables Check
Verify `.env.local` contains:
- [ ] `NEXT_PUBLIC_SUPABASE_URL` (already set)
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` (already set)
- [ ] `SUPABASE_SERVICE_ROLE_KEY` (already set)

### ✅ Code Quality
- [ ] `npm run typecheck` (TypeScript validation)
- [ ] `npm run lint` (ESLint checks)
- [ ] `npm run build` (production build test)
- [ ] Fix any errors if present

## 🚀 Deployment to Vercel

### Step 1: Install Vercel CLI
```bash
npm i -g vercel
```

### Step 2: Login to Vercel
```bash
vercel login
```

### Step 3: Deploy
```bash
cd ~/model-muse-studio
vercel
```

Answer prompts:
- **Set up and deploy?** Y
- **Which scope?** Select your account
- **Link to existing project?** N
- **Project name?** model-muse-studio
- **Which directory?** ./ (current directory)
- **Override settings?** N

### Step 4: Set Environment Variables in Vercel

1. Go to https://vercel.com/dashboard
2. Select `model-muse-studio` project
3. Click **Settings** > **Environment Variables**
4. Add these variables (for Production, Preview, and Development):

```
NEXT_PUBLIC_SUPABASE_URL = https://jotarlqbmtywbyhgslbe.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpvdGFybHFibXR5d2J5aGdzbGJlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAzNTE0NzUsImV4cCI6MjA3NTkyNzQ3NX0.wcjEml922seGb3e72Dwas8zC_-87nBgdlLczaeTfBiU
SUPABASE_SERVICE_ROLE_KEY = [your-service-role-key-from-.env.local]
```

### Step 5: Deploy to Production
```bash
vercel --prod
```

### Step 6: Verify Deployment
- [ ] Visit your Vercel URL (e.g., https://model-muse-studio.vercel.app)
- [ ] Test homepage loads
- [ ] Test admin login
- [ ] Test customer login
- [ ] Verify role-based access working in production

## 📸 Content Setup

### Upload Hero Image
- [ ] Add hero image to `public/images/hero-image.jpg`
- [ ] Recommended size: 1920x1080px or larger
- [ ] Format: JPG or WebP
- [ ] Compress for web (< 500KB)

### Upload Logo/Branding
- [ ] Update logo text in `components/shared/Header.tsx`
- [ ] Update logo text in `components/shared/Footer.tsx`
- [ ] Add favicon to `public/` directory

## 👥 User Setup

### Create Real Admin Account
- [ ] Run `scripts/create-admin.sql` with your real email
- [ ] Save credentials in password manager
- [ ] Test login on production site

### Create Test Customer
- [ ] Run `scripts/create-test-customer.sql`
- [ ] Or create customer via Supabase SQL Editor
- [ ] Test customer login

### Upload Sample Photos
1. [ ] Go to Supabase Storage > photos bucket
2. [ ] Upload test images
3. [ ] Create gallery for test customer:
```sql
INSERT INTO public.galleries (
  customer_id,
  gallery_name,
  description,
  is_active
)
SELECT id, 'Sample Gallery', 'Test gallery', TRUE
FROM public.users
WHERE email = 'customer@example.com';
```
4. [ ] Assign photos to gallery (get gallery_id from query above)

## 🔒 Security Verification

### RLS Policy Check
- [ ] Login as customer
- [ ] Verify can only see own galleries
- [ ] Try accessing another customer's gallery ID (should fail)
- [ ] Verify can add/remove favorites
- [ ] Verify cannot access admin routes

### Admin Access Check
- [ ] Login as admin
- [ ] Verify can see all customers
- [ ] Verify can see all galleries
- [ ] Verify can access admin dashboard
- [ ] Verify cannot access customer portal routes directly

### Route Protection
- [ ] Try visiting /admin without login (should redirect to /admin/login)
- [ ] Try visiting /portal without login (should redirect to /login)
- [ ] Try visiting /admin as customer (should redirect)
- [ ] Try visiting /portal as admin (should redirect)

## 📊 Post-Deployment Tasks

### Monitor Performance
- [ ] Check Vercel Analytics dashboard
- [ ] Monitor Supabase database usage
- [ ] Check Supabase storage usage
- [ ] Review error logs

### SEO Setup (Optional)
- [ ] Add sitemap.xml
- [ ] Add robots.txt
- [ ] Configure Open Graph images
- [ ] Add Google Analytics

### Custom Domain (Optional)
- [ ] Purchase domain name
- [ ] Add domain in Vercel dashboard
- [ ] Configure DNS records
- [ ] Enable SSL (automatic with Vercel)

## 🐛 Common Issues & Solutions

### Issue: Admin/Customer can't log in
**Solution:**
- Verify user exists in `auth.users` table
- Check `raw_user_meta_data` contains correct `role` field
- Verify password is correct (reset if needed)
- Check browser console for error messages

### Issue: Customer can't see galleries
**Solution:**
- Verify gallery `customer_id` matches user ID
- Check `is_active = true` on gallery
- Verify photos have correct `gallery_id`
- Check RLS policies are enabled

### Issue: Photos not loading
**Solution:**
- Verify storage bucket exists and is named `photos`
- Check photo URLs in database match storage URLs
- Verify storage policies allow access
- Check signed URL generation

### Issue: Build fails on Vercel
**Solution:**
- Run `npm run build` locally to see errors
- Check TypeScript errors: `npm run typecheck`
- Verify all environment variables are set in Vercel
- Check Next.js version compatibility

## ✅ Final Verification

### Functionality Checklist
- [ ] Homepage loads with all sections
- [ ] Admin can log in at /admin/login
- [ ] Customer can log in at /login
- [ ] Admin dashboard shows stats and lists
- [ ] Customer portal shows assigned galleries
- [ ] Photos display in galleries
- [ ] Favorites can be added/removed
- [ ] Sign out works for both roles
- [ ] Mobile responsive design works
- [ ] All images load correctly

### Performance Checklist
- [ ] Lighthouse score > 90 (Performance)
- [ ] Lighthouse score > 90 (Accessibility)
- [ ] Lighthouse score > 90 (Best Practices)
- [ ] Lighthouse score > 90 (SEO)
- [ ] Images optimized (Next.js Image component)
- [ ] Fonts loaded efficiently

### Security Checklist
- [ ] HTTPS enabled (automatic on Vercel)
- [ ] RLS policies tested and working
- [ ] No sensitive data in client-side code
- [ ] Environment variables secured
- [ ] No .env.local in git repository

## 🎉 Launch Day!

Once all checklist items are complete:

1. [ ] Announce launch to stakeholders
2. [ ] Share admin credentials with photographer
3. [ ] Create customer accounts for first clients
4. [ ] Upload first galleries
5. [ ] Send customer login credentials
6. [ ] Monitor for issues
7. [ ] Celebrate! 🎉

## 📞 Support Resources

- **README.md** - Full documentation
- **SETUP-GUIDE.md** - Step-by-step setup
- **PROJECT-SUMMARY.md** - Project overview
- **Vercel Docs** - https://vercel.com/docs
- **Supabase Docs** - https://supabase.com/docs
- **Next.js Docs** - https://nextjs.org/docs

---

**Deployment prepared by Claude-Flow hivemind**
**Built with Next.js 14, Supabase, and Tailwind CSS**
