"use client"

import { motion } from "framer-motion"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { useEffect, useState } from "react"
import { CTAButton } from "./cta-button"
import Image from "next/image"

// Array de imagens de comparação antes/depois
// Cada imagem já contém o antes e depois lado a lado
const beforeAfterExamples = [
  {
    id: 1,
    image: "/img-01.webp",
    alt: "Comparação antes e depois - Exemplo 1",
  },
  {
    id: 2,
    image: "/img-02.webp",
    alt: "Comparação antes e depois - Exemplo 2",
  },
  {
    id: 3,
    image: "/img-03.webp",
    alt: "Comparação antes e depois - Exemplo 3",
  },
  {
    id: 4,
    image: "/img-04.webp",
    alt: "Comparação antes e depois - Exemplo 4",
  },
  {
    id: 5,
    image: "/img-05.webp",
    alt: "Comparação antes e depois - Exemplo 5",
  },
  {
    id: 6,
    image: "/img-06.webp",
    alt: "Comparação antes e depois - Exemplo 6",
  },
]

export function HeroSection() {
  const [isMobile, setIsMobile] = useState(false)
  const [api, setApi] = useState<any>()

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Autoplay apenas no mobile
  useEffect(() => {
    if (!api || !isMobile) return

    const autoplay = setInterval(() => {
      api.scrollNext()
    }, 3000)

    return () => clearInterval(autoplay)
  }, [api, isMobile])

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
            className="mb-8 sm:mb-12 relative max-w-3xl mx-auto"
          >
            {/* Container com efeito fade nas pontas (desktop) */}
            <div className="relative">
              {/* Gradientes laterais para efeito fade no desktop */}
              <div className="hidden md:block absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
              <div className="hidden md:block absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
              
              <Carousel
                setApi={setApi}
                opts={{
                  align: "center",
                  loop: true,
                }}
                className="w-full"
              >
                <CarouselContent>
                  {beforeAfterExamples.map((example) => (
                    <CarouselItem key={example.id}>
                      <div className="px-2">
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          className="relative rounded-3xl overflow-hidden bg-card border border-border p-2 sm:p-3"
                        >
                          {/* Gradientes laterais para esfumaçar */}
                          <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-r from-background via-background/80 to-transparent z-10 pointer-events-none rounded-l-3xl" />
                          <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-l from-background via-background/80 to-transparent z-10 pointer-events-none rounded-r-3xl" />
                          
                          <Image
                            src={example.image}
                            alt={example.alt}
                            width={800}
                            height={480}
                            className="w-full h-80 sm:h-96 md:h-[420px] lg:h-[480px] object-cover rounded-2xl"
                            priority={example.id === 1}
                            quality={90}
                          />
                        </motion.div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                
                {/* Setas de navegação - visíveis apenas no desktop */}
                <CarouselPrevious className="hidden md:flex -left-12" />
                <CarouselNext className="hidden md:flex -right-12" />
              </Carousel>
              
              {/* Indicadores (dots) */}
              {beforeAfterExamples.length > 1 && (
                <div className="flex justify-center gap-2 mt-6">
                  {beforeAfterExamples.map((_, index) => (
                    <div
                      key={index}
                      className="w-2 h-2 rounded-full bg-muted-foreground/30"
                    />
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <CTAButton iconType="down" />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
