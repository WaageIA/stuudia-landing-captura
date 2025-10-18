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
}) {
  return {
    subject: 'Bem-vindo(a) ao Meu Studio AI! 🎉',
    html: `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Bem-vindo ao Meu Studio AI</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8f9fa;
          }
          .container {
            background: white;
            border-radius: 12px;
            padding: 40px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
          }
          .logo {
            font-size: 28px;
            font-weight: bold;
            color: #2563eb;
            margin-bottom: 10px;
          }
          .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #2563eb, #1d4ed8);
            color: white;
            padding: 16px 32px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            font-size: 18px;
            margin: 20px 0;
            box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
            transition: transform 0.2s;
          }
          .cta-button:hover {
            transform: translateY(-2px);
          }
          .data-section {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
          }
          .data-item {
            margin: 8px 0;
            font-size: 14px;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            color: #6b7280;
            font-size: 14px;
          }
          @media (max-width: 600px) {
            .container {
              padding: 20px;
            }
            .cta-button {
              padding: 14px 28px;
              font-size: 16px;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">Meu Studio AI</div>
            <h1>Bem-vindo(a), ${data.name}! 🎉</h1>
          </div>
          
          <p>Obrigado por se interessar pelo <strong>Meu Studio AI</strong>!</p>
          
          <p>Você está a um passo de começar a criar imagens profissionais incríveis para seu negócio. Nossa IA vai transformar a forma como você produz conteúdo visual.</p>
          
          <div style="text-align: center;">
            <a href="${process.env.NEXT_PUBLIC_API_URL}/auth/signup?email=${encodeURIComponent(data.email)}" class="cta-button">
              CRIAR MINHA CONTA GRATUITA
            </a>
          </div>
          
          <div class="data-section">
            <h3 style="margin-top: 0;">Seus dados coletados:</h3>
            <div class="data-item"><strong>Nome:</strong> ${data.name}</div>
            <div class="data-item"><strong>Email:</strong> ${data.email}</div>
            ${data.whatsapp ? `<div class="data-item"><strong>WhatsApp:</strong> ${data.whatsapp}</div>` : ''}
            <div class="data-item"><strong>Origem:</strong> ${data.origin}</div>
          </div>
          
          <p><strong>O que você vai conseguir:</strong></p>
          <ul>
            <li>✨ Criar fotos de produtos profissionais em segundos</li>
            <li>🎨 Gerar modelos virtuais para suas peças</li>
            <li>📱 Produzir conteúdo para redes sociais</li>
            <li>🚀 Acelerar seu processo de criação visual</li>
          </ul>
          
          <div class="footer">
            <p>Atenciosamente,<br><strong>Equipe Meu Studio AI</strong></p>
            <p style="font-size: 12px; margin-top: 20px;">
              Este email foi enviado porque você se cadastrou em nossa landing page.
              <br>Se não foi você, pode ignorar este email.
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
Bem-vindo(a) ao Meu Studio AI! 🎉

Olá ${data.name},

Obrigado por se interessar pelo Meu Studio AI!

Para começar a criar suas imagens profissionais, acesse:
${process.env.NEXT_PUBLIC_API_URL}/auth/signup?email=${encodeURIComponent(data.email)}

Seus dados coletados:
- Nome: ${data.name}
- Email: ${data.email}
${data.whatsapp ? `- WhatsApp: ${data.whatsapp}` : ''}
- Origem: ${data.origin}

O que você vai conseguir:
✨ Criar fotos de produtos profissionais em segundos
🎨 Gerar modelos virtuais para suas peças
📱 Produzir conteúdo para redes sociais
🚀 Acelerar seu processo de criação visual

Atenciosamente,
Equipe Meu Studio AI
    `
  }
}

// Função para enviar email
export async function sendWelcomeEmail(data: {
  name: string
  email: string
  whatsapp?: string
  origin: string
}) {
  try {
    const template = getEmailTemplate(data)
    
    const result = await resend.emails.send({
      from: process.env.FROM_EMAIL || 'noreply@meustudioai.com',
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
