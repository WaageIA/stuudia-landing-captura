import { createSignupToken, SignupTokenPayload } from './token'

export async function generateSignupLink(leadId: string, email: string, baseUrl?: string): Promise<string> {
  console.log('🔗 Gerando link de signup para:', { leadId, email })

  const payload: SignupTokenPayload = {
    leadId,
    email,
    nonce: crypto.randomUUID() // Para uso único opcional
  }

  console.log('📦 Payload preparado:', { leadId: payload.leadId, email: payload.email, hasNonce: !!payload.nonce })

  const token = await createSignupToken(payload)
  const base = baseUrl || 'https://app.stuudia.com'

  const finalLink = `${base}/j/${token}`
  console.log('✅ Link gerado:', finalLink.substring(0, 50) + '...')

  return finalLink
}
