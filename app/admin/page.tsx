'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

type AnalyticsData = {
  totalUsers: number
  newUsers: number
  sessions: number
  pageViews: number
  avgSessionDuration: string
  bounceRate: string
  topPages: Array<{ path: string; views: number; title: string }>
  topSources: Array<{ source: string; users: number; percentage: number }>
  topCountries: Array<{ country: string; users: number }>
  dateRange: { startDate: string; endDate: string }
  isMock?: boolean
  error?: string
}

export default function AdminDashboard() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null)
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState({ startDate: '30daysAgo', endDate: 'today' })
  const [isMock, setIsMock] = useState(false)
  const [warning, setWarning] = useState<string | null>(null)
  const router = useRouter()

  const fetchAnalytics = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
      })
      const response = await fetch(`/api/admin/analytics?${params}`)
      if (response.ok) {
        const result = await response.json()
        setAnalytics(result.data)
        setIsMock(result.data?.isMock || false)
        setWarning(result.warning || null)
      }
    } catch (error) {
      console.error('Analytics fetch error:', error)
    } finally {
      setLoading(false)
    }
  }, [dateRange])

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

  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {
    if (authenticated) {
      fetchAnalytics()
    }
  }, [authenticated, fetchAnalytics])

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

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <div className="container">
          <div className="admin-nav">
            <h1>Admin Dashboard</h1>
            <div className="admin-actions">
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
          <div className="date-range-selector">
            <label>
              Tarih Aralığı:
              <select
                value={`${dateRange.startDate}-${dateRange.endDate}`}
                onChange={(e) => {
                  const [start, end] = e.target.value.split('-')
                  setDateRange({ startDate: start, endDate: end })
                }}
              >
                <option value="7daysAgo-today">Son 7 Gün</option>
                <option value="30daysAgo-today">Son 30 Gün</option>
                <option value="90daysAgo-today">Son 90 Gün</option>
                <option value="365daysAgo-today">Son 1 Yıl</option>
              </select>
            </label>
            {isMock && (
              <div className="mock-warning">
                ⚠️ Mock veri gösteriliyor. Google Analytics yapılandırması için environment variables ekleyin.
              </div>
            )}
            {warning && (
              <div className="mock-warning">
                ⚠️ {warning}
              </div>
            )}
          </div>

          {loading ? (
            <div className="admin-loading">Veriler yükleniyor...</div>
          ) : analytics ? (
            <>
              <div className="stats-grid">
                <div className="stat-card">
                  <h3>Toplam Kullanıcı</h3>
                  <p className="stat-value">{analytics.totalUsers.toLocaleString()}</p>
                </div>
                <div className="stat-card">
                  <h3>Yeni Kullanıcı</h3>
                  <p className="stat-value">{analytics.newUsers.toLocaleString()}</p>
                </div>
                <div className="stat-card">
                  <h3>Oturum</h3>
                  <p className="stat-value">{analytics.sessions.toLocaleString()}</p>
                </div>
                <div className="stat-card">
                  <h3>Sayfa Görüntüleme</h3>
                  <p className="stat-value">{analytics.pageViews.toLocaleString()}</p>
                </div>
                <div className="stat-card">
                  <h3>Ortalama Oturum Süresi</h3>
                  <p className="stat-value">{analytics.avgSessionDuration}</p>
                </div>
                <div className="stat-card">
                  <h3>Hemen Çıkma Oranı</h3>
                  <p className="stat-value">{analytics.bounceRate}</p>
                </div>
              </div>

              <div className="analytics-grid">
                <div className="analytics-card">
                  <h2>En Çok Ziyaret Edilen Sayfalar</h2>
                  <div className="table-container">
                    <table>
                      <thead>
                        <tr>
                          <th>Sayfa</th>
                          <th>Görüntüleme</th>
                        </tr>
                      </thead>
                      <tbody>
                        {analytics.topPages.map((page, index) => (
                          <tr key={index}>
                            <td>
                              <div className="page-info">
                                <strong>{page.title}</strong>
                                <span className="page-path">{page.path}</span>
                              </div>
                            </td>
                            <td>{page.views.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="analytics-card">
                  <h2>Traffic Kaynakları</h2>
                  <div className="sources-list">
                    {analytics.topSources.map((source, index) => (
                      <div key={index} className="source-item">
                        <div className="source-header">
                          <span className="source-name">{source.source}</span>
                          <span className="source-percentage">{source.percentage}%</span>
                        </div>
                        <div className="source-bar">
                          <div
                            className="source-bar-fill"
                            style={{ width: `${source.percentage}%` }}
                          />
                        </div>
                        <div className="source-users">{source.users.toLocaleString()} kullanıcı</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="analytics-card">
                  <h2>Ülkelere Göre Dağılım</h2>
                  <div className="countries-list">
                    {analytics.topCountries.map((country, index) => (
                      <div key={index} className="country-item">
                        <span className="country-name">{country.country}</span>
                        <span className="country-users">{country.users.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="admin-error">Veriler yüklenemedi</div>
          )}
        </div>
      </div>
    </div>
  )
}

