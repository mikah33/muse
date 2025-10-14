# Netlify Deployment Setup Guide

## Environment Variables Required

You need to add these environment variables to your Netlify site:

### 1. Go to Netlify Dashboard
- Visit: https://app.netlify.com/sites/scintillating-kangaroo-078f06/settings/deploys

### 2. Add Environment Variables

Navigate to: **Site settings** → **Environment variables** → **Add a variable**

Add these three variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://mbrrtlltuubdppfrvdiq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1icnJ0bGx0dXViZHBwZnJ2ZGlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAzNTE1NTIsImV4cCI6MjA3NTkyNzU1Mn0.EOTEBXA2ctYx86k-8xa2cSdSLWNLID78-Vgl8Togtvg
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1icnJ0bGx0dXViZHBwZnJ2ZGlxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDM1MTU1MiwiZXhwIjoyMDc1OTI3NTUyfQ.tRDNrX5GoJr7XPK1YHKyCs_LPu7RlXXPVIH7RUSA2tk
```

### 3. Redeploy

After adding the environment variables:
- Go to **Deploys** → **Trigger deploy** → **Deploy site**

Or wait for the next automatic deployment from GitHub.

---

## Quick Steps:

1. Open: https://app.netlify.com/sites/scintillating-kangaroo-078f06/settings/env
2. Click "Add a variable"
3. Add all three variables above
4. Click "Trigger deploy" to rebuild with the new environment variables

---

## What These Variables Do:

- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL (public)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Public anonymous key for client-side access
- `SUPABASE_SERVICE_ROLE_KEY` - Private key for admin operations (never expose to client)

⚠️ **Important**: The service role key should never be exposed to the client side. It's only used in server-side API routes.

---

## After Setup:

Once the environment variables are added and the site is redeployed:
- All pages will load correctly
- Authentication will work
- Database queries will succeed
- No more Supabase client errors

The site will be fully functional at: https://scintillating-kangaroo-078f06.netlify.app
