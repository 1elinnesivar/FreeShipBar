'use client'

import { useEffect, useRef, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

function PreviewContent() {
  const searchParams = useSearchParams()
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const script = document.createElement('script')
    const threshold = searchParams.get('threshold') || '750'
    const total = searchParams.get('total') || '0'
    const currency = searchParams.get('currency') || 'TRY'
    const locale = searchParams.get('locale') || 'tr'
    const position = searchParams.get('position') || 'top'
    const sticky = searchParams.get('sticky') || 'true'
    const bg = searchParams.get('bg') || '#111827'
    const fg = searchParams.get('fg') || '#ffffff'
    const bar = searchParams.get('bar') || '#10b981'
    const license = searchParams.get('license') || ''

    const colors = JSON.stringify({ bg, fg, bar })

    script.src = '/embed.js'
    script.setAttribute('data-threshold', threshold)
    script.setAttribute('data-total', total)
    script.setAttribute('data-currency', currency)
    script.setAttribute('data-locale', locale)
    script.setAttribute('data-position', position)
    script.setAttribute('data-sticky', sticky)
    script.setAttribute('data-colors', colors)
    if (license) {
      script.setAttribute('data-license', license)
    }

    if (containerRef.current) {
      containerRef.current.appendChild(script)
    }

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script)
      }
    }
  }, [searchParams])

  return (
    <div ref={containerRef} style={{ minHeight: '100vh', padding: '40px 20px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h2 style={{ marginBottom: '20px' }}>Örnek İçerik</h2>
        <p style={{ marginBottom: '20px' }}>
          Bu sayfa embed script&apos;in nasıl göründüğünü gösterir. Bar bu içeriğin üstünde veya altında görünecektir.
        </p>
        <div style={{ padding: '20px', backgroundColor: '#f3f4f6', borderRadius: '8px' }}>
          <h3>Ürün Listesi</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ padding: '10px', backgroundColor: 'white', marginBottom: '10px', borderRadius: '4px' }}>
              Ürün 1 - 100 TRY
            </li>
            <li style={{ padding: '10px', backgroundColor: 'white', marginBottom: '10px', borderRadius: '4px' }}>
              Ürün 2 - 150 TRY
            </li>
            <li style={{ padding: '10px', backgroundColor: 'white', marginBottom: '10px', borderRadius: '4px' }}>
              Ürün 3 - 100 TRY
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default function PreviewPage() {
  return (
    <Suspense fallback={<div>Yükleniyor...</div>}>
      <PreviewContent />
    </Suspense>
  )
}

