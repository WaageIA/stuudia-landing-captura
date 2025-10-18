// Rate limiting simples usando Map (para desenvolvimento)
// Em produção, usar Redis ou similar
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

export interface RateLimitConfig {
  windowMs: number
  max: number
  message: string
}

const defaultConfig: RateLimitConfig = {
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 3, // máximo 3 tentativas por IP
  message: 'Muitas tentativas. Tente novamente em 1 hora.'
}

export function checkRateLimit(
  identifier: string, 
  config: RateLimitConfig = defaultConfig
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now()
  const windowStart = now - config.windowMs
  
  // Limpar entradas expiradas
  for (const [key, value] of rateLimitMap.entries()) {
    if (value.resetTime < now) {
      rateLimitMap.delete(key)
    }
  }
  
  const current = rateLimitMap.get(identifier)
  
  if (!current) {
    // Primeira tentativa
    rateLimitMap.set(identifier, {
      count: 1,
      resetTime: now + config.windowMs
    })
    
    return {
      allowed: true,
      remaining: config.max - 1,
      resetTime: now + config.windowMs
    }
  }
  
  if (current.resetTime < now) {
    // Reset do período
    rateLimitMap.set(identifier, {
      count: 1,
      resetTime: now + config.windowMs
    })
    
    return {
      allowed: true,
      remaining: config.max - 1,
      resetTime: now + config.windowMs
    }
  }
  
  if (current.count >= config.max) {
    // Limite excedido
    return {
      allowed: false,
      remaining: 0,
      resetTime: current.resetTime
    }
  }
  
  // Incrementar contador
  current.count++
  rateLimitMap.set(identifier, current)
  
  return {
    allowed: true,
    remaining: config.max - current.count,
    resetTime: current.resetTime
  }
}

// Função para obter identificador do cliente
export function getClientIdentifier(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  const userAgent = request.headers.get('user-agent') || ''
  
  const ip = forwarded?.split(',')[0] || realIp || 'unknown'
  
  // Combinar IP + User Agent para maior precisão
  return `${ip}-${userAgent.slice(0, 50)}`
}
