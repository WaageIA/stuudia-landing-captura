"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowDown, ArrowRight } from "lucide-react"

interface CTAButtonProps {
  iconType?: "down" | "right"
  className?: string
}

export function CTAButton({ iconType = "down", className = "" }: CTAButtonProps) {
  const scrollToForm = () => {
    // Track CTA click event
    if (typeof window !== 'undefined' && window.trackCTAClick) {
      window.trackCTAClick()
    }
    
    const formSection = document.getElementById("form-section")
    formSection?.scrollIntoView({ behavior: "smooth" })
  }

  const Icon = iconType === "down" ? ArrowDown : ArrowRight

  const iconAnimation = iconType === "down" 
    ? { y: [0, 5, 0] }
    : { x: [0, 5, 0] }

  return (
    <Button
      onClick={scrollToForm}
      size="lg"
      className={`bg-primary text-primary-foreground hover:bg-primary/90 text-sm sm:text-base md:text-lg px-6 sm:px-8 py-5 sm:py-6 rounded-full font-semibold group ${className}`}
      aria-label="Rolar para o formulário de cadastro"
    >
      QUERO MEUS 50 CRÉDITOS
      <motion.div 
        animate={iconAnimation} 
        transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
      >
        <Icon className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
      </motion.div>
    </Button>
  )
}

