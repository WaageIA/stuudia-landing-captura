import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Verificar configurações básicas
    const config = {
      supabase: {
        url: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        anonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        serviceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY
      },
      resend: {
        apiKey: !!process.env.RESEND_API_KEY,
        fromEmail: !!process.env.FROM_EMAIL
      },
      app: {
        landingUrl: !!process.env.NEXT_PUBLIC_LANDING_URL,
        apiUrl: !!process.env.NEXT_PUBLIC_API_URL
      },
      environment: process.env.NODE_ENV
    }

    // Testar importações
    let imports = {
      supabase: false,
      resend: false,
      zod: false,
      validation: false,
      queries: false
    }

    try {
      const { supabase } = await import('@/lib/db/client')
      imports.supabase = !!supabase
    } catch (e) {
      console.error('Supabase import error:', e)
    }

    try {
      const { resend } = await import('@/lib/email/client')
      imports.resend = !!resend
    } catch (e) {
      console.error('Resend import error:', e)
    }

    try {
      const { validateLeadCapture } = await import('@/lib/validation/schemas')
      imports.zod = !!validateLeadCapture
    } catch (e) {
      console.error('Zod import error:', e)
    }

    try {
      const { createLeadCapture } = await import('@/lib/db/queries')
      imports.queries = !!createLeadCapture
    } catch (e) {
      console.error('Queries import error:', e)
    }

    // Status geral
    const allConfigsOk = Object.values(config.supabase).every(Boolean) &&
                        Object.values(config.resend).every(Boolean) &&
                        Object.values(config.app).every(Boolean)

    const allImportsOk = Object.values(imports).every(Boolean)

    const status = allConfigsOk && allImportsOk ? 'healthy' : 'unhealthy'

    return NextResponse.json({
      ok: true,
      status,
      timestamp: new Date().toISOString(),
      config,
      imports,
      endpoints: {
        capture: '/api/leads/capture',
        checkEmail: '/api/leads/check-email',
        linkProfile: '/api/leads/link-profile',
        analytics: '/api/leads/analytics'
      },
      message: status === 'healthy' 
        ? 'API está funcionando corretamente' 
        : 'Algumas configurações estão faltando'
    })

  } catch (error) {
    console.error('Health check error:', error)

    return NextResponse.json({
      ok: false,
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
