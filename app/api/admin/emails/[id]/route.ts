import { NextRequest, NextResponse } from 'next/server'
import { readFile, writeFile } from 'fs/promises'
import { join } from 'path'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Authentication kontrolü
  const session = request.cookies.get('admin_session')
  if (session?.value !== 'authenticated') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const isVercel = process.env.VERCEL === '1'
    const emailsDir = isVercel 
      ? join('/tmp', 'emails') 
      : join(process.cwd(), 'data', 'emails')
    const emailId = params.id

    try {
      // Txt dosyasını oku
      const txtPath = join(emailsDir, `${emailId}.txt`)
      const content = await readFile(txtPath, 'utf-8')

      // Metadata dosyasını oku
      const metadataPath = join(emailsDir, `${emailId}.json`)
      const metadataContent = await readFile(metadataPath, 'utf-8')
      const metadata = JSON.parse(metadataContent)

      return NextResponse.json({
        success: true,
        email: {
          ...metadata,
          content: content,
        },
      })
    } catch (fileError: any) {
      if (fileError.code === 'ENOENT' || isVercel) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Email not found',
            note: isVercel ? 'Vercel file system is read-only. Please configure a database or storage solution.' : 'Email file does not exist',
          },
          { status: 404 }
        )
      }
      throw fileError
    }
  } catch (error: any) {
    console.error('Error reading email:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Email not found',
        details: process.env.NODE_ENV === 'development' ? {
          message: error?.message,
          code: error?.code,
        } : undefined,
      },
      { status: 404 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Authentication kontrolü
  const session = request.cookies.get('admin_session')
  if (session?.value !== 'authenticated') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const isVercel = process.env.VERCEL === '1'
    const emailsDir = isVercel 
      ? join('/tmp', 'emails') 
      : join(process.cwd(), 'data', 'emails')
    const emailId = params.id

    try {
      // Metadata dosyasını oku
      const metadataPath = join(emailsDir, `${emailId}.json`)
      const metadataContent = await readFile(metadataPath, 'utf-8')
      const metadata = JSON.parse(metadataContent)

      // Okunma durumunu güncelle
      if (body.read !== undefined) {
        metadata.read = body.read
      }

      // Metadata dosyasını güncelle
      await writeFile(metadataPath, JSON.stringify(metadata, null, 2), 'utf-8')

      return NextResponse.json({
        success: true,
        email: metadata,
      })
    } catch (fileError: any) {
      if (fileError.code === 'ENOENT' || isVercel || fileError.code === 'EROFS' || fileError.code === 'EACCES') {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Failed to update email',
            note: isVercel ? 'Vercel file system is read-only. Please configure a database or storage solution.' : 'Email file does not exist or is read-only',
          },
          { status: 500 }
        )
      }
      throw fileError
    }
  } catch (error: any) {
    console.error('Error updating email:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update email',
        details: process.env.NODE_ENV === 'development' ? {
          message: error?.message,
          code: error?.code,
        } : undefined,
      },
      { status: 500 }
    )
  }
}

