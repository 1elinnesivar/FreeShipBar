// Analytics helper functions
// Gracefully degrades if no tracking service is configured

type AnalyticsEvent = 
  | 'hero_try_free_click'
  | 'hero_gumroad_click'
  | 'copy_code_click'

export function trackEvent(eventName: AnalyticsEvent, properties?: Record<string, any>) {
  if (typeof window === 'undefined') return

  // Google Analytics 4 (gtag) - Primary
  if ((window as any).gtag) {
    (window as any).gtag('event', eventName, properties || {})
  }

  // Plausible Analytics - Secondary
  if ((window as any).plausible) {
    (window as any).plausible(eventName, { props: properties })
  }

  // Fallback: console log in development
  if (process.env.NODE_ENV === 'development') {
    console.log('Analytics Event:', eventName, properties)
  }
}

