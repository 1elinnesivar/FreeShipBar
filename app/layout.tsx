import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'
import ThemeProviderWrapper from '@/components/ThemeProviderWrapper'

export const metadata: Metadata = {
  title: 'Free Shipping Bar for Online Stores – Boost Average Order Value',
  description: 'Add a smart free shipping progress bar to your online store with a single script tag. Show customers how close they are to free shipping, increase average order value, and unlock full customization with a one-time Pro license.',
  keywords: ['free shipping bar', 'shipping progress bar', 'ecommerce', 'average order value', 'conversion optimization', 'online store'],
  authors: [{ name: 'FreeShipBar' }],
  verification: {
    google: 'HA9wb8Vf-Cw9VlibQnz66KDaJ1B4Lqmtwb26of1P68A',
  },
  openGraph: {
    title: 'Free Shipping Bar for Online Stores – Boost Average Order Value',
    description: 'Add a smart free shipping progress bar to your online store with a single script tag. Show customers how close they are to free shipping, increase average order value, and unlock full customization with a one-time Pro license.',
    type: 'website',
    url: 'https://freeshipbar.vercel.app',
    siteName: 'FreeShipBar',
    images: [
      {
        url: '/FreeShipBar-badge.png',
        width: 1200,
        height: 630,
        alt: 'FreeShipBar - Free Shipping Progress Bar',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Shipping Bar for Online Stores – Boost Average Order Value',
    description: 'Add a smart free shipping progress bar to your online store with a single script tag.',
    images: ['/FreeShipBar-badge.png'],
  },
  metadataBase: new URL('https://freeshipbar.vercel.app'),
  alternates: {
    canonical: 'https://freeshipbar.vercel.app',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const baseUrl = 'https://freeshipbar.vercel.app'

  const softwareApplicationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'FreeShipBar',
    applicationCategory: 'BusinessApplication',
    description: 'Add a smart free shipping progress bar to your online store with a single script tag. Show customers how close they are to free shipping, increase average order value, and unlock full customization with a one-time Pro license.',
    operatingSystem: 'All',
    offers: {
      '@type': 'Offer',
      priceCurrency: 'USD',
      price: 'TBD',
    },
    url: baseUrl,
  }

  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'FreeShipBar',
    url: baseUrl,
    logo: `${baseUrl}/FreeShipBar-badge.png`,
    description: 'Free shipping progress bar tool for online stores. Increase average order value with a lightweight, customizable free shipping bar.',
    sameAs: [],
  }

  return (
    <html lang="en">
      <body>
        {/* Google tag (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-SMK4FPXNKY"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-SMK4FPXNKY');
          `}
        </Script>
        <Script
          id="software-application-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplicationJsonLd) }}
          strategy="beforeInteractive"
        />
        <Script
          id="organization-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
          strategy="beforeInteractive"
        />
        <ThemeProviderWrapper>{children}</ThemeProviderWrapper>
      </body>
    </html>
  )
}

