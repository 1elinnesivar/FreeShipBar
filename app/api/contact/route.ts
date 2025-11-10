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

    const timestamp = new Date().toISOString()
    const dateStr = timestamp.split('T')[0] // YYYY-MM-DD
    const timeStr = timestamp.split('T')[1].replace(/:/g, '-').split('.')[0] // HH-MM-SS
    const emailId = `${dateStr}_${timeStr}_${email.replace(/[^a-zA-Z0-9]/g, '_')}`

    // Email'i freeshipbar@gmail.com adresine gönder
    const recipientEmail = 'freeshipbar@gmail.com'
    const resendApiKey = process.env.RESEND_API_KEY

    if (resendApiKey) {
      try {
        // Resend API ile email gönder
        const resendResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'FreeShipBar Contact <noreply@freeshipbar.vercel.app>',
            to: recipientEmail,
            replyTo: email,
            subject: `Yeni İletişim Formu Mesajı - ${email}`,
            html: `
              <h2>Yeni İletişim Formu Mesajı</h2>
              <p><strong>Gönderen:</strong> ${email}</p>
              <p><strong>Tarih:</strong> ${new Date(timestamp).toLocaleString('tr-TR')}</p>
              <hr>
              <h3>Mesaj:</h3>
              <p style="white-space: pre-wrap; background: #f3f4f6; padding: 1rem; border-radius: 6px;">${message.replace(/\n/g, '<br>')}</p>
            `,
            text: `Yeni İletişim Formu Mesajı\n\nGönderen: ${email}\nTarih: ${new Date(timestamp).toLocaleString('tr-TR')}\n\nMesaj:\n${message}`,
          }),
        })

        if (!resendResponse.ok) {
          const errorData = await resendResponse.json().catch(() => ({}))
          console.error('Resend API error:', errorData)
          // Email gönderme hatası olsa bile devam et, dosyaya kaydet
        } else {
          console.log('Email sent successfully to', recipientEmail)
        }
      } catch (emailError) {
        console.error('Email sending error:', emailError)
        // Email gönderme hatası olsa bile devam et, dosyaya kaydet
      }
    } else {
      console.warn('RESEND_API_KEY not set, email will not be sent. Email saved to file only.')
    }

    // Email'i txt dosyası olarak da kaydet (local için)
    const isVercel = process.env.VERCEL === '1'
    const emailsDir = isVercel 
      ? join('/tmp', 'emails') 
      : join(process.cwd(), 'data', 'emails')
    
    // Local'de dosyaya kaydet
    if (!isVercel) {
      try {
        await mkdir(emailsDir, { recursive: true })
        
        // Email içeriğini oluştur
        const emailContent = `From: ${email}
Date: ${timestamp}
Subject: Contact Form Submission - FreeShipBar

${message}
`

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
      } catch (fileError: any) {
        console.error('Error saving email to file:', fileError)
        // Dosya kaydetme hatası kritik değil, email zaten gönderildi
      }
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

