"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { CTAButton } from "./cta-button"
import { LazyImage } from "./lazy-image"
import type { CMSHeroSection } from "@/lib/cms/types"

interface DynamicHeroProps {
  content: CMSHeroSection
}

export function DynamicHero({ content }: DynamicHeroProps) {
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
    if (!api || !isMobile || !content.images?.length) return

    const autoplay = setInterval(() => {
      api.scrollNext()
    }, 3000)

    return () => clearInterval(autoplay)
  }, [api, isMobile, content.images])

  if (!content.isActive) {
    return null
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

      {/* Background Image */}
      {content.backgroundImage && (
        <div className="absolute inset-0 z-0">
          <LazyImage
            src={content.backgroundImage.url}
            alt={content.backgroundImage.alternativeText || "Background"}
            width={content.backgroundImage.width}
            height={content.backgroundImage.height}
            className="w-full h-full object-cover opacity-10"
            priority={true}
          />
        </div>
      )}

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-4 sm:mb-6 text-balance leading-tight">
              {content.title.split(' ').map((word, index) => {
                // Highlight specific words based on content
                if (word.toLowerCase().includes('estúdio') || word.toLowerCase().includes('profissional')) {
                  return (
                    <span key={index} className="text-primary">
                      {word}{' '}
                    </span>
                  )
                }
                return word + ' '
              })}
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground mb-6 sm:mb-8 max-w-3xl mx-auto text-balance px-2"
          >
            {content.subtitle}
          </motion.p>

          {/* Carousel de imagens */}
          {content.images && content.images.length > 0 && (
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
                    {content.images.map((image, index) => (
                      <CarouselItem key={image.id || index}>
                        <div className="px-2">
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="relative rounded-3xl overflow-hidden bg-card border border-border p-2 sm:p-3"
                          >
                            {/* Gradientes laterais para esfumaçar */}
                            <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-r from-background via-background/80 to-transparent z-10 pointer-events-none rounded-l-3xl" />
                            <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-l from-background via-background/80 to-transparent z-10 pointer-events-none rounded-r-3xl" />

                            <LazyImage
                              src={image.url}
                              alt={image.alternativeText || `Exemplo ${index + 1}`}
                              width={image.width}
                              height={image.height}
                              className="w-full h-80 sm:h-96 md:h-[420px] lg:h-[480px] object-cover rounded-2xl"
                              priority={index === 0}
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
                {content.images.length > 1 && (
                  <div className="flex justify-center gap-2 mt-6">
                    {content.images.map((_, index) => (
                      <div
                        key={index}
                        className="w-2 h-2 rounded-full bg-muted-foreground/30"
                      />
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <CTAButton
              iconType="down"
              text={content.ctaText || "Quero Fotos Profissionais Agora"}
              link={content.ctaLink}
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// Import necessário para o Carousel
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
