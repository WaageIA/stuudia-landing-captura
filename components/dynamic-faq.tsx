"use client"

import { motion } from "framer-motion"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { HelpCircle } from "lucide-react"
import type { CMSFaqSection } from "@/lib/cms/types"

interface DynamicFaqProps {
  content: CMSFaqSection
}

export function DynamicFaq({ content }: DynamicFaqProps) {
  if (!content.isActive || !content.faqs?.length) {
    return null
  }

  // Filtrar e ordenar FAQs ativas
  const activeFaqs = content.faqs
    .filter(faq => faq.isActive)
    .sort((a, b) => a.order - b.order)

  if (activeFaqs.length === 0) {
    return null
  }

  // Agrupar por categoria se houver
  const groupedFaqs = activeFaqs.reduce((acc, faq) => {
    const category = faq.category || 'Geral'
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(faq)
    return acc
  }, {} as Record<string, typeof activeFaqs>)

  return (
    <section className="py-16 sm:py-20 md:py-24 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-6">
            <HelpCircle className="w-8 h-8 text-primary" />
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4">
            {content.title}
          </h2>
          {content.subtitle && (
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              {content.subtitle}
            </p>
          )}
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {Object.entries(groupedFaqs).map(([category, faqs], categoryIndex) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
              className="mb-8"
            >
              {Object.keys(groupedFaqs).length > 1 && (
                <h3 className="text-lg sm:text-xl font-semibold mb-6 text-primary">
                  {category}
                </h3>
              )}

              <Accordion type="single" collapsible className="space-y-4">
                {faqs.map((faq, faqIndex) => (
                  <AccordionItem
                    key={faq.id}
                    value={`${category}-${faq.id}`}
                    className="bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 px-6"
                  >
                    <AccordionTrigger className="text-left hover:no-underline py-6 text-sm sm:text-base font-medium">
                      <span className="pr-4">{faq.question}</span>
                    </AccordionTrigger>
                    <AccordionContent className="pb-6">
                      <div className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </motion.div>
          ))}
        </div>

        {/* Call to action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-12 sm:mt-16"
        >
          <div className="bg-primary/5 rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-lg sm:text-xl font-semibold mb-2">
              Ainda tem dúvidas?
            </h3>
            <p className="text-muted-foreground mb-6">
              Nossa equipe está pronta para ajudar você a tirar todas as dúvidas sobre o StuudIA.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:suporte@studia.com.br"
                className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors"
              >
                Falar com Suporte
              </a>
              <a
                href="https://wa.me/5562999999999"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                WhatsApp
              </a>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Background decorative elements */}
      <div className="absolute top-1/3 left-10 w-32 h-32 bg-primary/5 rounded-full blur-xl opacity-50" />
      <div className="absolute bottom-1/3 right-10 w-40 h-40 bg-primary/3 rounded-full blur-2xl opacity-30" />
    </section>
  )
}
