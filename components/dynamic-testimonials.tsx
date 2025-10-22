"use client"

import { motion } from "framer-motion"
import { Star, Quote } from "lucide-react"
import { LazyImage } from "./lazy-image"
import type { CMSTestimonialsSection } from "@/lib/cms/types"

interface DynamicTestimonialsProps {
  content: CMSTestimonialsSection
}

export function DynamicTestimonials({ content }: DynamicTestimonialsProps) {
  if (!content.isActive || !content.testimonials?.length) {
    return null
  }

  // Filtrar e ordenar depoimentos ativos
  const activeTestimonials = content.testimonials
    .filter(testimonial => testimonial.isActive)
    .sort((a, b) => a.order - b.order)

  if (activeTestimonials.length === 0) {
    return null
  }

  return (
    <section className="py-16 sm:py-20 md:py-24 bg-gray-50 dark:bg-gray-900/50">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4">
            {content.title}
          </h2>
          {content.subtitle && (
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              {content.subtitle}
            </p>
          )}
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-7xl mx-auto">
          {activeTestimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative"
            >
              <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 h-full border border-gray-100 dark:border-gray-700">
                {/* Featured badge */}
                {testimonial.isFeatured && (
                  <div className="absolute -top-3 left-6 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                    Destaque
                  </div>
                )}

                {/* Quote icon */}
                <div className="absolute top-4 right-4 text-primary/20">
                  <Quote className="w-8 h-8" />
                </div>

                <div className="relative z-10">
                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-4">
                    {Array.from({ length: testimonial.rating }, (_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>

                  {/* Content */}
                  <blockquote className="text-sm sm:text-base text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                    "{testimonial.content}"
                  </blockquote>

                  {/* Author */}
                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    {testimonial.avatar ? (
                      <LazyImage
                        src={testimonial.avatar.url}
                        alt={testimonial.name}
                        width={48}
                        height={48}
                        className="w-12 h-12 rounded-full object-cover border-2 border-primary/20"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-primary font-semibold text-lg">
                          {testimonial.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}

                    {/* Author info */}
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {testimonial.role}
                        {testimonial.company && (
                          <span className="ml-1">• {testimonial.company}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hover effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
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
          <p className="text-sm text-muted-foreground mb-4">
            Junte-se a milhares de lojistas que já transformaram seus negócios
          </p>
          <div className="flex items-center justify-center gap-2">
            <div className="flex -space-x-2">
              {/* Placeholder avatars */}
              {Array.from({ length: 5 }, (_, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/60 border-2 border-white flex items-center justify-center text-white text-xs font-semibold"
                >
                  {String.fromCharCode(65 + i)}
                </div>
              ))}
            </div>
            <span className="text-sm text-muted-foreground ml-2">
              +2.500 lojistas já confiam no StuudIA
            </span>
          </div>
        </motion.div>
      </div>

      {/* Background decorative elements */}
      <div className="absolute top-1/4 right-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl opacity-50" />
      <div className="absolute bottom-1/4 left-10 w-48 h-48 bg-primary/3 rounded-full blur-2xl opacity-30" />
    </section>
  )
}
