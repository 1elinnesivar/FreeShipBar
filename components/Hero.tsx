'use client'

import { useTheme } from '@/contexts/ThemeContext'
import Image from 'next/image'
import ThemeToggle from './ThemeToggle'
import { trackEvent } from '@/src/lib/analytics'

export default function Hero() {
  const { theme } = useTheme()

  const handleTryFreeClick = () => {
    trackEvent('hero_try_free_click')
    const builderSection = document.getElementById('builder')
    if (builderSection) {
      builderSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleGumroadClick = () => {
    trackEvent('hero_gumroad_click')
  }

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
        <div className="hero-content">
          <div className="hero-text">
            <div className="hero-logo">
              <Image
                src={theme === 'dark' ? '/FreeShipBar-logo-light.svg' : '/FreeShipBar-logo-dark.svg'}
                alt="FreeShipBar Logo"
                width={200}
                height={60}
                priority
              />
            </div>
            <h1>Free Shipping Bar for Online Stores</h1>
            <p className="subtitle">
              Show shoppers how close they are to free shipping, boost average order value, and install it on your site with a single script tag. Free mode included, Pro is a one-time license.
            </p>
            <div className="value-bullets">
              <div className="value-bullet">
                <span className="bullet-icon">✓</span>
                <span>Works with any website or platform</span>
              </div>
              <div className="value-bullet">
                <span className="bullet-icon">✓</span>
                <span>Free mode with watermark</span>
              </div>
              <div className="value-bullet">
                <span className="bullet-icon">✓</span>
                <span>One-time Pro license, no subscription</span>
              </div>
            </div>
            <div className="hero-cta">
              <button onClick={handleTryFreeClick} className="cta-primary">
                Try Free on Your Store
              </button>
              <a
                href="https://zekayiozdemir.gumroad.com/l/freeshipbar-pro"
                target="_blank"
                rel="noopener noreferrer"
                className="cta-secondary"
                onClick={handleGumroadClick}
              >
                Get Lifetime Pro on Gumroad
              </a>
            </div>
          </div>
          <div className="hero-preview">
            <a
              href="/freeshipbar_ph.gif"
              target="_blank"
              rel="noopener noreferrer"
              className="preview-gif-link"
            >
              <Image
                src="/freeshipbar_ph.gif"
                alt="Free Shipping Bar Preview"
                width={800}
                height={600}
                unoptimized
                priority
              />
              <p className="preview-caption">Watch the free shipping bar update as the cart grows.</p>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
