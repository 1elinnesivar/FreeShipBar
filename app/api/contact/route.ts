import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, message } = body

    // Validation
    if (!email || !message) {
      return NextResponse.json(
        { success: false, error: 'Email and message are required' },
        { status: 400 }
      )
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Message length validation
    if (message.trim().length < 10) {
      return NextResponse.json(
        { success: false, error: 'Message must be at least 10 characters' },
        { status: 400 }
      )
    }

    // Email'i txt dosyası olarak kaydet
    const timestamp = new Date().toISOString()
    const dateStr = timestamp.split('T')[0] // YYYY-MM-DD
    const timeStr = timestamp.split('T')[1].replace(/:/g, '-').split('.')[0] // HH-MM-SS
    const emailId = `${dateStr}_${timeStr}_${email.replace(/[^a-zA-Z0-9]/g, '_')}`
    
    // Vercel'de dosya sistemi yazma işlemleri çalışmaz, /tmp kullan
    const isVercel = process.env.VERCEL === '1'
    const emailsDir = isVercel 
      ? join('/tmp', 'emails') 
      : join(process.cwd(), 'data', 'emails')
    
    // Klasör yoksa oluştur
    try {
      await mkdir(emailsDir, { recursive: true })
    } catch (err: any) {
      // Klasör zaten varsa veya oluşturulamazsa devam et
      if (err.code !== 'EEXIST') {
        console.error('Error creating directory:', err)
        // Vercel'de dosya yazma çalışmaz, sadece logla
        if (isVercel) {
          console.log('Email saved to logs (Vercel file system is read-only):', {
            id: emailId,
            email,
            message,
            timestamp,
          })
          // Metadata'yi memory'de tutmak için başka bir çözüm gerekir
          // Şimdilik sadece log olarak kaydet
          return NextResponse.json({
            success: true,
            message: 'Message received (logged only - Vercel file system is read-only)',
            id: emailId,
            note: 'Please configure a database or storage solution for production',
          })
        }
      }
    }

    // Email içeriğini oluştur
    const emailContent = `From: ${email}
Date: ${timestamp}
Subject: Contact Form Submission - FreeShipBar

${message}
`

    try {
      // Txt dosyası olarak kaydet
      const filePath = join(emailsDir, `${emailId}.txt`)
      await writeFile(filePath, emailContent, 'utf-8')

      // Metadata dosyası oluştur (okunma durumu için)
      const metadata = {
        id: emailId,
        email: email,
        timestamp: timestamp,
        read: false,
        subject: 'Contact Form Submission - FreeShipBar',
      }
      const metadataPath = join(emailsDir, `${emailId}.json`)
      await writeFile(metadataPath, JSON.stringify(metadata, null, 2), 'utf-8')
    } catch (writeError: any) {
      console.error('Error writing email file:', writeError)
      // Vercel'de dosya yazma hatası, sadece logla
      if (isVercel || writeError.code === 'EROFS' || writeError.code === 'EACCES') {
        console.log('Email saved to logs (file system is read-only):', {
          id: emailId,
          email,
          message,
          timestamp,
        })
        return NextResponse.json({
          success: true,
          message: 'Message received (logged only - file system is read-only)',
          id: emailId,
          note: 'Please configure a database or storage solution for production',
        })
      }
      throw writeError
    }

    return NextResponse.json({
      success: true,
      message: 'Message sent successfully',
      id: emailId,
    })
  } catch (error: any) {
    console.error('Contact form error:', error)
    // Detaylı hata mesajı
    const errorMessage = error?.message || 'Unknown error'
    const errorCode = error?.code || 'UNKNOWN'
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? {
          message: errorMessage,
          code: errorCode,
          stack: error?.stack,
        } : undefined,
      },
      { status: 500 }
    )
  }
}

