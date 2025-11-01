export default function Features() {
  const features = [
    {
      title: 'Easy Integration',
      description: 'Add to your site with a single script tag. No coding required.',
      icon: '⚡',
    },
    {
      title: 'Customizable',
      description: 'Adapt colors, position, and language settings to match your brand.',
      icon: '🎨',
    },
    {
      title: 'Responsive',
      description: 'Perfect appearance on all devices. Mobile-friendly design.',
      icon: '📱',
    },
    {
      title: 'Performant',
      description: 'Lightweight and fast. Does not affect your site performance.',
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
