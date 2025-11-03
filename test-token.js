// Teste simples para verificar se as funções de token funcionam
const { SignJWT } = require('jose')

async function testToken() {
  try {
    const enc = new TextEncoder()
    const secret = enc.encode('test-secret')

    const jwt = new SignJWT({
      leadId: 'test-123',
      email: 'test@email.com'
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt(Math.floor(Date.now() / 1000))
      .setExpirationTime(Math.floor(Date.now() / 1000) + 24 * 60 * 60)

    const token = await jwt.sign(secret)
    console.log('✅ Token gerado com sucesso:', token.substring(0, 50) + '...')
    return true
  } catch (error) {
    console.error('❌ Erro ao gerar token:', error.message)
    return false
  }
}

testToken()
