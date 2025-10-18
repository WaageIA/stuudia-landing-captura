import { NextRequest, NextResponse } from 'next/server'
import { getLeadStats, getLeadsByStatus } from '@/lib/db/queries'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  try {
    // Verificar se é uma requisição autorizada (opcional)
    const authHeader = request.headers.get('authorization')
    const isAuthorized = authHeader === `Bearer ${process.env.ADMIN_API_KEY}` || 
                        process.env.NODE_ENV === 'development'

    if (!isAuthorized) {
      return NextResponse.json(
        { ok: false, error: 'Não autorizado' },
        { status: 401 }
      )
    }

    // Extrair parâmetros da query
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const type = searchParams.get('type') || 'stats'

    if (type === 'stats') {
      // Retornar estatísticas gerais
      const stats = await getLeadStats()
      
      return NextResponse.json({
        ok: true,
        data: stats,
        timestamp: new Date().toISOString()
      })
    }

    if (type === 'leads' && status) {
      // Retornar leads por status
      const leads = await getLeadsByStatus(status as any)
      
      return NextResponse.json({
        ok: true,
        data: leads,
        count: leads.length,
        status,
        timestamp: new Date().toISOString()
      })
    }

    // Parâmetros inválidos
    return NextResponse.json(
      { 
        ok: false, 
        error: 'Parâmetros inválidos. Use type=stats ou type=leads&status=pending|email_validated|whatsapp_validated|converted' 
      },
      { status: 400 }
    )

  } catch (error) {
    console.error('Error getting lead analytics:', error)

    return NextResponse.json(
      { ok: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
