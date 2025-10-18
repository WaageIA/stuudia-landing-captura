"use client"

import { motion } from "framer-motion"
import Image from "next/image"

export function Header() {
  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border"
    >
      <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-center">
        <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 400 }}>
          <Image
            src="/logo-studia-white.png"
            alt="StuudIA"
            width={140}
            height={32}
            priority
          />
        </motion.div>
      </div>
    </motion.header>
  )
}
