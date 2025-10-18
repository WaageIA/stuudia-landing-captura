import { NextRequest, NextResponse } from 'next/server'
import { validateLinkProfile } from '@/lib/validation/schemas'
import { getLeadByEmail, linkLeadWithProfile } from '@/lib/db/queries'
import { checkRateLimit, getClientIdentifier } from '@/lib/utils/rate-limit'
import { sanitizeEmail, sanitizeString } from '@/lib/utils/security'

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientId = getClientIdentifier(request)
    const rateLimit = checkRateLimit(clientId, {
      windowMs: 60 * 60 * 1000, // 1 hora
      max: 5, // máximo 5 vinculações por IP
      message: 'Muitas tentativas de vinculação. Tente novamente em 1 hora.'
    })
    
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { 
          ok: false, 
          error: 'Muitas tentativas de vinculação. Tente novamente em 1 hora.',
          retryAfter: Math.ceil((rateLimit.resetTime - Date.now()) / 1000)
        },
        { status: 429 }
      )
    }

    // Parse e validação dos dados
    const body = await request.json()
    
    // Sanitização
    const sanitizedBody = {
      email: sanitizeEmail(body.email || ''),
      user_id: sanitizeString(body.user_id || '')
    }

    // Validação com Zod
    const validatedData = validateLinkProfile(sanitizedBody)

    // Verificar se lead existe
    const lead = await getLeadByEmail(validatedData.email)
    if (!lead) {
      return NextResponse.json(
        { 
          ok: false, 
          error: 'Lead não encontrado. Verifique o email ou crie um novo lead.',
          code: 'LEAD_NOT_FOUND'
        },
        { status: 404 }
      )
    }

    // Verificar se já foi vinculado
    if (lead.status !== 'pending') {
      return NextResponse.json(
        { 
          ok: false, 
          error: 'Este lead já foi processado anteriormente.',
          code: 'LEAD_ALREADY_PROCESSED',
          currentStatus: lead.status
        },
        { status: 409 }
      )
    }

    // Vincular lead com profile do usuário
    const updatedLead = await linkLeadWithProfile(validatedData.email, validatedData.user_id)

    // Log de auditoria
    console.log('Lead linked with profile:', {
      leadId: updatedLead.id,
      email: validatedData.email,
      userId: validatedData.user_id,
      clientId,
      timestamp: new Date().toISOString()
    })

    // Resposta de sucesso
    return NextResponse.json({
      ok: true,
      leadId: updatedLead.id,
      userId: validatedData.user_id,
      status: updatedLead.status,
      message: 'Lead vinculado com sucesso! Bem-vindo ao Meu Studio AI.',
      rateLimit: {
        remaining: rateLimit.remaining,
        resetTime: rateLimit.resetTime
      }
    })

  } catch (error) {
    console.error('Error linking lead with profile:', error)

    // Tratamento de erros específicos
    if (error instanceof Error) {
      if (error.message.includes('validation')) {
        return NextResponse.json(
          { ok: false, error: 'Dados inválidos. Verifique email e user_id.' },
          { status: 400 }
        )
      }
      
      if (error.message.includes('Failed to update lead status')) {
        return NextResponse.json(
          { ok: false, error: 'Erro interno. Tente novamente em alguns minutos.' },
          { status: 500 }
        )
      }
    }

    // Erro genérico
    return NextResponse.json(
      { ok: false, error: 'Erro interno do servidor. Tente novamente.' },
      { status: 500 }
    )
  }
}
