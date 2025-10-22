export function SchemaMarkup() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "StuudIA",
    "description": "Transforme fotos de celular em ensaios profissionais de estúdio com modelo IA em 30 segundos. Sem fotógrafo, sem estúdio, sem complicação.",
    "url": "https://stuudia.com",
    "applicationCategory": "PhotoEditingApplication",
    "operatingSystem": "Web, iOS, Android",
    "offers": [
      {
        "@type": "Offer",
        "name": "Plano Starter",
        "price": "97",
        "priceCurrency": "BRL",
        "description": "60 fotos por mês - 12 ensaios completos"
      },
      {
        "@type": "Offer", 
        "name": "Plano Pro",
        "price": "147",
        "priceCurrency": "BRL",
        "description": "150 fotos por mês - 24 ensaios completos"
      },
      {
        "@type": "Offer",
        "name": "Plano Premium", 
        "price": "197",
        "priceCurrency": "BRL",
        "description": "240 fotos por mês - 40 ensaios completos"
      }
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "150",
      "bestRating": "5",
      "worstRating": "1"
    },
    "featureList": [
      "Modelo IA realista",
      "Estúdio profissional virtual", 
      "Processamento em 30 segundos",
      "Fidelidade absoluta de cores",
      "Cenários personalizáveis",
      "Suporte em português"
    ],
    "screenshot": [
      {
        "@type": "ImageObject",
        "url": "https://stuudia.com/screenshot-1.jpg",
        "caption": "Antes e depois - Transformação com StuudIA"
      },
      {
        "@type": "ImageObject", 
        "url": "https://stuudia.com/screenshot-2.jpg",
        "caption": "Interface do StuudIA"
      }
    ],
    "author": {
      "@type": "Organization",
      "name": "StuudIA",
      "url": "https://stuudia.com"
    },
    "publisher": {
      "@type": "Organization",
      "name": "StuudIA",
      "url": "https://stuudia.com"
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
