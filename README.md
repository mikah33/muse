# Model Muse Studio - Photography Studio Website

A sophisticated photography studio website built with Next.js 14+, Supabase, and Tailwind CSS featuring dual login systems, role-based access control, and elegant black & white design.

## 🎯 Features

### Dual Login Systems
- **Admin Login** (`/admin/login`) - For photographers to manage customers and galleries
- **Customer Login** (`/login`) - For clients to view their assigned photo galleries
- Separate session management and middleware protection
- Role-based route guards with automatic redirects

### Admin Dashboard (`/admin`)
- Customer account creation and management
- Bulk photo upload with drag-and-drop
- "Unassigned Photos" pool management
- Gallery creation and photo assignment to customers
- Drag-and-drop photo organization between galleries
- Activity logging and analytics

### Customer Portal (`/portal`)
- View ONLY assigned galleries (enforced by Supabase RLS)
- Photo grid with lightbox viewing
- Favorite/unfavorite functionality
- Personal favorites collection page
- Clean, elegant interface matching design system

### Security Features
- Complete Supabase Row Level Security (RLS) policies
- Role-based middleware protection
- Signed URLs for photo access
- Session management per role
- Customer data isolation

### Design System
- Monochromatic color palette (black, white, grays)
- Playfair Display serif font for headings
- Inter sans-serif for body text
- Generous white space and typography
- Subtle animations (Ken Burns, fade-in-up, scale-x)
- Transparent header that turns white on scroll

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Supabase account
- Git

### Installation

1. **Clone the repository**
```bash
cd ~/model-muse-studio
npm install
```

2. **Set up Supabase**

The project is already configured with:
- Project ID: `jotarlqbmtywbyhgslbe`
- Public Key and Service Role Key in `.env.local`

3. **Run the database migrations**
```bash
# Apply the schema to your Supabase project
# Go to Supabase Dashboard > SQL Editor
# Copy and paste the contents of supabase/schema.sql
# Run the SQL script
```

4. **Create an admin user**
```sql
-- In Supabase SQL Editor
INSERT INTO auth.users (email, encrypted_password, email_confirmed_at, raw_user_meta_data)
VALUES (
  'admin@modelmusestudio.com',
  crypt('your-secure-password', gen_salt('bf')),
  NOW(),
  '{"role": "admin", "full_name": "Admin User"}'::jsonb
);
```

5. **Start the development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## 📁 Project Structure

```
model-muse-studio/
├── app/
│   ├── admin/                 # Admin routes
│   │   ├── login/             # Admin login page
│   │   └── page.tsx           # Admin dashboard
│   ├── portal/                # Customer routes
│   │   └── page.tsx           # Customer portal
│   ├── login/                 # Customer login page
│   ├── layout.tsx             # Root layout with fonts
│   ├── page.tsx               # Homepage
│   └── globals.css            # Global styles
├── components/
│   ├── admin/                 # Admin components
│   │   ├── AdminDashboard.tsx
│   │   └── AdminLoginForm.tsx
│   ├── customer/              # Customer components
│   │   ├── CustomerPortal.tsx
│   │   └── CustomerLoginForm.tsx
│   └── shared/                # Shared components
│       ├── Header.tsx
│       ├── Footer.tsx
│       ├── Hero.tsx
│       └── Services.tsx
├── lib/
│   ├── auth/
│   │   └── auth-helpers.ts    # Authentication utilities
│   └── supabase/
│       ├── client.ts          # Client-side Supabase
│       ├── server.ts          # Server-side Supabase
│       └── middleware.ts      # Auth middleware
├── types/
│   └── database.ts            # TypeScript types
├── supabase/
│   └── schema.sql             # Database schema with RLS
├── middleware.ts              # Next.js middleware
└── package.json
```

## 🗄️ Database Schema

### Tables
- `users` - User accounts with role-based access (admin/customer)
- `customer_profiles` - Extended customer information
- `galleries` - Photo galleries assigned to customers
- `photos` - Individual photos in galleries
- `favorites` - Customer favorite photos
- `activity_logs` - Admin activity tracking

### Security
All tables have Row Level Security (RLS) enabled with policies that ensure:
- Admins have full access to all data
- Customers can only see their assigned galleries and photos
- Customers can manage their own favorites
- All operations are logged for accountability

## 🔐 Authentication Flow

### Admin Login
1. Admin visits `/admin/login`
2. Enters credentials
3. System verifies role = 'admin'
4. Redirects to `/admin` dashboard
5. Middleware protects all `/admin/*` routes

### Customer Login
1. Customer visits `/login`
2. Enters credentials
3. System verifies role = 'customer'
4. Redirects to `/portal`
5. Middleware protects all `/portal/*` routes

## 🎨 Design Tokens

### Colors
```css
--pure-black: #000000
--soft-black: #0A0A0A
--charcoal: #1A1A1A
--dark-gray: #2D2D2D
--medium-gray: #666666
--light-gray: #999999
--pale-gray: #CCCCCC
--off-white: #F5F5F5
--pure-white: #FFFFFF
```

### Typography
- Headings: Playfair Display (serif)
- Body: Inter (sans-serif)
- Letter spacing: 0.1em - 0.2em for uppercase text

### Animations
- Ken Burns effect on hero images (20s)
- Fade-in-up on content reveals (0.8s)
- Scale-X for active indicators (0.3s)

## 📦 Deployment

### Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Environment Variables
Ensure these are set in your Vercel project:
```
NEXT_PUBLIC_SUPABASE_URL=https://jotarlqbmtywbyhgslbe.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## 🛠️ Development

### Scripts
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run start      # Start production server
npm run lint       # Run ESLint
npm run typecheck  # Run TypeScript checks
```

### Adding Features
1. Create new components in `components/`
2. Add routes in `app/`
3. Update database schema in `supabase/schema.sql`
4. Add types in `types/database.ts`

## 🔒 Security Best Practices

1. **Never commit `.env.local`** - It's in `.gitignore`
2. **Use service role key carefully** - Only for server-side operations
3. **Always validate user roles** - Use middleware and auth helpers
4. **Test RLS policies** - Ensure customers can't access others' data
5. **Use signed URLs** - For photo storage access

## 📝 TODO for Production

- [ ] Add image optimization and CDN
- [ ] Implement email notifications
- [ ] Add photo download functionality
- [ ] Create admin photo upload UI with drag-and-drop
- [ ] Add gallery sharing links
- [ ] Implement customer password reset
- [ ] Add admin analytics dashboard
- [ ] Create mobile apps (iOS/Android)
- [ ] Add watermarking for preview photos
- [ ] Implement photo selection/package system

## 📄 License

Private - Model Muse Studio

## 🤝 Support

For support, email admin@modelmusestudio.com

---

Built with ❤️ using Next.js, Supabase, and Tailwind CSS
