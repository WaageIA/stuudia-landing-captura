import { NextResponse } from "next/server"
import { createLeadCapture, checkEmailExists } from "@/lib/db/queries"
import { sanitizeEmail, sanitizeString, validateRefCode, sanitizeRefCode } from "@/lib/utils/security"
import { sendWelcomeEmail } from "@/lib/email/client"

export async function POST(req: Request) {
  try {
    const data = await req.json()
    const name = sanitizeString(data?.name || "")
    const email = sanitizeEmail(data?.email || "")
    const whatsapp = data?.whatsapp ? sanitizeString(data.whatsapp) : undefined
    const acceptTerms = data?.acceptTerms === true

    if (!name || !email || !whatsapp || !acceptTerms) {
      return NextResponse.json(
        { ok: false, error: "Campos obrigatórios ausentes ou termos não aceitos." },
        { status: 400 }
      )
    }

    // Verificar duplicidade
    const exists = await checkEmailExists(email)
    if (exists) {
      return NextResponse.json(
        { ok: false, error: "Este email já foi cadastrado.", code: "EMAIL_EXISTS" },
        { status: 409 }
      )
    }

    // Mapear campos do formulário legado para o schema de respostas
    const hasStore = Boolean(data?.hasStore)
    const salesChannels = Array.isArray(data?.salesChannels) ? data.salesChannels : []

    // Validação específica para ref/origin
    const rawOrigin = data?.origin || ''
    const sanitizedOrigin = validateRefCode(rawOrigin) ? rawOrigin : sanitizeRefCode(rawOrigin)

    const origin = sanitizedOrigin || (typeof (req as any).headers?.get === "function"
      ? ((req as any).headers.get("referer") ? "referral" : "other")
      : "other")

    const answers = {
      is_store_owner: hasStore,
      store_type: "none", // desconhecido no formulário legado
      current_tools: salesChannels,
      main_challenge: "product_photos", // default razoável
      budget_range: "under_100", // default
      timeline: "immediate" // default
    }

    // Criar lead
    const lead = await createLeadCapture({
      name,
      email,
      whatsapp,
      origin,
      answers,
      status: "pending",
    })

    // Enviar email
    const emailResult = await sendWelcomeEmail({
      name,
      email,
      whatsapp,
      origin,
      leadId: lead.id
    })

    // Log de auditoria com tracking de ref
    console.log('Lead captured with ref tracking:', {
      leadId: lead.id,
      email: email,
      origin: origin,
      refType: origin.startsWith('REF_') ? 'dynamic_ref' :
               origin.startsWith('VENDEDOR_') ? 'sales_ref' : 'predefined',
      timestamp: new Date().toISOString(),
      userAgent: req.headers.get('user-agent'),
      ip: req.headers.get('x-forwarded-for') || 'unknown'
    })

    return NextResponse.json({ ok: true, leadId: lead.id, emailSent: emailResult.success })
  } catch (err) {
    console.error("/api/lead error:", err)
    return NextResponse.json({ ok: false, error: "Erro interno ao processar o lead." }, { status: 500 })
  }
}


