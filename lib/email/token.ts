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
  // Timestamp mais robusto com validação
  const now = Math.floor(Date.now() / 1000)

  // Validação de sanidade do timestamp
  if (now < 1700000000 || now > 2000000000) {
    console.error('❌ Timestamp inválido detectado:', now, new Date(now * 1000).toISOString())
    throw new Error(`Timestamp inválido: ${now}`)
  }

  console.log('🕒 Gerando token com timestamp:', now, new Date(now * 1000).toISOString())

  const jwt = new SignJWT({
    leadId: payload.leadId,
    email: payload.email,
    ...(payload.nonce && { nonce: payload.nonce })
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt(now)
    .setExpirationTime(now + 24 * 60 * 60) // 24 horas
    .setIssuer('stuudia-signup')
    .setAudience('stuudia-app')

  const token = await jwt.sign(secret)
  console.log('✅ Token gerado com sucesso:', token.substring(0, 20) + '...')

  return token
}
