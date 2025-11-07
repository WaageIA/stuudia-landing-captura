import { Suspense } from 'react'
import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { HowItWorks } from "@/components/how-it-works"
import { WhyWithModel } from "@/components/why-with-model"
import { FormSection } from "@/components/form-section"
import { Footer } from "@/components/footer"
import { CTAButton } from "@/components/cta-button"
import { sanitizeRefCode } from "@/lib/utils/security"

// Função para capturar e validar o parâmetro ref
function getValidatedRef(searchParams: URLSearchParams): string {
  const ref = searchParams.get('ref')

  if (!ref) return 'organic_search'

  // Usa a função de sanitização existente
  return sanitizeRefCode(ref)
}

interface HomeProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function Home({ searchParams }: HomeProps) {
  // Captura no servidor (mais seguro) - await necessário no Next.js 13+
  const searchParamsResolved = await searchParams
  const searchParamsObj = new URLSearchParams()
  Object.entries(searchParamsResolved).forEach(([key, value]) => {
    if (value) {
      searchParamsObj.set(key, Array.isArray(value) ? value[0] : value)
    }
  })

  const validatedRef = getValidatedRef(searchParamsObj)

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <main className="min-h-screen bg-background">
        <Header />
        <HeroSection />
        <HowItWorks />

        {/* CTA Section */}
        <section className="py-12 sm:py-16 bg-black">
          <div className="container mx-auto px-4 sm:px-6 text-center">
            <CTAButton iconType="down" />
          </div>
        </section>

        <WhyWithModel />
        <FormSection refCode={validatedRef} />
        <Footer />
      </main>
    </Suspense>
  )
}
