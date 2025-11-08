import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const loginSchema = z.object({
  username: z.string(),
  password: z.string(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, password } = loginSchema.parse(body)

    // Environment variables'dan admin bilgilerini al
    const adminUsername = process.env.ADMIN_USERNAME || '1elinnesivar'
    const adminPassword = process.env.ADMIN_PASSWORD || 'Zekayi123'

    if (username === adminUsername && password === adminPassword) {
      // Session cookie oluştur
      const response = NextResponse.json({ success: true })
      response.cookies.set('admin_session', 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 gün
        path: '/',
      })
      return response
    }

    return NextResponse.json(
      { success: false, error: 'Kullanıcı adı veya şifre hatalı' },
      { status: 401 }
    )
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Geçersiz istek' },
      { status: 400 }
    )
  }
}

