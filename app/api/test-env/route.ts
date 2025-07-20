import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  // Test endpoint to verify environment variables are accessible
  return NextResponse.json({
    timestamp: new Date().toISOString(),
    environment: {
      NODE_ENV: process.env.NODE_ENV,
      OPENAI_API_KEY_EXISTS: !!process.env.OPENAI_API_KEY,
      OPENAI_API_KEY_PREFIX: process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.substring(0, 7) : 'not set',
      OPENAI_MODEL: process.env.OPENAI_MODEL || 'not set',
      VERCEL: process.env.VERCEL || 'not running on Vercel',
      VERCEL_ENV: process.env.VERCEL_ENV || 'not set',
    },
    message: 'This endpoint helps verify that environment variables are accessible in API routes'
  })
}