export default function HowItWorks() {
  const steps = [
    {
      number: '1',
      title: 'Drop in the script',
      description: 'Paste a single script tag into your store\'s head or tag manager.',
    },
    {
      number: '2',
      title: 'Set your free shipping threshold',
      description: 'Use the builder to set your currency, threshold, and language.',
    },
    {
      number: '3',
      title: 'Watch your average order value grow',
      description: 'Shoppers see how much more they need to spend to unlock free shipping – and they add that extra item.',
    },
  ]

  return (
    <section className="how-it-works">
      <div className="container">
        <h2>How it works</h2>
        <div className="steps-container">
          {steps.map((step, index) => (
            <div key={index} className="step-card">
              <div className="step-number">{step.number}</div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

