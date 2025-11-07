import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://freeshipbar.vercel.app'

  const blogPosts = [
    'best-free-shipping-bar-tools-small-online-stores',
    'how-free-shipping-progress-bar-increases-average-order-value',
    'show-free-shipping-threshold-without-heavy-apps',
  ]

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/preview`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...blogPosts.map((slug) => ({
      url: `${baseUrl}/blog/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ]
}

