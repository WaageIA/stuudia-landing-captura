import { supabaseAdmin, LeadCapture, LeadCaptureInsert } from './client'

// Criar um novo lead
export async function createLeadCapture(data: LeadCaptureInsert): Promise<LeadCapture> {
  const { data: lead, error } = await supabaseAdmin
    .from('lead_captures')
    .insert([data])
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to create lead: ${error.message}`)
  }

  return lead
}

// Verificar se email já existe (leads + auth)
export async function checkEmailExists(email: string): Promise<boolean> {
  // Verificar na tabela lead_captures
  const { data: leadData, error: leadError } = await supabaseAdmin
    .from('lead_captures')
    .select('id')
    .eq('email', email)
    .single()

  if (leadError && leadError.code !== 'PGRST116') {
    throw new Error(`Failed to check lead email: ${leadError.message}`)
  }

  // Verificar na tabela auth.users
  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.listUsers({
    page: 1,
    perPage: 1000, // Aumentar limite para buscar todos
  })

  if (authError) {
    throw new Error(`Failed to check auth email: ${authError.message}`)
  }

  const userExists = authData.users.some(user => user.email === email)

  return !!(leadData || userExists)
}

// Buscar lead por email
export async function getLeadByEmail(email: string): Promise<LeadCapture | null> {
  const { data, error } = await supabaseAdmin
    .from('lead_captures')
    .select('*')
    .eq('email', email)
    .single()

  if (error && error.code !== 'PGRST116') {
    throw new Error(`Failed to get lead: ${error.message}`)
  }

  return data
}

// Atualizar status do lead
export async function updateLeadStatus(
  email: string, 
  status: LeadCapture['status'],
  timestamp?: string
): Promise<LeadCapture> {
  const updateData: Partial<LeadCapture> = { status }
  
  if (timestamp) {
    if (status === 'email_validated') {
      updateData.validated_at = timestamp
    } else if (status === 'converted') {
      updateData.converted_at = timestamp
    }
  }

  const { data, error } = await supabaseAdmin
    .from('lead_captures')
    .update(updateData)
    .eq('email', email)
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to update lead status: ${error.message}`)
  }

  return data
}

// Vincular lead com profile do usuário
export async function linkLeadWithProfile(email: string, userId: string): Promise<LeadCapture> {
  return updateLeadStatus(email, 'email_validated', new Date().toISOString())
}

// Buscar leads por status
export async function getLeadsByStatus(status: LeadCapture['status']): Promise<LeadCapture[]> {
  const { data, error } = await supabaseAdmin
    .from('lead_captures')
    .select('*')
    .eq('status', status)
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(`Failed to get leads by status: ${error.message}`)
  }

  return data || []
}

// Estatísticas básicas
export async function getLeadStats() {
  const { data, error } = await supabaseAdmin
    .from('lead_captures')
    .select('status, created_at')

  if (error) {
    throw new Error(`Failed to get lead stats: ${error.message}`)
  }

  const stats = {
    total: data?.length || 0,
    pending: data?.filter(l => l.status === 'pending').length || 0,
    email_validated: data?.filter(l => l.status === 'email_validated').length || 0,
    whatsapp_validated: data?.filter(l => l.status === 'whatsapp_validated').length || 0,
    converted: data?.filter(l => l.status === 'converted').length || 0,
  }

  return stats
}
