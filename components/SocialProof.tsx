export default function SocialProof() {
  const benefits = [
    {
      icon: '⚡',
      title: 'Lightweight script',
      description: 'No dashboards to learn, no heavy code. Drop in one script and you\'re done.',
    },
    {
      icon: '💰',
      title: 'Predictable one-time pricing',
      description: 'Pay once for Pro, use it on your store without recurring subscriptions.',
    },
    {
      icon: '🛒',
      title: 'Built for real stores',
      description: 'Shows a live progress bar as carts update, so customers always know how close they are to free shipping.',
    },
  ]

  const testimonials = [
    {
      name: 'Coming Soon',
      role: 'Early User Feedback',
      text: 'We\'re collecting feedback from early users. Your testimonial could be here!',
      placeholder: true,
    },
    {
      name: 'Coming Soon',
      role: 'Early User Feedback',
      text: 'We\'re collecting feedback from early users. Your testimonial could be here!',
      placeholder: true,
    },
    {
      name: 'Coming Soon',
      role: 'Early User Feedback',
      text: 'We\'re collecting feedback from early users. Your testimonial could be here!',
      placeholder: true,
    },
  ]

  return (
    <section className="social-proof">
      <div className="container">
        <h2>Why small shops choose FreeShipBar</h2>
        <p className="social-proof-intro">
          FreeShipBar is built for solo founders, small ecommerce brands, and agencies that want a simple way to increase average order value without installing heavy apps.
        </p>
        <div className="benefits-grid">
          {benefits.map((benefit, index) => (
            <div key={index} className="benefit-card">
              <div className="benefit-icon">{benefit.icon}</div>
              <h3>{benefit.title}</h3>
              <p>{benefit.description}</p>
            </div>
          ))}
        </div>
        <div className="testimonials-section">
          <h3>What users are saying</h3>
          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <div key={index} className={`testimonial-card ${testimonial.placeholder ? 'placeholder' : ''}`}>
                <p className="testimonial-text">&ldquo;{testimonial.text}&rdquo;</p>
                <div className="testimonial-author">
                  <strong>{testimonial.name}</strong>
                  <span>{testimonial.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

