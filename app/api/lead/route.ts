import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const data = await req.json()
    const { name, email, hasStore, salesChannels, whatsapp, acceptTerms } = data ?? {}

    if (!name || !email || !whatsapp || acceptTerms !== true) {
      return NextResponse.json(
        { ok: false, error: "Campos obrigatórios ausentes ou termos não aceitos." },
        { status: 400 }
      )
    }

    const webhook = process.env.LEAD_WEBHOOK_URL
    if (webhook) {
      await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "stuudia-landing",
          receivedAt: new Date().toISOString(),
          name,
          email,
          hasStore,
          salesChannels,
          whatsapp,
          acceptTerms,
        }),
      })
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false, error: "JSON inválido" }, { status: 400 })
  }
}


