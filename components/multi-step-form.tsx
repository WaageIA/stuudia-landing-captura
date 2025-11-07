"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  ArrowRight,
  ArrowLeft,
  Check,
  Sparkles,
  AlertCircle,
  AlertTriangle,
  User,
  Phone,
  Instagram,
  Facebook,
  Linkedin,
  Loader2,
} from "lucide-react"

type FormData = {
  name: string
  email: string
  hasStore: boolean | null // Added to track if user has a store
  salesChannels: string[]
  whatsapp: string
  acceptTerms: boolean
}

type ValidationErrors = {
  name?: string
  email?: string
  emailBusiness?: string // Erros de negócio (email já cadastrado)
  whatsapp?: string
  salesChannels?: string
  hasStore?: string // Added validation for store question
}

const SALES_CHANNEL_OPTIONS = ["Instagram", "Site Próprio", "Marketplace", "Shopping", "Loja Física", "Outros"]

interface MultiStepFormProps {
  refCode?: string
}

export function MultiStepForm({ refCode }: MultiStepFormProps) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    hasStore: null, // Initialize as null
    salesChannels: [],
    whatsapp: "",
    acceptTerms: false,
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [emailChecking, setEmailChecking] = useState(false)

  const totalSteps = 2

  // Função de debounce para verificação de email
  const debounce = useCallback((func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout
    return (...args: any[]) => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => func.apply(null, args), delay)
    }
  }, [])

  const checkEmailRealtime = useCallback(
    debounce(async (email: string) => {
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return
      
      setEmailChecking(true)
      try {
        const res = await fetch(`/bonus-gratis/api/leads/check-email?email=${encodeURIComponent(email)}`)
        const data = await res.json()
        
        if (!data.available) {
          setErrors(prev => ({ ...prev, emailBusiness: 'Este email já está cadastrado. Use outro email ou faça login.' }))
        } else {
          setErrors(prev => ({ ...prev, emailBusiness: undefined }))
        }
      } catch (err) {
        console.error('Email check failed:', err)
      } finally {
        setEmailChecking(false)
      }
    }, 500),
    [debounce]
  )

  const validateField = (field: keyof FormData, value: string | boolean | string[] | null): string | undefined => {
    switch (field) {
      case "name":
        if (typeof value === "string") {
          if (value.length === 0) return "Nome é obrigatório"
          if (value.length < 3) return "Nome deve ter pelo menos 3 caracteres"
          if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(value)) return "Nome deve conter apenas letras"
        }
        break
      case "email":
        if (typeof value === "string") {
          if (value.length === 0) return "E-mail é obrigatório"
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "E-mail inválido"
        }
        break
      case "whatsapp":
        if (typeof value === "string") {
          const cleanPhone = value.replace(/\D/g, "")
          if (cleanPhone.length === 0) return "WhatsApp é obrigatório"
          if (cleanPhone.length < 10) return "WhatsApp deve ter pelo menos 10 dígitos"
          if (cleanPhone.length > 11) return "WhatsApp inválido"
          // Validate DDD (first 2 digits should be valid Brazilian area codes)
          const ddd = Number.parseInt(cleanPhone.substring(0, 2))
          if (ddd < 11 || ddd > 99) return "DDD inválido"
        }
        break
      case "hasStore":
        if (value === null) return "Por favor, selecione uma opção"
        break
      case "salesChannels":
        if (formData.hasStore === true && Array.isArray(value) && value.length === 0) {
          return "Selecione pelo menos um canal de venda"
        }
        break
    }
    return undefined
  }

  const formatWhatsApp = (value: string): string => {
    const cleaned = value.replace(/\D/g, "")
    if (cleaned.length <= 10) {
      return cleaned.replace(/(\d{2})(\d{4})(\d{0,4})/, (_, p1, p2, p3) => {
        let formatted = `(${p1}`
        if (p2) formatted += `) ${p2}`
        if (p3) formatted += `-${p3}`
        return formatted
      })
    }
    return cleaned.replace(/(\d{2})(\d{5})(\d{0,4})/, (_, p1, p2, p3) => {
      let formatted = `(${p1}`
      if (p2) formatted += `) ${p2}`
      if (p3) formatted += `-${p3}`
      return formatted
    })
  }

  const updateFormData = (field: keyof FormData, value: string | boolean | string[] | null) => {
    let processedValue = value

    if (field === "whatsapp" && typeof value === "string") {
      processedValue = formatWhatsApp(value)
    }

    if (field === "hasStore" && value === false) {
      setFormData((prev) => ({ ...prev, hasStore: false, salesChannels: [] }))
      setErrors((prev) => ({ ...prev, salesChannels: undefined }))
      return
    }

    setFormData((prev) => ({ ...prev, [field]: processedValue }))

    if (touched[field]) {
      const error = validateField(field, processedValue)
      setErrors((prev) => ({ ...prev, [field]: error }))
    }
  }

  const handleBlur = (field: keyof FormData) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
    const error = validateField(field, formData[field])
    setErrors((prev) => ({ ...prev, [field]: error }))
  }

  const toggleSalesChannel = (channel: string) => {
    const newChannels = formData.salesChannels.includes(channel)
      ? formData.salesChannels.filter((c) => c !== channel)
      : [...formData.salesChannels, channel]

    updateFormData("salesChannels", newChannels)

    if (touched.salesChannels) {
      const error = validateField("salesChannels", newChannels)
      setErrors((prev) => ({ ...prev, salesChannels: error }))
    }
  }

  const nextStep = () => {
    if (step === 1) {
      const nameError = validateField("name", formData.name)
      const emailError = validateField("email", formData.email)
      const whatsappError = validateField("whatsapp", formData.whatsapp)

      if (nameError || emailError || whatsappError) {
        setErrors({ name: nameError, email: emailError, whatsapp: whatsappError })
        setTouched({ name: true, email: true, whatsapp: true })
        return
      }
    }

    if (step < totalSteps) setStep(step + 1)
  }

  const prevStep = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleSubmit = async () => {
    try {
      // Automatically accept terms when submitting and include ref code as origin
      const dataToSubmit = {
        ...formData,
        acceptTerms: true,
        origin: refCode || 'organic_search' // Adiciona o ref como origin
      }

      const res = await fetch("/bonus-gratis/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSubmit),
      })

      if (!res.ok) {
        const j = await res.json().catch(() => null)
        throw new Error(j?.error || "Falha ao enviar os dados")
      }

      setIsSubmitted(true)
      
      // Track lead capture event
      if (typeof window !== 'undefined' && window.trackLeadCapture) {
        window.trackLeadCapture()
      }
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        whatsapp: (err as Error)?.message || "Não foi possível enviar. Tente novamente em instantes.",
      }))
      setTouched((prev) => ({ ...prev, whatsapp: true }))
    }
  }

  const isStepValid = () => {
    switch (step) {
      case 1:
        const hasValidName = formData.name.length > 2 && !errors.name
        const hasValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) && !errors.email && !errors.emailBusiness
        const hasValidWhatsApp = formData.whatsapp.replace(/\D/g, "").length >= 10 && !errors.whatsapp
        return hasValidName && hasValidEmail && hasValidWhatsApp
      default:
        return false
    }
  }

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card border border-primary/20 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden"
        role="alert"
        aria-live="polite"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent"
        />

        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
          className="inline-flex items-center justify-center w-24 h-24 bg-primary/10 rounded-full mb-6 relative"
          aria-hidden="true"
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            className="absolute inset-0 bg-primary/20 rounded-full"
          />
          <Check className="w-12 h-12 text-primary relative z-10" />
        </motion.div>

        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-3xl md:text-4xl font-bold mb-4"
        >
          Pronto! Seus 50 créditos estão garantidos.
        </motion.h3>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-lg md:text-xl text-muted-foreground mb-8"
        >
          Enviamos um e-mail para <span className="font-semibold text-foreground">{formData.email}</span> com as
          instruções para começar a usar o StuudIA.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-primary/5 border border-primary/20 rounded-2xl p-6 mb-8"
        >
          <p className="text-sm text-muted-foreground mb-4">Siga-nos nas redes sociais para dicas e novidades:</p>
          <div className="flex justify-center gap-4">
            <motion.a
              href="https://www.instagram.com/appstuudia/"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-12 h-12 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition-colors"
              aria-label="Siga-nos no Instagram"
            >
              <Instagram className="w-6 h-6 text-primary" />
            </motion.a>
            <motion.a
              href="https://www.facebook.com/profile.php?id=61582139489466&locale=pt_BR"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-12 h-12 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition-colors"
              aria-label="Siga-nos no Facebook"
            >
              <Facebook className="w-6 h-6 text-primary" />
            </motion.a>
            <motion.a
              href="#"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-12 h-12 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition-colors"
              aria-label="Siga-nos no LinkedIn"
            >
              <Linkedin className="w-6 h-6 text-primary" />
            </motion.a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7 }}
          className="inline-block"
          aria-hidden="true"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 10, 0] }}
            transition={{ duration: 0.6, repeat: Number.POSITIVE_INFINITY, repeatDelay: 3 }}
          >
            <Sparkles className="w-8 h-8 text-primary mx-auto" />
          </motion.div>
        </motion.div>
      </motion.div>
    )
  }

  return (
    <div className="bg-card border border-border rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 lg:p-12">
      <div
        className="mb-6 sm:mb-8 md:mb-10"
        role="progressbar"
        aria-valuenow={step}
        aria-valuemin={1}
        aria-valuemax={totalSteps}
      >
        <div className="flex justify-between mb-3 sm:mb-4">
          {[
            { num: 1, label: "Dados", icon: User },
            { num: 2, label: "Sucesso", icon: Check },
          ].map(({ num, label, icon: Icon }) => (
            <div key={num} className="flex flex-col items-center flex-1">
              <motion.div
                initial={{ scale: 0.8, opacity: 0.5 }}
                animate={{
                  scale: num <= step ? 1 : 0.8,
                  opacity: num <= step ? 1 : 0.5,
                }}
                transition={{ duration: 0.3 }}
                className={`flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full font-semibold mb-1 sm:mb-2 ${
                  num < step
                    ? "bg-primary text-primary-foreground"
                    : num === step
                      ? "bg-primary text-primary-foreground ring-2 sm:ring-4 ring-primary/20"
                      : "bg-secondary text-muted-foreground"
                }`}
                aria-label={`Etapa ${num}: ${label}`}
              >
                {num < step ? <Check className="w-4 h-4 sm:w-5 sm:h-5" /> : <Icon className="w-4 h-4 sm:w-5 sm:h-5" />}
              </motion.div>
              <span
                className={`text-[10px] sm:text-xs font-medium ${num <= step ? "text-foreground" : "text-muted-foreground"}`}
              >
                {label}
              </span>
            </div>
          ))}
        </div>
        <div className="h-2 bg-secondary rounded-full overflow-hidden">
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: `${(step / totalSteps) * 100}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="h-full bg-gradient-to-r from-primary to-primary/80"
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          {step === 1 && (
            <div className="space-y-5 sm:space-y-6">
              <div>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 text-balance">
                  Garanta seus 50 créditos grátis!
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">
                  Preencha os dados abaixo para começar a transformar suas fotos.
                </p>
              </div>

              <div>
                <Label htmlFor="name" className="text-sm sm:text-base font-semibold mb-2 block">
                  Nome completo
                </Label>
                <div className="relative">
                  <Input
                    id="name"
                    type="text"
                    placeholder="Ex: João Silva"
                    value={formData.name}
                    onChange={(e) => updateFormData("name", e.target.value)}
                    onBlur={() => handleBlur("name")}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        document.getElementById("email")?.focus()
                      }
                    }}
                    className={`h-12 sm:h-14 text-base sm:text-lg bg-background border-2 transition-all ${
                      errors.name && touched.name
                        ? "border-destructive focus-visible:ring-destructive"
                        : "border-border focus-visible:border-primary"
                    }`}
                    aria-invalid={errors.name && touched.name ? "true" : "false"}
                    aria-describedby={errors.name && touched.name ? "name-error" : undefined}
                    autoFocus
                  />
                  <AnimatePresence>
                    {errors.name && touched.name && (
                      <motion.div
                        id="name-error"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center gap-2 mt-2 text-destructive text-sm"
                        role="alert"
                      >
                        <AlertCircle className="w-4 h-4" />
                        <span>{errors.name}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <div>
                <Label htmlFor="email" className="text-sm sm:text-base font-semibold mb-2 block">
                  E-mail
                </Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={formData.email}
                    onChange={(e) => {
                      updateFormData("email", e.target.value)
                      checkEmailRealtime(e.target.value)
                    }}
                    onBlur={() => handleBlur("email")}
                    onKeyDown={(e) => e.key === "Enter" && isStepValid() && nextStep()}
                    className={`h-12 sm:h-14 text-base sm:text-lg bg-background border-2 transition-all pr-12 ${
                      errors.email && touched.email
                        ? "border-destructive focus-visible:ring-destructive"
                        : "border-border focus-visible:border-primary"
                    }`}
                    aria-invalid={errors.email && touched.email ? "true" : "false"}
                    aria-describedby={errors.email && touched.email ? "email-error" : undefined}
                  />
                  {emailChecking && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                    </div>
                  )}
                </div>
                <AnimatePresence>
                  {errors.email && touched.email && (
                    <motion.div
                      id="email-error"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center gap-2 mt-2 text-destructive text-sm"
                      role="alert"
                    >
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.email}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
                <AnimatePresence>
                  {errors.emailBusiness && touched.email && (
                    <motion.div
                      id="email-business-warning"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-start gap-2 mt-2 text-amber-600 text-sm bg-amber-50 border border-amber-200 rounded-md p-3"
                      role="alert"
                    >
                      <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <div>
                        {errors.emailBusiness.includes('faça login') ? (
                          <>
                            Este email já está cadastrado. Use outro email ou{' '}
                            <Button
                              variant="link"
                              className="p-0 h-auto text-amber-700 hover:text-amber-800 underline font-medium"
                              onClick={() => window.open('https://app.stuudia.com', '_blank')}
                            >
                              faça login
                            </Button>
                          </>
                        ) : (
                          <span>{errors.emailBusiness}</span>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div>
                <Label htmlFor="whatsapp" className="text-sm sm:text-base font-semibold mb-2 block">
                  WhatsApp (com DDD)
                </Label>
                <div className="relative">
                  <Input
                    id="whatsapp"
                    type="tel"
                    placeholder="(11) 99999-9999"
                    value={formData.whatsapp}
                    onChange={(e) => updateFormData("whatsapp", e.target.value)}
                    onBlur={() => handleBlur("whatsapp")}
                    onKeyDown={(e) => e.key === "Enter" && isStepValid() && nextStep()}
                    className={`h-12 sm:h-14 text-base sm:text-lg bg-background border-2 transition-all ${
                      errors.whatsapp && touched.whatsapp
                        ? "border-destructive focus-visible:ring-destructive"
                        : "border-border focus-visible:border-primary"
                    }`}
                    aria-invalid={errors.whatsapp && touched.whatsapp ? "true" : "false"}
                    aria-describedby={errors.whatsapp && touched.whatsapp ? "whatsapp-error" : "whatsapp-help"}
                    maxLength={15}
                  />
                  <AnimatePresence>
                    {errors.whatsapp && touched.whatsapp && (
                      <motion.div
                        id="whatsapp-error"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center gap-2 mt-2 text-destructive text-sm"
                        role="alert"
                      >
                        <AlertCircle className="w-4 h-4" />
                        <span>{errors.whatsapp}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <p id="whatsapp-help" className="text-sm text-muted-foreground mt-2">
                  Para enviarmos atualizações importantes
                </p>
              </div>
            </div>
          )}

        </motion.div>
      </AnimatePresence>

      <div className="flex flex-col gap-3 mt-6 sm:mt-8">
        {step === 1 ? (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex-1">
            <Button
              onClick={handleSubmit}
              disabled={!isStepValid()}
              size="lg"
              className="w-full h-12 sm:h-14 text-base sm:text-lg font-bold bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              aria-label="Liberar créditos grátis"
            >
              LIBERAR MEUS CRÉDITOS!
              <Sparkles className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            <p className="text-xs text-muted-foreground text-center mt-3 leading-relaxed">
              Ao continuar, você aceita automaticamente os{" "}
              <a href="#" className="text-primary hover:underline font-medium">
                termos de uso
              </a>{" "}
              e{" "}
              <a href="#" className="text-primary hover:underline font-medium">
                política de privacidade
              </a>
              .
            </p>
          </motion.div>
        ) : null}
      </div>
    </div>
  )
}
