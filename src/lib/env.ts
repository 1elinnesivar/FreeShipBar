import { z } from 'zod'

const envSchema = z.object({
  GUMROAD_PRODUCT_PERMALINK: z.string().min(1),
  GUMROAD_API_KEY: z.string().min(1),
})

type Env = z.infer<typeof envSchema>

function getEnv(): Env {
  const env = {
    GUMROAD_PRODUCT_PERMALINK: process.env.GUMROAD_PRODUCT_PERMALINK,
    GUMROAD_API_KEY: process.env.GUMROAD_API_KEY,
  }

  try {
    return envSchema.parse(env)
  } catch (error) {
    const missing = []
    if (!env.GUMROAD_PRODUCT_PERMALINK) missing.push('GUMROAD_PRODUCT_PERMALINK')
    if (!env.GUMROAD_API_KEY) missing.push('GUMROAD_API_KEY')

    console.warn(
      `[FreeShipBar] Missing required environment variables: ${missing.join(', ')}`
    )

    // Build ve development sırasında fallback değerler kullan
    const isDevelopment = process.env.NODE_ENV === 'development'
    const isBuild = process.env.NEXT_PHASE === 'phase-production-build'
    
    if (isDevelopment || isBuild) {
      console.warn('[FreeShipBar] Using fallback values')
      return {
        GUMROAD_PRODUCT_PERMALINK: env.GUMROAD_PRODUCT_PERMALINK || 'freeshipbar-pro',
        GUMROAD_API_KEY: env.GUMROAD_API_KEY || 'dev-key',
      }
    }

    throw new Error(`Missing required environment variables: ${missing.join(', ')}`)
  }
}

export const env = getEnv()

