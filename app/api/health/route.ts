import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const healthCheck = {
      success: true,
      timestamp: new Date().toISOString(),
      status: 'healthy',
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      service: 'Satyavij Medical Equipment API',
      version: '1.0.0',
    }

    return NextResponse.json(healthCheck, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        status: 'unhealthy',
        error: 'Health check failed',
      },
      { status: 500 }
    )
  }
}
