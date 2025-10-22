"use client"

import { motion } from "framer-motion"
import { LucideIcon } from "lucide-react"
import type { CMSFeaturesSection } from "@/lib/cms/types"

interface DynamicFeaturesProps {
  content: CMSFeaturesSection
}

export function DynamicFeatures({ content }: DynamicFeaturesProps) {
  if (!content.isActive || !content.features?.length) {
    return null
  }

  const getIconComponent = (iconName: string, iconType: string): LucideIcon | null => {
    if (iconType === 'custom') {
      // Para ícones customizados, você pode implementar uma lógica específica
      return null
    }

    // Import dinâmico de ícones do Lucide
    const icons: Record<string, LucideIcon> = {
      'Camera': require('lucide-react').Camera,
      'Zap': require('lucide-react').Zap,
      'Sparkles': require('lucide-react').Sparkles,
      'Star': require('lucide-react').Star,
      'Heart': require('lucide-react').Heart,
      'Shield': require('lucide-react').Shield,
      'Clock': require('lucide-react').Clock,
      'Users': require('lucide-react').Users,
      'CheckCircle': require('lucide-react').CheckCircle,
      'TrendingUp': require('lucide-react').TrendingUp,
    }

    return icons[iconName] || null
  }

  // Ordenar features por ordem
  const sortedFeatures = [...content.features]
    .filter(feature => feature.isActive)
    .sort((a, b) => a.order - b.order)

  return (
    <section className="py-16 sm:py-20 md:py-24 relative overflow-hidden bg-black">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 text-white">
            {content.title}
          </h2>
          {content.subtitle && (
            <p className="text-base sm:text-lg md:text-xl text-gray-400">
              {content.subtitle}
            </p>
          )}
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
          {sortedFeatures.map((feature, index) => {
            const IconComponent = getIconComponent(feature.icon, feature.iconType)

            return (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative"
              >
                <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 sm:p-8 h-full hover:bg-white/10 hover:border-white/20 transition-all duration-300">
                  {/* Gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="relative z-10">
                    {/* Icon */}
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-primary/20 transition-colors duration-300">
                      {IconComponent ? (
                        <IconComponent className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
                      ) : (
                        <div className="w-6 h-6 sm:w-7 sm:h-7 bg-primary rounded" />
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="text-lg sm:text-xl font-semibold text-white mb-2 sm:mb-3 group-hover:text-primary transition-colors duration-300">
                      {feature.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>

                  {/* Decorative elements */}
                  <div className="absolute top-4 right-4 w-2 h-2 bg-primary/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-4 left-4 w-1 h-1 bg-primary/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75" />
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Background decorative elements */}
      <div className="absolute top-1/4 left-10 w-32 h-32 bg-primary/5 rounded-full blur-xl opacity-50" />
      <div className="absolute bottom-1/4 right-10 w-40 h-40 bg-primary/3 rounded-full blur-xl opacity-30" />
    </section>
  )
}
