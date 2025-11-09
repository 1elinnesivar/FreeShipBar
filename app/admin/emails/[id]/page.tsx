'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'

type EmailDetail = {
  id: string
  email: string
  timestamp: string
  read: boolean
  subject: string
  content: string
}

export default function EmailDetail() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null)
  const [email, setEmail] = useState<EmailDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const params = useParams()
  const emailId = params.id as string

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/admin/check-auth')
      if (response.ok) {
        const data = await response.json()
        setAuthenticated(data.authenticated)
      } else {
        setAuthenticated(false)
      }
    } catch (error) {
      setAuthenticated(false)
    } finally {
      setLoading(false)
    }
  }

  const fetchEmail = async () => {
    try {
      const response = await fetch(`/api/admin/emails/${emailId}`)
      if (response.ok) {
        const data = await response.json()
        setEmail(data.email)
        
        // Email okundu olarak işaretle
        if (!data.email.read) {
          await fetch(`/api/admin/emails/${emailId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ read: true }),
          })
        }
      }
    } catch (error) {
      console.error('Error fetching email:', error)
    }
  }

  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {
    if (authenticated && emailId) {
      fetchEmail()
    }
  }, [authenticated, emailId])

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (loading && authenticated === null) {
    return (
      <div className="admin-dashboard">
        <div className="admin-loading">Yükleniyor...</div>
      </div>
    )
  }

  if (!authenticated) {
    router.push('/admin/login')
    return null
  }

  if (!email) {
    return (
      <div className="admin-dashboard">
        <div className="admin-loading">Email yükleniyor...</div>
      </div>
    )
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <div className="container">
          <div className="admin-nav">
            <h1>Email Detayı</h1>
            <div className="admin-actions">
              <Link href="/admin/emails" className="admin-link">Email Listesi</Link>
              <Link href="/admin" className="admin-link">Dashboard</Link>
              <Link href="/" className="admin-link">Ana Sayfa</Link>
              <button onClick={handleLogout} className="logout-button">
                Çıkış Yap
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="admin-content">
          <div className="email-detail">
            <div className="email-detail-header">
              <div>
                <div className="email-detail-from">
                  <strong>Gönderen:</strong> {email.email}
                </div>
                <div className="email-detail-date">
                  <strong>Tarih:</strong> {formatDate(email.timestamp)}
                </div>
                <div className="email-detail-subject">
                  <strong>Konu:</strong> {email.subject}
                </div>
              </div>
            </div>
            <div className="email-detail-content">
              <pre>{email.content}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

