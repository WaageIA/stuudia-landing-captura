import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

// Cliente público (para operações do frontend)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Cliente com service role (para operações do backend)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Tipos para a tabela lead_captures
export interface LeadCapture {
  id: string
  email: string
  name: string
  whatsapp?: string
  origin: string
  answers: Record<string, any>
  status: 'pending' | 'email_validated' | 'whatsapp_validated' | 'converted'
  created_at: string
  validated_at?: string
  converted_at?: string
}

export interface LeadCaptureInsert {
  email: string
  name: string
  whatsapp?: string
  origin: string
  answers: Record<string, any>
  status?: 'pending' | 'email_validated' | 'whatsapp_validated' | 'converted'
}
