"use client"

import { motion } from "framer-motion"
import { Camera, Palette, Wand2 } from "lucide-react"

const steps = [
  {
    icon: Camera,
    title: "FOTOGRAFE SUA PEÇA",
    description: "Tire uma foto nítida do seu produto.",
  },
  {
    icon: Palette,
    title: "ESCOLHA O ESTILO",
    description: "Selecione um dos nossos cenários profissionais.",
  },
  {
    icon: Wand2,
    title: "GERE A IMAGEM",
    description: "Nossa IA cria sua foto em segundos.",
  },
]

export function HowItWorks() {
  return (
    <section className="py-16 sm:py-20 md:py-24 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">É fácil e rápido</h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground">
            Transforme suas fotos em 3 passos simples
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              whileHover={{ y: -10 }}
              className="relative"
            >
              <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 text-center h-full">
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                  className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-primary/10 rounded-2xl mb-4 sm:mb-6"
                >
                  <step.icon className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
                </motion.div>
                <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">{step.title}</h3>
                <p className="text-sm sm:text-base text-muted-foreground">{step.description}</p>
              </div>

              {/* Connection line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-border" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
