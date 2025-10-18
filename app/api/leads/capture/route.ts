import { NextRequest, NextResponse } from 'next/server'
import { validateLeadCapture } from '@/lib/validation/schemas'
import { createLeadCapture, checkEmailExists } from '@/lib/db/queries'
import { sendWelcomeEmail } from '@/lib/email/client'
import { checkRateLimit, getClientIdentifier } from '@/lib/utils/rate-limit'
import { sanitizeString, sanitizeEmail, detectSuspiciousActivity } from '@/lib/utils/security'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientId = getClientIdentifier(request)
    const rateLimit = checkRateLimit(clientId)
    
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { 
          ok: false, 
          error: 'Muitas tentativas. Tente novamente em 1 hora.',
          retryAfter: Math.ceil((rateLimit.resetTime - Date.now()) / 1000)
        },
        { status: 429 }
      )
    }

    // Parse e validação dos dados
    const body = await request.json()
    
    // Sanitização básica
    const sanitizedBody = {
      ...body,
      name: sanitizeString(body.name || ''),
      email: sanitizeEmail(body.email || ''),
      whatsapp: body.whatsapp ? sanitizeString(body.whatsapp) : undefined,
      origin: sanitizeString(body.origin || ''),
      answers: body.answers || {}
    }

    // Validação com Zod
    const validatedData = validateLeadCapture(sanitizedBody)

    // Verificar se email já existe
    const emailExists = await checkEmailExists(validatedData.email)
    if (emailExists) {
      return NextResponse.json(
        { 
          ok: false, 
          error: 'Este email já foi cadastrado. Use outro email ou faça login.',
          code: 'EMAIL_EXISTS'
        },
        { status: 409 }
      )
    }

    // Detecção de atividade suspeita
    const userAgent = request.headers.get('user-agent') || ''
    const suspiciousCheck = detectSuspiciousActivity({
      name: validatedData.name,
      email: validatedData.email,
      whatsapp: validatedData.whatsapp,
      userAgent
    })

    if (suspiciousCheck.suspicious) {
      console.warn('Suspicious activity detected:', {
        email: validatedData.email,
        reasons: suspiciousCheck.reasons,
        clientId
      })
      
      // Para desenvolvimento, apenas log. Em produção, pode bloquear
      // return NextResponse.json(
      //   { ok: false, error: 'Atividade suspeita detectada' },
      //   { status: 400 }
      // )
    }

    // Criar lead no banco
    const lead = await createLeadCapture({
      name: validatedData.name,
      email: validatedData.email,
      whatsapp: validatedData.whatsapp || undefined,
      origin: validatedData.origin,
      answers: validatedData.answers,
      status: 'pending'
    })

    // Enviar email de boas-vindas
    const emailResult = await sendWelcomeEmail({
      name: validatedData.name,
      email: validatedData.email,
      whatsapp: validatedData.whatsapp,
      origin: validatedData.origin
    })

    // Log de auditoria
    console.log('Lead captured successfully:', {
      leadId: lead.id,
      email: validatedData.email,
      origin: validatedData.origin,
      emailSent: emailResult.success,
      clientId,
      timestamp: new Date().toISOString()
    })

    // Resposta de sucesso
    return NextResponse.json({
      ok: true,
      leadId: lead.id,
      emailSent: emailResult.success,
      message: 'Lead capturado com sucesso! Verifique seu email para continuar.',
      rateLimit: {
        remaining: rateLimit.remaining,
        resetTime: rateLimit.resetTime
      }
    })

  } catch (error) {
    console.error('Error in lead capture:', error)

    // Tratamento de erros específicos
    if (error instanceof Error) {
      if (error.message.includes('validation')) {
        return NextResponse.json(
          { ok: false, error: 'Dados inválidos. Verifique os campos e tente novamente.' },
          { status: 400 }
        )
      }
      
      if (error.message.includes('Failed to create lead')) {
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
