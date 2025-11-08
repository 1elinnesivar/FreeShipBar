import { NextRequest, NextResponse } from 'next/server'
import { BetaAnalyticsDataClient } from '@google-analytics/data'

// Google Analytics Data API v1 kullanarak veri çekme
export async function GET(request: NextRequest) {
  // Authentication kontrolü
  const session = request.cookies.get('admin_session')
  if (session?.value !== 'authenticated') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const propertyId = process.env.GA4_PROPERTY_ID
  const credentialsJson = process.env.GA4_CREDENTIALS

  const startDate = request.nextUrl.searchParams.get('startDate') || '30daysAgo'
  const endDate = request.nextUrl.searchParams.get('endDate') || 'today'

  // Debug: Environment variables kontrolü
  console.log('GA4_PROPERTY_ID exists:', !!propertyId)
  console.log('GA4_CREDENTIALS exists:', !!credentialsJson)

  // Eğer Google Analytics yapılandırması yoksa mock data döndür
  if (!propertyId || !credentialsJson) {
    console.log('Missing GA4 configuration, returning mock data')
    const mockData = {
      totalUsers: 1250,
      newUsers: 450,
      sessions: 1890,
      pageViews: 3420,
      avgSessionDuration: '2m 34s',
      bounceRate: '45.2%',
      topPages: [
        { path: '/', views: 1200, title: 'Home' },
        { path: '/blog', views: 890, title: 'Blog' },
        { path: '/blog/best-free-shipping-bar-tools-small-online-stores', views: 450, title: 'Best Free Shipping Bar Tools' },
        { path: '/blog/how-free-shipping-progress-bar-increases-average-order-value', views: 320, title: 'How Free Shipping Progress Bar Increases AOV' },
        { path: '/blog/show-free-shipping-threshold-without-heavy-apps', views: 280, title: 'Show Free Shipping Threshold' },
      ],
      topSources: [
        { source: 'google', users: 650, percentage: 52 },
        { source: 'direct', users: 420, percentage: 33.6 },
        { source: 'social', users: 180, percentage: 14.4 },
      ],
      topCountries: [
        { country: 'United States', users: 450 },
        { country: 'United Kingdom', users: 180 },
        { country: 'Canada', users: 120 },
        { country: 'Germany', users: 95 },
        { country: 'France', users: 85 },
      ],
      dateRange: { startDate, endDate },
      isMock: true,
    }
    return NextResponse.json({ success: true, data: mockData })
  }

  try {
    // Google Analytics Data API ile gerçek veri çekme
    console.log('Attempting to connect to Google Analytics API...')
    let credentials
    try {
      credentials = typeof credentialsJson === 'string' ? JSON.parse(credentialsJson) : credentialsJson
    } catch (parseError) {
      console.error('Failed to parse GA4_CREDENTIALS:', parseError)
      throw new Error('Invalid GA4_CREDENTIALS format. Must be valid JSON.')
    }
    
    const analyticsDataClient = new BetaAnalyticsDataClient({
      credentials,
    })
    console.log('Google Analytics client created successfully')

    // Toplam kullanıcı ve oturum verileri
    const responses = await Promise.all([
      // Toplam kullanıcılar
      analyticsDataClient.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [{ startDate, endDate }],
        metrics: [
          { name: 'totalUsers' },
          { name: 'newUsers' },
        ],
      }),
      // Oturum verileri
      analyticsDataClient.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [{ startDate, endDate }],
        metrics: [
          { name: 'sessions' },
          { name: 'screenPageViews' },
          { name: 'averageSessionDuration' },
          { name: 'bounceRate' },
        ],
      }),
      // En çok ziyaret edilen sayfalar
      analyticsDataClient.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [{ startDate, endDate }],
        dimensions: [{ name: 'pagePath' }, { name: 'pageTitle' }],
        metrics: [{ name: 'screenPageViews' }],
        orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
        limit: 5,
      }),
      // Traffic kaynakları
      analyticsDataClient.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [{ startDate, endDate }],
        dimensions: [{ name: 'sessionSource' }],
        metrics: [{ name: 'totalUsers' }],
        orderBys: [{ metric: { metricName: 'totalUsers' }, desc: true }],
        limit: 5,
      }),
      // Ülkelere göre dağılım
      analyticsDataClient.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [{ startDate, endDate }],
        dimensions: [{ name: 'country' }],
        metrics: [{ name: 'totalUsers' }],
        orderBys: [{ metric: { metricName: 'totalUsers' }, desc: true }],
        limit: 5,
      }),
    ])

    const usersResponse = responses[0] as any
    const sessionsResponse = responses[1] as any
    const pagesResponse = responses[2] as any
    const sourcesResponse = responses[3] as any
    const countriesResponse = responses[4] as any

    // Verileri parse et
    const totalUsers = parseInt(usersResponse.rows?.[0]?.metricValues?.[0]?.value || '0')
    const newUsers = parseInt(usersResponse.rows?.[0]?.metricValues?.[1]?.value || '0')
    const sessions = parseInt(sessionsResponse.rows?.[0]?.metricValues?.[0]?.value || '0')
    const pageViews = parseInt(sessionsResponse.rows?.[0]?.metricValues?.[1]?.value || '0')
    const avgDuration = sessionsResponse.rows?.[0]?.metricValues?.[2]?.value || '0'
    const bounceRate = sessionsResponse.rows?.[0]?.metricValues?.[3]?.value || '0'

    // Ortalama oturum süresini formatla
    const avgSeconds = parseFloat(avgDuration)
    const minutes = Math.floor(avgSeconds / 60)
    const seconds = Math.floor(avgSeconds % 60)
    const avgSessionDuration = `${minutes}m ${seconds}s`

    // Bounce rate'i yüzde olarak formatla
    const bounceRatePercent = (parseFloat(bounceRate) * 100).toFixed(1) + '%'

    // Toplam kullanıcı sayısını hesapla (sources için)
    const totalSourceUsers = sourcesResponse.rows?.reduce((sum: number, row: any) => {
      return sum + parseInt(row.metricValues?.[0]?.value || '0')
    }, 0) || 1

    const data = {
      totalUsers,
      newUsers,
      sessions,
      pageViews,
      avgSessionDuration,
      bounceRate: bounceRatePercent,
      topPages: pagesResponse.rows?.slice(0, 5).map((row: any) => ({
        path: row.dimensionValues?.[0]?.value || '',
        views: parseInt(row.metricValues?.[0]?.value || '0'),
        title: row.dimensionValues?.[1]?.value || 'Untitled',
      })) || [],
      topSources: sourcesResponse.rows?.slice(0, 5).map((row: any) => {
        const users = parseInt(row.metricValues?.[0]?.value || '0')
        return {
          source: row.dimensionValues?.[0]?.value || 'unknown',
          users,
          percentage: ((users / totalSourceUsers) * 100).toFixed(1),
        }
      }) || [],
      topCountries: countriesResponse.rows?.slice(0, 5).map((row: any) => ({
        country: row.dimensionValues?.[0]?.value || 'Unknown',
        users: parseInt(row.metricValues?.[0]?.value || '0'),
      })) || [],
      dateRange: { startDate, endDate },
      isMock: false,
    }

    console.log('Successfully fetched analytics data')
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    console.error('Google Analytics API Error:', error)
    console.error('Error message:', error?.message)
    console.error('Error stack:', error?.stack)
    
    // Hata durumunda mock data döndür
    const mockData = {
      totalUsers: 1250,
      newUsers: 450,
      sessions: 1890,
      pageViews: 3420,
      avgSessionDuration: '2m 34s',
      bounceRate: '45.2%',
      topPages: [
        { path: '/', views: 1200, title: 'Home' },
        { path: '/blog', views: 890, title: 'Blog' },
        { path: '/blog/best-free-shipping-bar-tools-small-online-stores', views: 450, title: 'Best Free Shipping Bar Tools' },
        { path: '/blog/how-free-shipping-progress-bar-increases-average-order-value', views: 320, title: 'How Free Shipping Progress Bar Increases AOV' },
        { path: '/blog/show-free-shipping-threshold-without-heavy-apps', views: 280, title: 'Show Free Shipping Threshold' },
      ],
      topSources: [
        { source: 'google', users: 650, percentage: 52 },
        { source: 'direct', users: 420, percentage: 33.6 },
        { source: 'social', users: 180, percentage: 14.4 },
      ],
      topCountries: [
        { country: 'United States', users: 450 },
        { country: 'United Kingdom', users: 180 },
        { country: 'Canada', users: 120 },
        { country: 'Germany', users: 95 },
        { country: 'France', users: 85 },
      ],
      dateRange: { startDate, endDate },
      isMock: true,
      error: error.message,
    }
    
    return NextResponse.json({ success: true, data: mockData, warning: 'Mock data kullanılıyor - Google Analytics API hatası' })
  }
}

