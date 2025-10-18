import { NextRequest, NextResponse } from 'next/server'
import { validateCheckEmail } from '@/lib/validation/schemas'
import { checkEmailExists } from '@/lib/db/queries'
import { checkRateLimit, getClientIdentifier } from '@/lib/utils/rate-limit'
import { sanitizeEmail } from '@/lib/utils/security'

export async function GET(request: NextRequest) {
  try {
    // Rate limiting mais restritivo para verificação de email
    const clientId = getClientIdentifier(request)
    const rateLimit = checkRateLimit(clientId, {
      windowMs: 15 * 60 * 1000, // 15 minutos
      max: 10, // máximo 10 verificações por IP
      message: 'Muitas verificações de email. Tente novamente em 15 minutos.'
    })
    
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { 
          ok: false, 
          error: 'Muitas verificações de email. Tente novamente em 15 minutos.',
          retryAfter: Math.ceil((rateLimit.resetTime - Date.now()) / 1000)
        },
        { status: 429 }
      )
    }

    // Extrair email da query string
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    if (!email) {
      return NextResponse.json(
        { ok: false, error: 'Parâmetro email é obrigatório' },
        { status: 400 }
      )
    }

    // Sanitização e validação
    const sanitizedEmail = sanitizeEmail(email)
    const validatedData = validateCheckEmail({ email: sanitizedEmail })

    // Verificar se email existe no banco
    const exists = await checkEmailExists(validatedData.email)

    // Log de auditoria
    console.log('Email check:', {
      email: validatedData.email,
      exists,
      clientId,
      timestamp: new Date().toISOString()
    })

    // Resposta
    return NextResponse.json({
      ok: true,
      available: !exists,
      email: validatedData.email,
      message: exists 
        ? 'Este email já está cadastrado' 
        : 'Email disponível',
      rateLimit: {
        remaining: rateLimit.remaining,
        resetTime: rateLimit.resetTime
      }
    })

  } catch (error) {
    console.error('Error checking email:', error)

    // Tratamento de erros específicos
    if (error instanceof Error) {
      if (error.message.includes('validation')) {
        return NextResponse.json(
          { ok: false, error: 'Email inválido' },
          { status: 400 }
        )
      }
      
      if (error.message.includes('Failed to check email')) {
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
