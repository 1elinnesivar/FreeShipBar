import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import axios from 'axios'
import { env } from '@/src/lib/env'

const verifyLicenseSchema = z.object({
  license: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    let body
    try {
      body = await request.json()
    } catch (e) {
      return NextResponse.json(
        { valid: false, plan: 'free' },
        {
          status: 200,
          headers: {
            'Access-Control-Allow-Origin': request.headers.get('origin') || '*',
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Allow-Headers': 'Content-Type',
          },
        }
      )
    }

    let parsedBody
    try {
      parsedBody = verifyLicenseSchema.parse(body)
    } catch (error) {
      return NextResponse.json(
        { valid: false, plan: 'free' },
        {
          status: 200,
          headers: {
            'Access-Control-Allow-Origin': request.headers.get('origin') || '*',
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Allow-Headers': 'Content-Type',
          },
        }
      )
    }

    const { license } = parsedBody

    // Eğer license yoksa, free plan döndür
    if (!license) {
      return NextResponse.json(
        {
          valid: false,
          plan: 'free',
        },
        {
          status: 200,
          headers: {
            'Access-Control-Allow-Origin': request.headers.get('origin') || '*',
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Allow-Headers': 'Content-Type',
          },
        }
      )
    }

    // Gumroad License API'ye istek at (form params)
    const gumroadUrl = 'https://api.gumroad.com/v2/licenses/verify'
    
    let response
    try {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 2000)

      const formData = new URLSearchParams()
      formData.append('product_permalink', env.GUMROAD_PRODUCT_PERMALINK)
      formData.append('license_key', license)
      formData.append('access_token', env.GUMROAD_API_KEY)

      response = await axios.post(gumroadUrl, formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        signal: controller.signal,
        timeout: 2000,
      })

      clearTimeout(timeout)
    } catch (axiosError: any) {
      // Gumroad API hatası durumunda free plan döndür
      return NextResponse.json(
        {
          valid: false,
          plan: 'free',
        },
        {
          status: 200,
          headers: {
            'Access-Control-Allow-Origin': request.headers.get('origin') || '*',
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Allow-Headers': 'Content-Type',
          },
        }
      )
    }

    // Başarılı yanıt kontrolü
    const purchase = response.data?.purchase
    const isValid = 
      purchase && 
      purchase.refunded === false && 
      purchase.chargebacked === false

    return NextResponse.json(
      {
        valid: isValid,
        plan: isValid ? 'pro' : 'free',
      },
      {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': request.headers.get('origin') || '*',
          'Access-Control-Allow-Methods': 'POST',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      }
    )
  } catch (error) {
    // Hata durumunda free plan döndür
    return NextResponse.json(
      {
        valid: false,
        plan: 'free',
      },
      {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': request.headers.get('origin') || '*',
          'Access-Control-Allow-Methods': 'POST',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      }
    )
  }
}
