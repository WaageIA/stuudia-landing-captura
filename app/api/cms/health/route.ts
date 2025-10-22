import { NextResponse } from 'next/server'
import { cmsClient } from '@/lib/cms/client'

export async function GET() {
  try {
    const health = await cmsClient.healthCheck()

    const response = {
      ok: health.status === 'ok',
      status: health.status,
      provider: health.provider,
      timestamp: new Date().toISOString(),
      lastFetch: health.lastFetch,
      config: {
        cms_provider: process.env.CMS_PROVIDER || 'strapi',
        strapi_url: !!process.env.STRAPI_URL,
        contentful_space: !!process.env.CONTENTFUL_SPACE_ID,
        contentful_token: !!process.env.CONTENTFUL_ACCESS_TOKEN,
      }
    }

    // Retornar status apropriado
    const statusCode = health.status === 'ok' ? 200 : 503 // Service Unavailable

    return NextResponse.json(response, { status: statusCode })

  } catch (error) {
    console.error('CMS Health Check Error:', error)

    return NextResponse.json(
      {
        ok: false,
        status: 'error',
        error: 'Erro no health check do CMS',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}
