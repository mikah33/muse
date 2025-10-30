import type { Metadata } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import './globals.css'
import SEOSchema from '@/components/shared/SEOSchema'
import GoogleAnalytics from '@/components/analytics/GoogleAnalytics'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const siteUrl = 'https://modelmusestudio.com'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Model Muse Studio | Professional Headshots & Photography Services',
    template: '%s | Model Muse Studio',
  },
  description: 'Professional headshots and photography services in Fayetteville, NC. Studio photography for actors, models, corporate teams, families, and creative portfolios. Book your session today.',
  icons: {
    icon: '/images/logo-black.png',
    shortcut: '/images/logo-black.png',
    apple: '/images/logo-black.png',
  },
  keywords: [
    'professional headshots',
    'photography services',
    'professional photography',
    'studio photography',
    'creative photography',
    'actor headshots',
    'modeling portfolio',
    'corporate headshots',
    'business photography',
    'team photography',
    'family photography',
    'pet photography',
    'real estate photography',
    'portrait photography',
    'professional photographer',
    'photography studio',
    'headshot photography',
    'portfolio photography',
    'commercial photography',
    'brand photography',
    'product photography',
    'lifestyle photography',
    'event photography',
    'senior photography',
    'graduation photography',
    'maternity photography',
    'newborn photography',
    'children photography',
    'food photography',
    'architectural photography',
    'interior photography',
    'fashion photography',
    'editorial photography',
    'beauty photography',
    'glamour photography',
    'boudoir photography',
    'sports photography',
    'action photography',
    'nature photography',
    'landscape photography',
    'fine art photography',
    'documentary photography',
    'photojournalism',
    'street photography',
    'aerial photography',
    'drone photography',
    'underwater photography',
    'macro photography',
    'night photography',
    'Fayetteville photographer',
    'North Carolina photography',
    'NC photography studio',
    'local photographer',
    'photography near me',
  ],
  authors: [{ name: 'Model Muse Studio' }],
  creator: 'Model Muse Studio',
  publisher: 'Model Muse Studio',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'Model Muse Studio',
    title: 'Professional Headshots & Photography Services | Model Muse Studio',
    description: 'Professional headshots and photography services in Fayetteville, NC. Studio photography for actors, models, corporate teams, families, and creative portfolios.',
    images: [
      {
        url: `${siteUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'Model Muse Studio - Professional Photography Services',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Professional Headshots & Photography Services | Model Muse Studio',
    description: 'Professional headshots and photography services in Fayetteville, NC. Studio photography for actors, models, corporate teams, families, and creative portfolios.',
    images: [`${siteUrl}/og-image.jpg`],
    creator: '@modelmusestudio',
    site: '@modelmusestudio',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'Z43Kx7R4Pc_O-uJ182hH7aE3ogr5w7DFwT0h6W2QIpA',
  },
  other: {
    'msvalidate.01': 'verification_token',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <head>
        <SEOSchema />
        <GoogleAnalytics />
      </head>
      <body className="font-sans antialiased bg-pure-white text-pure-black">
        {children}
      </body>
    </html>
  )
}
