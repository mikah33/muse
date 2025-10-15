'use client'

import Link from 'next/link'
import HeaderWrapper from '@/components/shared/HeaderWrapper'
import Footer from '@/components/shared/Footer'
import Hero from '@/components/shared/Hero'
import Services from '@/components/shared/Services'
import AboutSection from '@/components/shared/AboutSection'
import FAQ from '@/components/shared/FAQ'
import CTASection from '@/components/shared/CTASection'

export default function Home() {
  return (
    <>
      <HeaderWrapper />
      <main>
        <Hero />
        <AboutSection />
        <Services />
        <FAQ />
        <CTASection variant="dark" location="Fayetteville, NC" />
      </main>
      <Footer />
    </>
  )
}
