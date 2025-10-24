import { NextRequest, NextResponse } from 'next/server'
import { resend, getEmailTemplate } from '@/lib/email/client'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const to = typeof body?.to === 'string' ? body.to : process.env.TEST_EMAIL || ''
    const name = typeof body?.name === 'string' ? body.name : 'Teste'
    const origin = typeof body?.origin === 'string' ? body.origin : 'test_manual'

    if (!to) {
      return NextResponse.json({ ok: false, error: 'Informe um email destino em { to } ou defina TEST_EMAIL no .env.local' }, { status: 400 })
    }

    const tpl = getEmailTemplate({ name, email: to, origin })

    const senderName = process.env.EMAIL_SENDER_NAME || 'StuudIA'
    const result = await resend.emails.send({
      from: `${senderName} <${process.env.FROM_EMAIL || 'notificacoes@mail.stuudia.com'}>`,
      to: [to],
      subject: tpl.subject,
      html: tpl.html,
      text: tpl.text,
    })

    return NextResponse.json({ ok: true, messageId: result.data?.id || null })
  } catch (error) {
    console.error('Email test error:', error)
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 })
  }
}


