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
    
    const emailsDir = join(process.cwd(), 'data', 'emails')
    
    // Klasör yoksa oluştur
    try {
      await mkdir(emailsDir, { recursive: true })
    } catch (err) {
      // Klasör zaten varsa hata vermez
    }

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

    return NextResponse.json({
      success: true,
      message: 'Message sent successfully',
      id: emailId,
    })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

