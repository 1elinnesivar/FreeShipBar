export default function FAQ() {
  const faqs = [
    {
      question: 'Does it work without Pro?',
      answer: 'Yes, it works in Free mode with a watermark and single theme. Pro license removes the watermark and unlocks all themes, colors, position options, and announce mode.',
    },
    {
      question: 'One-time payment or subscription?',
      answer: 'One-time license, no subscription. Pay once and use forever with all Pro features.',
    },
    {
      question: 'How do I get my license key?',
      answer: 'After purchase, you\'ll receive your license key via email. Paste it into the builder form to unlock Pro features.',
    },
    {
      question: 'Can I customize colors in Free mode?',
      answer: 'No, Free mode uses default colors. Pro license unlocks full color customization.',
    },
  ]

  return (
    <section className="faq">
      <div className="container">
        <h2>FAQ</h2>
        <div className="faq-grid">
          {faqs.map((faq, index) => (
            <div key={index} className="faq-item">
              <h3>{faq.question}</h3>
              <p>{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

