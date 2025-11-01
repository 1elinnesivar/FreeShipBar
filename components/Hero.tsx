'use client'

import { useTheme } from '@/contexts/ThemeContext'
import Image from 'next/image'
import ThemeToggle from './ThemeToggle'

export default function Hero() {
  const { theme } = useTheme()

  return (
    <section className="hero">
      <div className="container">
        <div className="hero-header">
          <ThemeToggle />
          <div className="badge-container">
            <Image
              src="/FreeShipBar-badge.svg"
              alt="FreeShipBar Badge"
              width={32}
              height={32}
              priority
            />
          </div>
        </div>
        <div className="hero-logo">
          <Image
            src={theme === 'dark' ? '/FreeShipBar-logo-light.svg' : '/FreeShipBar-logo-dark.svg'}
            alt="FreeShipBar Logo"
            width={200}
            height={60}
            priority
          />
        </div>
        <h1>Free Shipping Bar</h1>
        <p className="subtitle">
          Show free shipping threshold with a single line of code. Try it free, unlock unlimited customization with Pro (one-time).
        </p>
        <div className="pricing-note">
          <p>One-time license, no subscription.</p>
        </div>
        <a
          href="https://zekayiozdemir.gumroad.com/l/freeshipbar-pro"
          target="_blank"
          rel="noopener noreferrer"
          className="buy-button"
        >
          Buy on Gumroad
        </a>
      </div>
    </section>
  )
}
