import { z } from 'zod'

// Schema para origem com suporte a códigos dinâmicos
const OriginSchema = z.union([
  // Valores pré-definidos (marketing)
  z.enum([
    'google_ads', 'facebook_ads', 'instagram_ads', 'linkedin_ads',
    'youtube_ads', 'instagram_link_bio', 'referral', 'organic_search',
    'social_media', 'email_marketing', 'other'
  ]),
  // Códigos dinâmicos de vendedores (formato: VENDEDOR_XXX ou REF_XXX)
  z.string().regex(/^REF_[A-Z0-9_]{3,20}$/, 'Código de referência inválido'),
  z.string().regex(/^VENDEDOR_[A-Z0-9_]{3,20}$/, 'Código de vendedor inválido')
], {
  errorMap: () => ({ message: 'Origem inválida' })
})

// Schema para captura de lead
export const LeadCaptureSchema = z.object({
  name: z.string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres')
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, 'Nome deve conter apenas letras e espaços'),

  email: z.string()
    .email('Email inválido')
    .max(255, 'Email muito longo'),

  whatsapp: z.string()
    .regex(/^\(\d{2}\)\s\d{4,5}-\d{4}$/, 'WhatsApp deve estar no formato (11) 99999-9999')
    .optional()
    .or(z.literal('')),

  origin: OriginSchema,
  
  answers: z.object({
    is_store_owner: z.boolean(),
    store_type: z.enum(['ecommerce', 'physical', 'both', 'none']),
    current_tools: z.array(z.string()).optional(),
    main_challenge: z.enum([
      'product_photos',
      'model_photos', 
      'marketing_images',
      'social_content'
    ]),
    budget_range: z.enum([
      'under_100',
      '100_500',
      '500_1000',
      'over_1000'
    ]),
    timeline: z.enum([
      'immediate',
      'this_month',
      'next_quarter',
      'later'
    ])
  })
})

// Schema para verificação de email
export const CheckEmailSchema = z.object({
  email: z.string().email('Email inválido')
})

// Schema para vinculação de profile
export const LinkProfileSchema = z.object({
  email: z.string().email('Email inválido'),
  user_id: z.string().min(1, 'User ID é obrigatório')
})

// Schema para atualização de status
export const UpdateStatusSchema = z.object({
  email: z.string().email('Email inválido'),
  status: z.enum(['pending', 'email_validated', 'whatsapp_validated', 'converted']),
  timestamp: z.string().optional()
})

// Tipos derivados dos schemas
export type LeadCaptureInput = z.infer<typeof LeadCaptureSchema>
export type CheckEmailInput = z.infer<typeof CheckEmailSchema>
export type LinkProfileInput = z.infer<typeof LinkProfileSchema>
export type UpdateStatusInput = z.infer<typeof UpdateStatusSchema>

// Função para validar dados de entrada
export function validateLeadCapture(data: unknown): LeadCaptureInput {
  return LeadCaptureSchema.parse(data)
}

export function validateCheckEmail(data: unknown): CheckEmailInput {
  return CheckEmailSchema.parse(data)
}

export function validateLinkProfile(data: unknown): LinkProfileInput {
  return LinkProfileSchema.parse(data)
}

export function validateUpdateStatus(data: unknown): UpdateStatusInput {
  return UpdateStatusSchema.parse(data)
}
