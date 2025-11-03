const { Resend } = require('resend')

const resend = new Resend(process.env.RESEND_API_KEY)

if (!process.env.RESEND_API_KEY) {
  throw new Error('Missing RESEND_API_KEY environment variable')
}

export { resend }

// Import functions from the new token system
import { generateSignupLink } from './links'

// Template de email CTA
export function getEmailTemplate(data: {
  name: string
  email: string
  whatsapp?: string
  origin: string
  leadId: string
  signupLink?: string // Novo parâmetro opcional para link com token
}) {
  return {
    subject: `Olá, ${data.name}. Seu acesso ao StuudIA`,
    html: `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Bem-vindo ao StuudIA</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
                
                <!-- Header com gradiente -->
                <tr>
                  <td style="background: linear-gradient(135deg, #121212 0%, #262626 100%); padding: 50px 40px; text-align: center;">
                    <h1 style="margin: 0; color: #b8ff00; font-size: 32px; font-weight: 700; letter-spacing: -0.5px;">StuudIA</h1>
                    <p style="margin: 10px 0 0 0; color: #f2f2f2; font-size: 16px; opacity: 0.95;">Crie imagens profissionais com IA</p>
                  </td>
                </tr>
                
                <!-- Conteúdo principal -->
                <tr>
                  <td style="padding: 50px 40px;">
                    <h2 style="margin: 0 0 20px 0; color: #1a1a1a; font-size: 24px; font-weight: 600;">Bem-vindo, ${data.name}</h2>
                    
                    <p style="margin: 0 0 16px 0; color: #4a4a4a; font-size: 16px; line-height: 1.6;">
                      Recebemos seu cadastro e reservamos seu acesso ao StuudIA.
                    </p>
                    
                    <p style="margin: 0 0 24px 0; color: #4a4a4a; font-size: 16px; line-height: 1.6;">
                      Para começar, acesse pelo link abaixo. Se tiver dúvidas, basta responder este e‑mail.
                    </p>
                    
                    <!-- CTA Button -->
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center" style="padding: 10px 0 30px 0;">
                          <a href="${data.signupLink || `https://app.stuudia.com/signup?lead=${data.leadId}&email=${encodeURIComponent(data.email)}`}" style="display: inline-block; background: #111111; color: #ffffff; text-decoration: none; padding: 12px 20px; border-radius: 8px; font-size: 16px; font-weight: 600;">
                            Acessar seu cadastro
                          </a>
                        </td>
                      </tr>
                    </table>
                    
                    <!-- Dados coletados -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="border-top: 2px solid #f0f0f0; padding-top: 30px; margin-top: 30px;">
                      <tr>
                        <td>
                          <p style="margin: 0 0 15px 0; color: #6b7280; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Seus dados:</p>
                          <table width="100%" cellpadding="5" cellspacing="0">
                            <tr>
                              <td style="color: #4a4a4a; font-size: 14px;"><strong>Nome:</strong> ${data.name}</td>
                            </tr>
                            <tr>
                              <td style="color: #4a4a4a; font-size: 14px;"><strong>Email:</strong> ${data.email}</td>
                            </tr>
                            ${data.whatsapp ? `<tr><td style="color: #4a4a4a; font-size: 14px;"><strong>WhatsApp:</strong> ${data.whatsapp}</td></tr>` : ''}
                            <tr>
                              <td style="color: #4a4a4a; font-size: 14px;"><strong>Origem:</strong> ${data.origin}</td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                    
                  </td>
                </tr>
                
                
                
                <!-- Footer -->
                <tr>
                  <td style="padding: 40px; text-align: center; border-top: 1px solid #e5e5e5;">
                    <p style="margin: 0 0 15px 0; color: #1a1a1a; font-size: 16px; font-weight: 600;">Precisa de ajuda?</p>
                    <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;">
                      Responda este e‑mail ou fale com a gente: <a href="mailto:contato@mail.stuudia.com" style="color: #111111; text-decoration: underline; font-weight: 500;">contato@mail.stuudia.com</a>
                    </p>
                    <p style="margin: 20px 0 0 0; color: #9ca3af; font-size: 12px; line-height: 1.5;">
                      © 2025 StuudIA. Todos os direitos reservados.<br>
                      Este email foi enviado porque você se cadastrou em nossa landing page.<br>
                      Se não foi você, pode ignorar este email.
                    </p>
                  </td>
                </tr>
                
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
    text: `
Olá, ${data.name}. Recebemos seu cadastro no StuudIA.

Acesse seu cadastro:
${data.signupLink || `https://app.stuudia.com/signup?lead=${data.leadId}&email=${encodeURIComponent(data.email)}`}

Se precisar de ajuda, basta responder este e‑mail.

Dados:
- Nome: ${data.name}
- Email: ${data.email}
${data.whatsapp ? `- WhatsApp: ${data.whatsapp}` : ''}
- Origem: ${data.origin}

© 2025 StuudIA. Este email foi enviado porque você se cadastrou em nossa landing page.
Se não foi você, ignore este email.
    `
  }
}

// Função para enviar email
export async function sendWelcomeEmail(data: {
  name: string
  email: string
  whatsapp?: string
  origin: string
  leadId: string
}) {
  try {
    // Gerar link seguro com token
    const signupLink = await generateSignupLink(data.leadId, data.email)

    // Passar o link gerado para o template
    const template = getEmailTemplate({
      ...data,
      signupLink
    })
    
    const fromEmail = process.env.FROM_EMAIL || 'notificacoes@mail.stuudia.com'
    const senderName = process.env.EMAIL_SENDER_NAME || 'StuudIA'
    const result = await resend.emails.send({
      from: `${senderName} <${fromEmail}>`,
      to: [data.email],
      subject: template.subject,
      html: template.html,
      text: template.text,
      reply_to: 'contato@mail.stuudia.com',
      headers: {
        'List-Unsubscribe': '<mailto:contato@mail.stuudia.com>'
      }
    })

    return {
      success: true,
      messageId: result.data?.id,
      error: null
    }
  } catch (error) {
    console.error('Error sending welcome email:', error)
    return {
      success: false,
      messageId: null,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}
