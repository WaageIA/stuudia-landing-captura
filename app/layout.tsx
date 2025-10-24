import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { SchemaMarkup } from "@/components/schema-markup"
import { Analytics as CustomAnalytics } from "@/lib/analytics"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

export const metadata: Metadata = {
  title: {
    default: "StuudIA - Transforme Fotos de Celular em Ensaios Profissionais com IA |",
    template: "%s | StuudIA"
  },
  description: "Transforme fotos de celular em ensaios profissionais de estúdio com modelo IA em 30 segundos. Sem fotógrafo, sem estúdio, sem complicação. Ganhe 50 créditos grátis!",
  keywords: [
    "fotos profissionais com IA",
    "modelo virtual para fotos",
    "ensaio fotográfico IA",
    "fotos de produto com modelo",
    "inteligência artificial fotos",
    "fotos de estúdio IA",
    "modelo IA realista",
    "fotos profissionais loja",
    "e-commerce fotos",
    "fotos de roupa profissional",
    "IA para moda",
    "fotos de produto vendas",
    "modelo virtual roupa",
    "fotos profissionais baratas",
    "ensaio fotográfico virtual",
    "StuudIA",
    "fotos de celular profissional",
    "modelo IA moda",
    "fotos de produto IA",
    "ensaio virtual"
  ],
  authors: [{ name: "StuudIA" }],
  creator: "StuudIA",
  publisher: "StuudIA",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://stuudia.com/bonus-gratis'),
  alternates: {
    canonical: '/bonus-gratis/',
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://stuudia.com/bonus-gratis',
    title: 'StuudIA - Transforme Fotos de Celular em Ensaios Profissionais com IA',
    description: 'Transforme fotos de celular em ensaios profissionais de estúdio com modelo IA em 30 segundos. Sem fotógrafo, sem estúdio, sem complicação.',
    siteName: 'StuudIA',
    images: [
      {
        url: '/bonus-gratis/og-image-stuudia.webp',
        width: 1200,
        height: 630,
        alt: 'StuudIA - Fotos Profissionais com Modelo IA',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'StuudIA - Fotos Profissionais com Modelo IA',
    description: 'Transforme fotos de celular em ensaios profissionais com modelo IA em 30 segundos.',
    images: ['/bonus-gratis/twitter-image-stuudia.webp'],
    creator: '@stuudia',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'seu-google-verification-code',
  },
  category: 'technology',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/bonus-gratis/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/bonus-gratis/android-chrome-192x192.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/bonus-gratis/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/bonus-gratis/favicon-16x16.png" />
        <link rel="manifest" href="/bonus-gratis/site.webmanifest" />
        <meta name="theme-color" content="#000000" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="facebook-domain-verification" content="sf6s9nx3hz29nek0q36k0r6vs542bd" />
      </head>
      <body className={`font-sans ${inter.variable} antialiased`}>
        <SchemaMarkup />
        <Suspense fallback={<div>Loading...</div>}>
          {children}
          <Analytics />
          <CustomAnalytics />
        </Suspense>
      </body>
    </html>
  )
}
