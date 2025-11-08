'use client'

import Image from 'next/image'

export default function GifPreview() {
  return (
    <section className="gif-preview-section">
      <div className="container">
        <a
          href="/freeshipbar_ph.gif"
          target="_blank"
          rel="noopener noreferrer"
          className="gif-preview-link"
        >
          <Image
            src="/freeshipbar_ph.gif"
            alt="Free Shipping Bar Preview"
            width={800}
            height={600}
            unoptimized
            priority
          />
          <p className="gif-preview-caption">Watch the free shipping bar update as the cart grows.</p>
        </a>
      </div>
    </section>
  )
}

