// Funções de sanitização e segurança

export function sanitizeString(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove caracteres potencialmente perigosos
    .slice(0, 1000) // Limita tamanho
}

export function sanitizeEmail(email: string): string {
  return email
    .toLowerCase()
    .trim()
    .slice(0, 255) // Limita tamanho conforme schema do banco
}

export function sanitizePhone(phone: string): string {
  return phone
    .replace(/\D/g, '') // Remove tudo que não é dígito
    .slice(0, 15) // Limita tamanho
}

export function sanitizeObject(obj: Record<string, any>): Record<string, any> {
  const sanitized: Record<string, any> = {}
  
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeString(value)
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeObject(value)
    } else {
      sanitized[key] = value
    }
  }
  
  return sanitized
}

// Validação de origem contra lista permitida
const ALLOWED_ORIGINS = [
  'google_ads',
  'facebook_ads',
  'instagram_ads', 
  'linkedin_ads',
  'youtube_ads',
  'referral',
  'organic_search',
  'social_media',
  'email_marketing',
  'other'
] as const

export function validateOrigin(origin: string): boolean {
  return ALLOWED_ORIGINS.includes(origin as any)
}

// Função para detectar possíveis bots/spam
export function detectSuspiciousActivity(data: {
  name: string
  email: string
  whatsapp?: string
  userAgent?: string
}): { suspicious: boolean; reasons: string[] } {
  const reasons: string[] = []
  
  // Verificar padrões suspeitos no nome
  if (data.name.length < 2) {
    reasons.push('Nome muito curto')
  }
  
  if (/[0-9]{3,}/.test(data.name)) {
    reasons.push('Nome contém muitos números')
  }
  
  // Verificar padrões suspeitos no email
  if (data.email.includes('+') && data.email.split('+').length > 2) {
    reasons.push('Email com múltiplos sinais de mais')
  }
  
  if (data.email.split('@')[0].length < 2) {
    reasons.push('Email com prefixo muito curto')
  }
  
  // Verificar User Agent suspeito
  if (data.userAgent) {
    const suspiciousPatterns = [
      'bot', 'crawler', 'spider', 'scraper',
      'curl', 'wget', 'python-requests'
    ]
    
    const lowerUA = data.userAgent.toLowerCase()
    if (suspiciousPatterns.some(pattern => lowerUA.includes(pattern))) {
      reasons.push('User Agent suspeito')
    }
  }
  
  return {
    suspicious: reasons.length > 0,
    reasons
  }
}

// Função para gerar hash simples para fingerprinting
export function generateFingerprint(data: {
  userAgent: string
  acceptLanguage: string
  screenResolution?: string
}): string {
  const combined = `${data.userAgent}-${data.acceptLanguage}-${data.screenResolution || 'unknown'}`

  // Hash simples usando built-in crypto (Node.js)
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    // Em ambiente que suporta Web Crypto API
    return btoa(combined).slice(0, 16)
  }

  // Fallback simples
  let hash = 0
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32bit integer
  }

  return Math.abs(hash).toString(16).slice(0, 16)
}

// Validação específica para códigos de referência
export function validateRefCode(ref: string): boolean {
  if (!ref || typeof ref !== 'string') return false

  const cleanRef = ref.trim().toUpperCase()

  // Valores pré-definidos sempre válidos
  const predefinedOrigins = [
    'google_ads', 'facebook_ads', 'instagram_ads', 'linkedin_ads',
    'youtube_ads', 'referral', 'organic_search', 'social_media',
    'email_marketing', 'other'
  ]

  if (predefinedOrigins.includes(cleanRef.toLowerCase())) return true

  // Padrões para códigos dinâmicos
  return /^(REF_|VENDEDOR_)[A-Z0-9_]{3,20}$/.test(cleanRef)
}

// Sanitização específica para códigos de ref
export function sanitizeRefCode(ref: string): string {
  if (!ref) return 'organic_search'

  const cleanRef = ref
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9_]/g, '_') // Remove caracteres especiais
    .replace(/_{2,}/g, '_') // Remove underscores duplos
    .slice(0, 30) // Limita tamanho

  // Valida se está em formato correto
  if (validateRefCode(cleanRef)) {
    return cleanRef
  }

  // Fallback para casos inválidos
  console.warn('Ref code sanitized to fallback:', cleanRef, '-> referral')
  return 'referral'
}