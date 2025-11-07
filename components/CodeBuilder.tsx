'use client'

import { useState, useEffect, useRef } from 'react'
import { trackEvent } from '@/src/lib/analytics'

export default function CodeBuilder() {
  const [threshold, setThreshold] = useState<number>(750)
  const [currency, setCurrency] = useState<'TRY' | 'EUR' | 'USD'>('USD')
  const [locale, setLocale] = useState<'tr' | 'en'>('en')
  const [domain, setDomain] = useState<string>('')
  const [isClient, setIsClient] = useState(false)
  const [bgColor, setBgColor] = useState('#111827')
  const [fgColor, setFgColor] = useState('#ffffff')
  const [barColor, setBarColor] = useState('#10b981')
  const [position, setPosition] = useState<'top' | 'bottom'>('top')
  const [sticky, setSticky] = useState(true)
  const [theme, setTheme] = useState<'minimal' | 'gradient' | 'glass' | 'stripe'>('minimal')
  const [mode, setMode] = useState<'bar' | 'announce'>('bar')
  const [license, setLicense] = useState('')
  const [cartTotal, setCartTotal] = useState<number>(350)
  const [copied, setCopied] = useState(false)
  const previewContainerRef = useRef<HTMLDivElement>(null)

  // Demo bar'ı oluştur
  useEffect(() => {
    if (!previewContainerRef.current) return

    // Önceki script ve bar'ı temizle
    const existingBar = document.getElementById('freeshipbar-demo')
    if (existingBar) {
      existingBar.remove()
    }
    const existingScript = previewContainerRef.current.querySelector('script')
    if (existingScript) {
      existingScript.remove()
    }

    // Body padding'i sıfırla (sticky için)
    if (sticky) {
      if (position === 'top') {
        document.body.style.paddingTop = '0'
      } else {
        document.body.style.paddingBottom = '0'
      }
    }

    // Yeni script oluştur
    const script = document.createElement('script')
    script.src = '/embed.js'
    script.setAttribute('data-threshold', threshold.toString())
    script.setAttribute('data-total', cartTotal.toString())
    script.setAttribute('data-currency', currency)
    script.setAttribute('data-locale', locale)
    script.setAttribute('data-position', position)
    script.setAttribute('data-sticky', sticky.toString())
    script.setAttribute('data-theme', theme)
    script.setAttribute('data-mode', mode)
    script.setAttribute('data-colors', JSON.stringify({ bg: bgColor, fg: fgColor, bar: barColor }))
    if (license) {
      script.setAttribute('data-license', license)
    }

    // Demo için özel ID ekle ve preview container içine taşı
    script.addEventListener('load', () => {
      setTimeout(() => {
        const bar = document.getElementById('freeshipbar')
        if (bar && previewContainerRef.current) {
          bar.id = 'freeshipbar-demo'
          // Preview container içinde göstermek için position'ı relative yap
          bar.style.position = 'relative'
          if (position === 'top') {
            bar.style.top = '0'
            bar.style.marginBottom = '1rem'
          } else {
            bar.style.bottom = '0'
            bar.style.marginTop = '1rem'
          }
          // Preview container içine taşı (içeriğin üstüne veya altına)
          if (position === 'top') {
            previewContainerRef.current.insertBefore(bar, previewContainerRef.current.firstChild)
          } else {
            previewContainerRef.current.appendChild(bar)
          }
        }
      }, 100)
    })

    previewContainerRef.current.appendChild(script)

    return () => {
      const bar = document.getElementById('freeshipbar-demo')
      if (bar) {
        bar.remove()
      }
      if (sticky) {
        document.body.style.paddingTop = ''
        document.body.style.paddingBottom = ''
      }
    }
  }, [threshold, cartTotal, currency, locale, position, sticky, theme, mode, bgColor, fgColor, barColor, license])

  // Get domain only on client-side to avoid hydration mismatch
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setDomain(window.location.origin)
      setIsClient(true)
    }
  }, [])

  const generateScript = () => {
    const currentDomain = domain || 'https://yourdomain.com'
    const colors = JSON.stringify({ bg: bgColor, fg: fgColor, bar: barColor })
    
    const attributes = [
      `src="${currentDomain}/embed.js"`,
      `data-threshold="${threshold}"`,
      `data-total="${cartTotal}"`,
      `data-currency="${currency}"`,
      `data-locale="${locale}"`,
      `data-theme="${theme}"`,
      `data-position="${position}"`,
      `data-sticky="${sticky}"`,
      `data-mode="${mode}"`,
      `data-colors="${colors.replace(/"/g, '&quot;')}"`,
    ]

    if (license) {
      attributes.push(`data-license="${license}"`)
    }

    return `<script ${attributes.join('\n  ')}>\n</script>`
  }

  const copyToClipboard = async () => {
    try {
      const script = generateScript()
      await navigator.clipboard.writeText(script)
      setCopied(true)
      trackEvent('copy_code_click')
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <section id="builder" className="code-builder">
      <div className="container">
        <h2>Generate Code</h2>
        <div className="free-pro-cards">
          <div className="mode-card free-mode">
            <h3>Free Mode</h3>
            <ul>
              <li>Watermark + single theme</li>
              <li>Always sticky at the top</li>
            </ul>
          </div>
          <div className="mode-card pro-mode">
            <h3>Pro Mode</h3>
            <ul>
              <li>No watermark + all themes</li>
              <li>Colors + positions + announce mode</li>
            </ul>
          </div>
        </div>
        <div className="builder-grid">
          <div className="builder-form">
            <div className="form-group">
              <label htmlFor="threshold">Threshold (Free Shipping Amount)</label>
              <input
                id="threshold"
                type="number"
                value={threshold}
                onChange={(e) => setThreshold(Number(e.target.value))}
                min="0"
              />
            </div>

            <div className="form-group">
              <label htmlFor="currency">Currency</label>
              <select
                id="currency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value as 'TRY' | 'EUR' | 'USD')}
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="TRY">TRY</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="locale">Language</label>
              <select
                id="locale"
                value={locale}
                onChange={(e) => setLocale(e.target.value as 'tr' | 'en')}
              >
                <option value="en">English</option>
                <option value="tr">Türkçe</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="theme">Theme (Pro)</label>
              <select
                id="theme"
                value={theme}
                onChange={(e) => setTheme(e.target.value as 'minimal' | 'gradient' | 'glass' | 'stripe')}
                disabled={!license}
              >
                <option value="minimal">Minimal</option>
                <option value="gradient">Gradient</option>
                <option value="glass">Glass</option>
                <option value="stripe">Stripe</option>
              </select>
              {!license && <span className="pro-badge">Pro license required</span>}
            </div>

            <div style={{opacity: license ? 1 : 0.6}}>
              <div className="form-group">
                <label>Colors (Pro)</label>
                {!license && <span className="pro-badge">Pro license required</span>}
                <div className="color-inputs">
                  <div className="color-input-group">
                    <label htmlFor="bgColor">Background</label>
                    <input
                      id="bgColor"
                      type="color"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      disabled={!license}
                    />
                    <input
                      type="text"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="color-text"
                      disabled={!license}
                    />
                  </div>
                  <div className="color-input-group">
                    <label htmlFor="fgColor">Text</label>
                    <input
                      id="fgColor"
                      type="color"
                      value={fgColor}
                      onChange={(e) => setFgColor(e.target.value)}
                      disabled={!license}
                    />
                    <input
                      type="text"
                      value={fgColor}
                      onChange={(e) => setFgColor(e.target.value)}
                      className="color-text"
                      disabled={!license}
                    />
                  </div>
                  <div className="color-input-group">
                    <label htmlFor="barColor">Progress Bar</label>
                    <input
                      id="barColor"
                      type="color"
                      value={barColor}
                      onChange={(e) => setBarColor(e.target.value)}
                      disabled={!license}
                    />
                    <input
                      type="text"
                      value={barColor}
                      onChange={(e) => setBarColor(e.target.value)}
                      className="color-text"
                      disabled={!license}
                    />
                  </div>
              </div>
            </div>
            </div>

            <div className="form-group">
              <label htmlFor="position">Position (Pro)</label>
              <select
                id="position"
                value={position}
                onChange={(e) => setPosition(e.target.value as 'top' | 'bottom')}
                disabled={!license}
              >
                <option value="top">Top</option>
                <option value="bottom">Bottom</option>
              </select>
              {!license && <span className="pro-badge">Free mode: Top only</span>}
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={sticky}
                  onChange={(e) => setSticky(e.target.checked)}
                  disabled={!license}
                />
                <span>Sticky (Fixed position) {!license && <span className="pro-badge-inline">(Free: Always sticky)</span>}</span>
              </label>
            </div>

            <div className="form-group">
              <label htmlFor="mode">Mode (Pro)</label>
              <select
                id="mode"
                value={mode}
                onChange={(e) => setMode(e.target.value as 'bar' | 'announce')}
                disabled={!license}
              >
                <option value="bar">Bar</option>
                <option value="announce">Announce</option>
              </select>
              {!license && <span className="pro-badge">Free mode: Bar only</span>}
            </div>

            <div className="form-group">
              <label htmlFor="license">License (Optional)</label>
              <input
                id="license"
                type="text"
                value={license}
                onChange={(e) => setLicense(e.target.value)}
                placeholder="XXXX-XXXX-XXXX"
              />
            </div>

            <div className="form-group">
              <label htmlFor="cartTotal">Cart Total (Test)</label>
              <input
                id="cartTotal"
                type="number"
                value={cartTotal}
                onChange={(e) => setCartTotal(Number(e.target.value))}
                min="0"
              />
              <small className="helper-text">This doesn&apos;t affect your real store – it&apos;s just a preview for you.</small>
            </div>

            <button onClick={copyToClipboard} className="copy-button">
              {copied ? '✓ Copied!' : 'Copy embed code'}
            </button>
          </div>

          <div className="builder-preview">
            <h3>Live Preview</h3>
            <p className="preview-description">
              Try different cart totals to see how the progress bar updates in real time.
            </p>
            <div className="preview-container" ref={previewContainerRef}>
              <div className="preview-content">
                <h4>Sample E-commerce Page</h4>
                <div className="preview-products">
                  <div className="preview-product">
                    <span>Product 1</span>
                    <span>$100</span>
                  </div>
                  <div className="preview-product">
                    <span>Product 2</span>
                    <span>$150</span>
                  </div>
                  <div className="preview-product">
                    <span>Product 3</span>
                    <span>$100</span>
                  </div>
                </div>
                <div className="preview-cart-info">
                  <strong>Cart Total: {cartTotal} {currency}</strong>
                  {cartTotal < threshold && (
                    <p className="preview-remaining">
                      Add {threshold - cartTotal} {currency} more for free shipping
                    </p>
                  )}
                  {cartTotal >= threshold && (
                    <p className="preview-success">
                      ✓ You earned free shipping!
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="code-output">
              <h4>Generated Code:</h4>
              <button 
                onClick={copyToClipboard} 
                className="copy-code-button"
                style={{
                  marginBottom: '1rem',
                  padding: '0.5rem 1rem',
                  background: '#667eea',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                }}
              >
                {copied ? '✓ Copied!' : 'Copy embed code'}
              </button>
              <pre className="code-block">
                <code>{isClient ? generateScript() : 'Loading...'}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

