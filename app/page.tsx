'use client'

import { lazy, Suspense } from 'react'
import CodeBuilder from '@/components/CodeBuilder'
import Features from '@/components/Features'
import Hero from '@/components/Hero'
import Themes from '@/components/Themes'
import FAQ from '@/components/FAQ'
import SocialProof from '@/components/SocialProof'
import HowItWorks from '@/components/HowItWorks'
import GifPreview from '@/components/GifPreview'

// Lazy load contact form for better performance
const ContactForm = lazy(() => import('@/components/ContactForm'))

export default function Home() {
  return (
    <main>
      <Hero />
      <SocialProof />
      <Features />
      <HowItWorks />
      <Themes />
      <CodeBuilder />
      <FAQ />
      <GifPreview />
      <Suspense fallback={null}>
        <ContactForm />
      </Suspense>
    </main>
  )
}
