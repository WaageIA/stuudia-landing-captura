import { createSignupToken, SignupTokenPayload } from './token'

export async function generateSignupLink(leadId: string, email: string, baseUrl?: string): Promise<string> {
  const payload: SignupTokenPayload = {
    leadId,
    email,
    nonce: crypto.randomUUID() // Para uso único opcional
  }

  const token = await createSignupToken(payload)
  const base = baseUrl || 'https://app.stuudia.com'

  return `${base}/j/${token}`
}
