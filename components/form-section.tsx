"use client"

import { motion } from "framer-motion"
import { MultiStepForm } from "./multi-step-form"

interface FormSectionProps {
  refCode?: string
}

export function FormSection({ refCode }: FormSectionProps) {
  return (
    <section id="form-section" className="py-16 sm:py-20 md:py-24 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-12"
        >
          <h2 className="text-4xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 px-2">
            Comece agora com <span className="text-primary">50 créditos grátis</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground px-2">
            Preencha o formulário e receba seus créditos instantaneamente
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-2xl mx-auto"
        >
          <MultiStepForm refCode={refCode} />
        </motion.div>
      </div>
    </section>
  )
}
