'use client'

import CodeBuilder from '@/components/CodeBuilder'
import Features from '@/components/Features'
import Hero from '@/components/Hero'
import Themes from '@/components/Themes'
import FAQ from '@/components/FAQ'
import SocialProof from '@/components/SocialProof'
import HowItWorks from '@/components/HowItWorks'

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
    </main>
  )
}
