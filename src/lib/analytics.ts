// Analytics helper functions
// Gracefully degrades if no tracking service is configured

type AnalyticsEvent = 
  | 'hero_try_free_click'
  | 'hero_gumroad_click'
  | 'copy_code_click'

export function trackEvent(eventName: AnalyticsEvent, properties?: Record<string, any>) {
  // Plausible Analytics
  if (typeof window !== 'undefined' && (window as any).plausible) {
    (window as any).plausible(eventName, { props: properties })
    return
  }

  // Google Analytics 4
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', eventName, properties)
    return
  }

  // Fallback: console log in development
  if (process.env.NODE_ENV === 'development') {
    console.log('Analytics Event:', eventName, properties)
  }
}

