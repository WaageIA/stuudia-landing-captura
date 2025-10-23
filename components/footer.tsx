"use client"

import { motion } from "framer-motion"
import { Instagram, Facebook, Linkedin, Mail } from "lucide-react"
import Image from "next/image"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-border py-8 sm:py-10 md:py-12 bg-card/50">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 mb-6 sm:mb-8"
        >
          <div>
            <div className="mb-2 sm:mb-3">
              <Image
                src="/bonus-gratis/logo-studia-white.png"
                alt="StuudIA"
                width={160}
                height={36}
                priority
              />
            </div>
            <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
              Transforme Fotos de Celular em Ensaios Profissionais de Estúdio — Sem Fotógrafo, Sem Estúdio, Sem Complicação.
            </p>
          </div>

          <div>
            <h3 className="text-sm sm:text-base font-semibold mb-2 sm:mb-3">Links Rápidos</h3>
            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
              <li>
                <a href="#how-it-works" className="text-muted-foreground hover:text-primary transition-colors">
                  Como Funciona
                </a>
              </li>
              <li>
                <a href="#form-section" className="text-muted-foreground hover:text-primary transition-colors">
                  Contato
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm sm:text-base font-semibold mb-2 sm:mb-3">Redes Sociais</h3>
            <div className="flex gap-2 sm:gap-3">
              <motion.a
                href="https://www.instagram.com/appstuudia/"
                whileHover={{ scale: 1.1, y: -2 }}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4 sm:w-5 sm:h-5" />
              </motion.a>
              <motion.a
                href="https://www.facebook.com/profile.php?id=61582139489466&locale=pt_BR"
                whileHover={{ scale: 1.1, y: -2 }}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4 sm:w-5 sm:h-5" />
              </motion.a>
              <motion.a
                href="#"
                whileHover={{ scale: 1.1, y: -2 }}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4 sm:w-5 sm:h-5" />
              </motion.a>
              <motion.a
                href="#"
                whileHover={{ scale: 1.1, y: -2 }}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                aria-label="E-mail"
              >
                <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
              </motion.a>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="pt-6 sm:pt-8 border-t border-border text-center"
        >
          <p className="text-xs sm:text-sm text-muted-foreground">
            © {currentYear} StuudIA. Todos os direitos reservados.{" "}
            <a href="#" className="hover:text-primary transition-colors">
              Termos de Uso
            </a>{" "}
            •{" "}
            <a href="#" className="hover:text-primary transition-colors">
              Política de Privacidade
            </a>
          </p>
        </motion.div>
      </div>
    </footer>
  )
}
