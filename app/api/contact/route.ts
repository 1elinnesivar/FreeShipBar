import { NextRequest, NextResponse } from 'next/server'

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

    // Here you can integrate with an email service like:
    // - Resend
    // - SendGrid
    // - Nodemailer
    // - Or save to a database
    
    // For now, we'll log it (you can replace this with actual email sending)
    console.log('Contact form submission:', {
      email,
      message,
      timestamp: new Date().toISOString(),
    })

    // TODO: Replace with actual email service integration
    // Example with Resend:
    // const resend = new Resend(process.env.RESEND_API_KEY)
    // await resend.emails.send({
    //   from: 'contact@freeshipbar.vercel.app',
    //   to: 'your-email@example.com',
    //   subject: 'New Contact Form Submission',
    //   html: `<p>Email: ${email}</p><p>Message: ${message}</p>`,
    // })

    return NextResponse.json({
      success: true,
      message: 'Message sent successfully',
    })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

