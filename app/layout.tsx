import type { Metadata } from 'next'
import './globals.css'
import ThemeProviderWrapper from '@/components/ThemeProviderWrapper'

export const metadata: Metadata = {
  title: 'Freeshipbar',
  description: 'Gumroad free shipping bar',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProviderWrapper>{children}</ThemeProviderWrapper>
      </body>
    </html>
  )
}

