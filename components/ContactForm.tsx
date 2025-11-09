'use client'

import { useState } from 'react'

export default function ContactForm() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, message }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setSuccess(true)
        setEmail('')
        setMessage('')
        setTimeout(() => setSuccess(false), 5000)
      } else {
        setError(data.error || 'Bir hata oluştu. Lütfen tekrar deneyin.')
      }
    } catch (err) {
      setError('Bir hata oluştu. Lütfen tekrar deneyin.')
    } finally {
      setLoading(false)
    }

    return false
  }

  return (
    <section className="contact-form-section">
      <div className="container">
        <h2>Get in Touch</h2>
        <p className="contact-intro">
          Have questions, feedback, or suggestions? We&apos;d love to hear from you!
        </p>
        <form onSubmit={handleSubmit} className="contact-form">
          <div className="form-group">
            <label htmlFor="contact-email">Email</label>
            <input
              id="contact-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="your@email.com"
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="contact-message">Message</label>
            <textarea
              id="contact-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              rows={5}
              placeholder="Your feedback, questions, or suggestions..."
              disabled={loading}
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          {success && (
            <div className="success-message">
              Thank you! Your message has been sent successfully.
            </div>
          )}
          <button type="submit" disabled={loading} className="contact-submit-button">
            {loading ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </div>
    </section>
  )
}

