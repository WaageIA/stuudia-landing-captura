"use client"

import { motion } from "framer-motion"
import { X, Check } from "lucide-react"

const problems = [
  "Contratar modelo + fotógrafo = R$ 800 a R$ 2.000 por sessão",
  "Agendar, coordenar, produzir = dias de trabalho",
  "Você tem 40 peças novas toda semana = matematicamente inviável",
  "Modelo física tem medidas específicas = nem toda roupa serve",
]

const solutions = [
  "Modelo IA profissional = incluída em cada foto",
  "Processo completo = 30 segundos por peça",
  "40 peças? = 20 minutos de trabalho",
  "Modelo se adapta = qualquer tamanho, qualquer estilo",
]

export function WhyWithModel() {
  return (
    <section className="py-16 sm:py-20 md:py-24 relative overflow-hidden bg-black">
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
        {/* Título principal */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
            Por Que Foto Com <span className="text-lime-400">StuudIA</span> Vende 3x Mais (E Agora Você Pode Ter Isso)
          </h2>
          <p className="text-base sm:text-lg text-gray-400">
            Vamos falar a verdade: você sempre soube que precisava de fotos com modelo.
          </p>
        </motion.div>

        {/* Seção de Problemas */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <h3 className="text-white text-lg sm:text-xl font-semibold mb-6 text-center">
            Mas até hoje era impossível porque:
          </h3>
          <div className="space-y-4">
            {problems.map((problem, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-center gap-4 bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4 sm:p-5"
              >
                <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                  <X className="w-5 h-5 sm:w-6 sm:h-6 text-red-400" />
                </div>
                <p className="text-white text-sm sm:text-base">{problem}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Seção de Soluções */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h3 className="text-lime-400 text-lg sm:text-xl font-semibold mb-6 text-center">
            Agora, com StudIA:
          </h3>
          <div className="space-y-4">
            {solutions.map((solution, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-center gap-4 bg-zinc-900/50 border-2 border-lime-500/30 rounded-2xl p-4 sm:p-5"
              >
                <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-lime-500/20 rounded-lg flex items-center justify-center">
                  <Check className="w-5 h-5 sm:w-6 sm:h-6 text-lime-400" />
                </div>
                <p className="text-white text-sm sm:text-base">{solution}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

