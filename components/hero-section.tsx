"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowDown } from "lucide-react"

export function HeroSection() {
  const scrollToForm = () => {
    const formSection = document.getElementById("form-section")
    formSection?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          className="absolute -top-1/2 -left-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-primary/5 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
          }}
          transition={{
            duration: 15,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          className="absolute -bottom-1/2 -right-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-primary/5 rounded-full blur-3xl"
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-4 sm:mb-6 text-balance leading-tight">
              Suas fotos de produto, <span className="text-primary">em nível de estúdio.</span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground mb-6 sm:mb-8 max-w-3xl mx-auto text-balance px-2"
          >
            Transforme uma simples foto da sua peça em um ensaio profissional com Inteligência Artificial. Garanta{" "}
            <span className="text-primary font-semibold">50 créditos grátis</span> para começar agora.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mb-8 sm:mb-12 relative max-w-4xl mx-auto"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="relative rounded-2xl overflow-hidden bg-card border border-border p-3 sm:p-4"
              >
                <div className="absolute top-4 sm:top-6 left-4 sm:left-6 bg-background/80 backdrop-blur-sm px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium z-10">
                  Antes
                </div>
                <img
                  src="/simple-product-photo-on-white-background.jpg"
                  alt="Foto simples de produto antes do processamento"
                  className="w-full h-64 sm:h-72 md:h-80 object-cover rounded-xl"
                />
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="relative rounded-2xl overflow-hidden bg-card border border-primary/20 p-3 sm:p-4"
              >
                <div className="absolute top-4 sm:top-6 left-4 sm:left-6 bg-primary text-primary-foreground px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium z-10">
                  Depois
                </div>
                <img
                  src="/professional-product-photo-with-studio-lighting.jpg"
                  alt="Foto profissional de produto após processamento com IA"
                  className="w-full h-64 sm:h-72 md:h-80 object-cover rounded-xl"
                />
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <Button
              onClick={scrollToForm}
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 text-sm sm:text-base md:text-lg px-6 sm:px-8 py-5 sm:py-6 rounded-full font-semibold group"
              aria-label="Rolar para o formulário de cadastro"
            >
              QUERO MEUS 50 CRÉDITOS
              <motion.div animate={{ y: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}>
                <ArrowDown className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </motion.div>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
