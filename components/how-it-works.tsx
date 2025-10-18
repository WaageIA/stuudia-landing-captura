"use client"

import { motion } from "framer-motion"
import { Camera, Zap, Sparkles } from "lucide-react"

const steps = [
  {
    icon: Camera,
    step: "PASSO 1",
    title: "Você fotografa",
    description: "Com qualquer celular. Pode ser com a luz que tiver. Pode ser na correria. Não precisa ser perfeita.",
  },
  {
    icon: Zap,
    step: "PASSO 2",
    title: "A IA faz a mágica",
    description: "Remove o fundo bagunçado, cria iluminação profissional de estúdio e garante que as cores fiquem idênticas ao produto real.",
  },
  {
    icon: Sparkles,
    step: "PASSO 3",
    title: "Pronto para vender",
    description: "Foto que parece ter custado R$ 500 no fotógrafo. Em menos de 1 minuto. No seu celular.",
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16 sm:py-20 md:py-24 relative overflow-hidden bg-black">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 text-white">
            É fácil e rápido
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-400">
            Transforme suas fotos em 3 passos simples
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="relative"
            >
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 sm:p-10 text-center h-full backdrop-blur-sm">
                {/* Ícone circular com fundo verde-limão */}
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                  className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-lime-500/20 rounded-full mb-6"
                >
                  <step.icon className="w-8 h-8 sm:w-10 sm:h-10 text-lime-400" />
                </motion.div>
                
                {/* Label PASSO X */}
                <p className="text-lime-400 text-sm font-semibold mb-3 tracking-wider">
                  {step.step}
                </p>
                
                {/* Título principal */}
                <h3 className="text-xl sm:text-2xl font-bold mb-4 text-white">
                  {step.title}
                </h3>
                
                {/* Descrição */}
                <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Linha divisória vertical entre cards */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -translate-y-1/2 right-0 w-px h-32 bg-gradient-to-b from-transparent via-zinc-700 to-transparent" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
