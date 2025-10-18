import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { HowItWorks } from "@/components/how-it-works"
import { WhyWithModel } from "@/components/why-with-model"
import { FormSection } from "@/components/form-section"
import { Footer } from "@/components/footer"
import { CTAButton } from "@/components/cta-button"

export default function Home() {
  return (
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
      <FormSection />
      <Footer />
    </main>
  )
}
