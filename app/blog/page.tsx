import { Metadata } from 'next'
import Link from 'next/link'
import ThemeToggle from '@/components/ThemeToggle'

const blogPosts = [
  {
    slug: 'best-free-shipping-bar-tools-small-online-stores',
    title: '5 Best Free Shipping Bar Solutions for Small Online Stores (2025 Guide)',
    description: 'Discover the best free shipping bar tools for small online stores. Compare simple script-based solutions like FreeShipBar with app-based and theme-based options to increase your average order value.',
    date: '2025-01-15',
  },
  {
    slug: 'how-free-shipping-progress-bar-increases-average-order-value',
    title: 'How a Free Shipping Progress Bar Can Increase Your Average Order Value',
    description: 'Learn how a free shipping progress bar nudges shoppers to add one more item, increases average order value, and improves your ecommerce conversion rate without aggressive discounts.',
    date: '2025-01-10',
  },
  {
    slug: 'show-free-shipping-threshold-without-heavy-apps',
    title: 'How to Show a Free Shipping Threshold on Your Store Without Heavy Apps',
    description: 'Want to show a free shipping threshold without installing heavy apps? Learn how to add a simple free shipping bar or progress message using scripts and lightweight tools like FreeShipBar.',
    date: '2025-01-05',
  },
]

export const metadata: Metadata = {
  title: 'Blog - FreeShipBar',
  description: 'Learn about free shipping bars, average order value optimization, and ecommerce conversion tips.',
  alternates: {
    canonical: 'https://freeshipbar.vercel.app/blog',
  },
  openGraph: {
    title: 'Blog - FreeShipBar',
    description: 'Learn about free shipping bars, average order value optimization, and ecommerce conversion tips.',
    type: 'website',
    url: 'https://freeshipbar.vercel.app/blog',
    images: [
      {
        url: '/FreeShipBar-badge.png',
        width: 1200,
        height: 630,
        alt: 'FreeShipBar Blog',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog - FreeShipBar',
    description: 'Learn about free shipping bars, average order value optimization, and ecommerce conversion tips.',
    images: ['/FreeShipBar-badge.png'],
  },
}

export default function BlogPage() {
  return (
    <main className="blog-list-page">
      <div className="blog-header">
        <div className="container">
          <div className="blog-nav">
            <div className="blog-nav-links">
              <Link href="/" className="blog-home-link">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
                Home
              </Link>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </div>
      <div className="container">
        <h1>Blog</h1>
        <p className="blog-list-intro">
          Tips, guides, and insights on increasing average order value with free shipping bars.
        </p>
        <div className="blog-list">
          {blogPosts.map((post) => (
            <article key={post.slug} className="blog-list-item">
              <Link href={`/blog/${post.slug}`}>
                <h2>{post.title}</h2>
                <p className="blog-list-description">{post.description}</p>
                <time className="blog-date" dateTime={post.date}>
                  {new Date(post.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </main>
  )
}

