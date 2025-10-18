import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { HowItWorks } from "@/components/how-it-works"
import { WhyWithModel } from "@/components/why-with-model"
import { FormSection } from "@/components/form-section"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <HowItWorks />
      <WhyWithModel />
      <FormSection />
      <Footer />
    </main>
  )
}
