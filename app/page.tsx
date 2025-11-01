'use client'

import { useState } from 'react'
import CodeBuilder from '@/components/CodeBuilder'
import Features from '@/components/Features'
import Hero from '@/components/Hero'
import Themes from '@/components/Themes'
import FAQ from '@/components/FAQ'

export default function Home() {
  return (
    <main>
      <Hero />
      <Features />
      <Themes />
      <CodeBuilder />
      <FAQ />
    </main>
  )
}
