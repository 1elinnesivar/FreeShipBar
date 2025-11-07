'use client'

import { useEffect } from 'react'

export default function BlogContent({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Tüm h2 ve h3 başlıklarına ID ekle ve anchor link ekle
    const blogContent = document.querySelector('.blog-content')
    if (!blogContent) return

    const headings = blogContent.querySelectorAll('h2, h3')
    
    headings.forEach((heading) => {
      if (!heading.id) {
        // Başlık metninden slug oluştur
        const text = heading.textContent || ''
        const id = text
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '')
        
        heading.id = id
        
        // Başlığa anchor link ekle
        const anchor = document.createElement('a')
        anchor.href = `#${id}`
        anchor.className = 'blog-heading-anchor'
        anchor.setAttribute('aria-hidden', 'true')
        anchor.innerHTML = '#'
        
        const headingElement = heading as HTMLElement
        headingElement.insertBefore(anchor, headingElement.firstChild)
      }
    })
  }, [])

  return <>{children}</>
}

