import { NextResponse } from 'next/server'
import axios from 'axios'
import { env } from '@/src/lib/env'

export async function GET() {
  try {
    // Gumroad API çağrısı
    const gumroadUrl = `https://api.gumroad.com/v2/products/${env.GUMROAD_PRODUCT_PERMALINK}`
    
    let response
    try {
      response = await axios.get(gumroadUrl, {
        headers: {
          Authorization: `Bearer ${env.GUMROAD_API_KEY}`,
        },
        params: {
          access_token: env.GUMROAD_API_KEY,
        },
      })
    } catch (axiosError) {
      console.error('Gumroad API error:', axiosError)
      // Gumroad API hatası durumunda varsayılan mesaj döndür
      return NextResponse.json(
        {
          success: false,
          message: 'Free shipping available!',
        },
        {
          status: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET',
            'Access-Control-Allow-Headers': 'Content-Type',
          },
        }
      )
    }

    // Başarılı yanıt
    return NextResponse.json(
      {
        success: true,
        message: response.data.product?.name || 'Free shipping available!',
      },
      {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      }
    )
  } catch (error) {
    console.error('Freeshipbar API Error:', error)

    // Hata durumunda varsayılan mesaj
    return NextResponse.json(
      {
        success: false,
        message: 'Free shipping available!',
      },
      {
        status: 200, // Hata olsa bile embed script çalışsın
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      }
    )
  }
}

