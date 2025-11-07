export const seoConfig = {
  site: {
    name: 'StuudIA',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.stuudia.com/bonus-gratis',
    description: 'Transforme fotos de celular em ensaios profissionais de estúdio com modelo IA em 30 segundos',
    keywords: [
      'fotos profissionais com IA',
      'modelo virtual para fotos',
      'ensaio fotográfico IA',
      'fotos de produto com modelo',
      'inteligência artificial fotos',
      'fotos de estúdio IA',
      'modelo IA realista',
      'fotos profissionais loja',
      'e-commerce fotos',
      'fotos de roupa profissional',
      'IA para moda',
      'fotos de produto vendas',
      'modelo virtual roupa',
      'fotos profissionais baratas',
      'ensaio fotográfico virtual',
      'StuudIA',
      'fotos de celular profissional',
      'modelo IA moda',
      'fotos de produto IA',
      'ensaio virtual'
    ]
  },
  social: {
    twitter: process.env.NEXT_PUBLIC_TWITTER_HANDLE || '@stuudia',
    instagram: process.env.NEXT_PUBLIC_INSTAGRAM_HANDLE || '@appstuudia',
    facebook: process.env.NEXT_PUBLIC_FACEBOOK_PAGE || 'https://www.facebook.com/profile.php?id=61582139489466'
  },
  contact: {
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'suporte@studia.com.br',
    whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '+5562999999999'
  },
  analytics: {
    gaId: process.env.NEXT_PUBLIC_GA_ID || 'G-YZC8KBGXV9',
    vercelAnalytics: process.env.VERCEL_ANALYTICS_ID
  }
}
