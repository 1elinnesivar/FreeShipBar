'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

type Email = {
  id: string
  email: string
  timestamp: string
  read: boolean
  subject: string
}

export default function AdminEmails() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null)
  const [emails, setEmails] = useState<Email[]>([])
  const [loading, setLoading] = useState(true)
  const [unreadCount, setUnreadCount] = useState(0)
  const router = useRouter()

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

  const fetchEmails = async () => {
    try {
      const response = await fetch('/api/admin/emails')
      if (response.ok) {
        const data = await response.json()
        setEmails(data.emails)
        setUnreadCount(data.unread)
      }
    } catch (error) {
      console.error('Error fetching emails:', error)
    }
  }

  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {
    if (authenticated) {
      fetchEmails()
      // Her 30 saniyede bir güncelle
      const interval = setInterval(fetchEmails, 30000)
      return () => clearInterval(interval)
    }
  }, [authenticated])

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin/login')
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

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <div className="container">
          <div className="admin-nav">
            <h1>Email Mesajları</h1>
            <div className="admin-actions">
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
          <div className="emails-header">
            <div className="emails-stats">
              <span className="stat-item">
                Toplam: <strong>{emails.length}</strong>
              </span>
              {unreadCount > 0 && (
                <span className="stat-item unread-badge">
                  Okunmamış: <strong>{unreadCount}</strong>
                </span>
              )}
            </div>
            <button onClick={fetchEmails} className="refresh-button">
              Yenile
            </button>
          </div>

          {emails.length === 0 ? (
            <div className="no-emails">Henüz email yok</div>
          ) : (
            <div className="emails-list">
              {emails.map((email) => (
                <Link
                  key={email.id}
                  href={`/admin/emails/${email.id}`}
                  className={`email-item ${!email.read ? 'unread' : ''}`}
                >
                  <div className="email-header">
                    <div className="email-from">
                      {!email.read && <span className="unread-dot"></span>}
                      <strong>{email.email}</strong>
                    </div>
                    <div className="email-date">{formatDate(email.timestamp)}</div>
                  </div>
                  <div className="email-subject">{email.subject}</div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

