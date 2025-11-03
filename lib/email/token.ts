const { SignJWT } = require('jose')

const enc = new TextEncoder()

// Use uma variável de ambiente específica para tokens de email
const secret = enc.encode(process.env.EMAIL_LINK_SECRET || 'fallback-secret-change-in-production')

export interface SignupTokenPayload {
  leadId: string
  email: string
  nonce?: string // Opcional: para uso único
}

export async function createSignupToken(payload: SignupTokenPayload): Promise<string> {
  const now = Math.floor(Date.now() / 1000)

  const jwt = new SignJWT({
    leadId: payload.leadId,
    email: payload.email,
    ...(payload.nonce && { nonce: payload.nonce })
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt(now)
    .setExpirationTime(now + 60 * 60) // 1 hora
    .setIssuer('stuudia-signup')
    .setAudience('stuudia-app')

  return await jwt.sign(secret)
}
