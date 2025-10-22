const { Resend } = require('resend')

const resend = new Resend(process.env.RESEND_API_KEY)

if (!process.env.RESEND_API_KEY) {
  throw new Error('Missing RESEND_API_KEY environment variable')
}

export { resend }

// Template de email CTA
export function getEmailTemplate(data: {
  name: string
  email: string
  whatsapp?: string
  origin: string
  leadId: string
}) {
  return {
    subject: 'Bem-vindo(a) ao StuudIA! 🎉',
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
                    <h2 style="margin: 0 0 20px 0; color: #1a1a1a; font-size: 28px; font-weight: 600;">Suas fotos de produto, em nível de estúdio! 🎯</h2>
                    
                    <p style="margin: 0 0 20px 0; color: #4a4a4a; font-size: 16px; line-height: 1.6;">
                      <strong>Parabéns, ${data.name}!</strong> Você acabou de dar o primeiro passo para revolucionar suas vendas.
                    </p>
                    
                    <p style="margin: 0 0 30px 0; color: #4a4a4a; font-size: 16px; line-height: 1.6;">
                      Transforme uma simples foto da sua peça em um ensaio profissional com Inteligência Artificial. 
                      <strong style="color: #b8ff00;">50 créditos grátis</strong> estão esperando por você para começar agora!
                    </p>
                    
                    <!-- CTA Button -->
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center" style="padding: 10px 0 30px 0;">
                          <a href="https://app.stuudia.com/login?lead=${data.leadId}&email=${encodeURIComponent(data.email)}" style="display: inline-block; background: linear-gradient(135deg, #b8ff00 0%, #9ae600 100%); color: #121212; text-decoration: none; padding: 18px 40px; border-radius: 50px; font-size: 18px; font-weight: 600; box-shadow: 0 8px 20px rgba(184, 255, 0, 0.35); transition: all 0.3s;">
                            🚀 PEGAR MEUS 50 CRÉDITOS GRÁTIS
                          </a>
                        </td>
                      </tr>
                    </table>
                    
                    <!-- Benefícios -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fff8; border-radius: 12px; padding: 30px; margin: 30px 0; border: 1px solid #e6ffe6;">
                      <tr>
                        <td>
                          <h3 style="margin: 0 0 20px 0; color: #1a1a1a; font-size: 20px; font-weight: 600;">🎯 Por que StuudIA vende 3x mais:</h3>
                          <table width="100%" cellpadding="8" cellspacing="0">
                            <tr>
                              <td style="color: #4a4a4a; font-size: 15px; line-height: 1.6;">📸 <strong>Foto que parece ter custado R$ 500 no fotógrafo</strong> - em menos de 1 minuto</td>
                            </tr>
                            <tr>
                              <td style="color: #4a4a4a; font-size: 15px; line-height: 1.6;">⚡ <strong>Processo completo = 30 segundos por peça</strong> - sem contratar modelo</td>
                            </tr>
                            <tr>
                              <td style="color: #4a4a4a; font-size: 15px; line-height: 1.6;">🎨 <strong>Iluminação profissional de estúdio</strong> - cores idênticas ao produto real</td>
                            </tr>
                            <tr>
                              <td style="color: #4a4a4a; font-size: 15px; line-height: 1.6;">💰 <strong>40 peças novas? = 20 minutos de trabalho</strong> - matematicamente viável</td>
                            </tr>
                          </table>
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
                
                <!-- Redes Sociais -->
                <tr>
                  <td style="background-color: #fafafa; padding: 30px 40px; text-align: center; border-top: 1px solid #e5e5e5;">
                    <p style="margin: 0 0 20px 0; color: #6b7280; font-size: 14px; font-weight: 600;">Siga-nos nas redes sociais:</p>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center">
                          <a href="https://www.instagram.com/stuudia" style="display: inline-block; margin: 0 10px; text-decoration: none;">
                            <img src="https://img.icons8.com/fluency/48/instagram-new.png" alt="Instagram" width="40" height="40" style="display: block; border-radius: 8px;"/>
                          </a>
                          <a href="https://www.tiktok.com/@stuudia" style="display: inline-block; margin: 0 10px; text-decoration: none;">
                            <img src="https://img.icons8.com/fluency/48/tiktok.png" alt="TikTok" width="40" height="40" style="display: block; border-radius: 8px;"/>
                          </a>
                          <a href="https://www.facebook.com/stuudia" style="display: inline-block; margin: 0 10px; text-decoration: none;">
                            <img src="https://img.icons8.com/fluency/48/facebook-new.png" alt="Facebook" width="40" height="40" style="display: block; border-radius: 8px;"/>
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="padding: 40px; text-align: center; border-top: 1px solid #e5e5e5;">
                    <p style="margin: 0 0 15px 0; color: #1a1a1a; font-size: 16px; font-weight: 600;">Precisa de ajuda?</p>
                    <p style="margin: 0 0 20px 0; color: #6b7280; font-size: 14px;">
                      <a href="mailto:suporte@stuudia.com" style="color: #b8ff00; text-decoration: none; font-weight: 500;">suporte@stuudia.com</a>
                      ${data.whatsapp ? ` • <a href="https://wa.me/5562987645654" style="color: #b8ff00; text-decoration: none; font-weight: 500;">WhatsApp Suporte</a>` : ''}
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
Suas fotos de produto, em nível de estúdio! 🎯

Parabéns, ${data.name}! Você acabou de dar o primeiro passo para revolucionar suas vendas.

Transforme uma simples foto da sua peça em um ensaio profissional com Inteligência Artificial. 50 créditos grátis estão esperando por você para começar agora!

🚀 PEGAR MEUS 50 CRÉDITOS GRÁTIS:
https://app.stuudia.com/login?lead=${data.leadId}&email=${encodeURIComponent(data.email)}

🎯 Por que StuudIA vende 3x mais:
📸 Foto que parece ter custado R$ 500 no fotógrafo - em menos de 1 minuto
⚡ Processo completo = 30 segundos por peça - sem contratar modelo
🎨 Iluminação profissional de estúdio - cores idênticas ao produto real
💰 40 peças novas? = 20 minutos de trabalho - matematicamente viável

Seus dados:
- Nome: ${data.name}
- Email: ${data.email}
${data.whatsapp ? `- WhatsApp: ${data.whatsapp}` : ''}
- Origem: ${data.origin}

---
Siga-nos nas redes sociais:
Instagram: https://www.instagram.com/stuudia
TikTok: https://www.tiktok.com/@stuudia
Facebook: https://www.facebook.com/stuudia

Precisa de ajuda?
Email: suporte@stuudia.com
WhatsApp: https://wa.me/5562987645654

---
Atenciosamente,
Equipe StuudIA

© 2025 StuudIA. Todos os direitos reservados.
Este email foi enviado porque você se cadastrou em nossa landing page.
Se não foi você, pode ignorar este email.
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
    const template = getEmailTemplate(data)
    
    const fromEmail = process.env.FROM_EMAIL || 'noreply@mail.stuudia.com'
    const senderName = process.env.EMAIL_SENDER_NAME || 'StuudIA'
    const result = await resend.emails.send({
      from: `${senderName} <${fromEmail}>`,
      to: [data.email],
      subject: template.subject,
      html: template.html,
      text: template.text,
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
