import { NextRequest, NextResponse } from 'next/server'
import { readdir, readFile } from 'fs/promises'
import { join } from 'path'

export async function GET(request: NextRequest) {
  // Authentication kontrolü
  const session = request.cookies.get('admin_session')
  if (session?.value !== 'authenticated') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const emailsDir = join(process.cwd(), 'data', 'emails')
    
    // Tüm dosyaları oku
    const files = await readdir(emailsDir)
    
    // Sadece .json dosyalarını al (metadata)
    const metadataFiles = files.filter(f => f.endsWith('.json'))
    
    // Her metadata dosyasını oku
    const emails = await Promise.all(
      metadataFiles.map(async (file) => {
        try {
          const filePath = join(emailsDir, file)
          const content = await readFile(filePath, 'utf-8')
          return JSON.parse(content)
        } catch (err) {
          console.error(`Error reading ${file}:`, err)
          return null
        }
      })
    )

    // Null değerleri filtrele ve tarihe göre sırala (en yeni önce)
    const validEmails = emails
      .filter((email): email is NonNullable<typeof email> => email !== null)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    // Okunmamış email sayısı
    const unreadCount = validEmails.filter(email => !email.read).length

    return NextResponse.json({
      success: true,
      emails: validEmails,
      total: validEmails.length,
      unread: unreadCount,
    })
  } catch (error) {
    console.error('Error reading emails:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to read emails' },
      { status: 500 }
    )
  }
}

