export default function Features() {
  const features = [
    {
      title: 'Easy integration',
      description: 'Add one script tag to your head and FreeShipBar starts working immediately. No theme edits or backend setup required.',
      icon: '⚡',
    },
    {
      title: 'Customizable (Pro)',
      description: 'Match your brand with custom colors, positions, themes, and language. All unlock with a Pro license.',
      icon: '🎨',
    },
    {
      title: 'Responsive by default',
      description: 'Looks great on desktop, tablet, and mobile without any extra configuration.',
      icon: '📱',
    },
    {
      title: 'Fast & lightweight',
      description: 'Designed to be tiny and fast. FreeShipBar won\'t slow down your store or hurt Core Web Vitals.',
      icon: '🚀',
    },
  ]

  return (
    <section className="features">
      <div className="container">
        <h2>Features</h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
