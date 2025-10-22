// ===========================================
// EVENTOS DE ANALYTICS - STUDIA
// ===========================================

// Tipos de eventos
export type AnalyticsEvent =
  | 'lead_captured'
  | 'cta_clicked'
  | 'form_submitted'
  | 'email_validated'
  | 'page_view'

// Funções de tracking globais (declaradas no analytics.ts)
declare global {
  interface Window {
    trackLeadCapture: () => void
    trackCTAClick: () => void
    gtag: (...args: any[]) => void
  }
}

// Funções de tracking seguras
export const analytics = {
  // Rastrear captura de lead
  trackLeadCapture: () => {
    if (typeof window !== 'undefined' && window.trackLeadCapture) {
      window.trackLeadCapture()
    }
  },

  // Rastrear clique no CTA
  trackCTAClick: () => {
    if (typeof window !== 'undefined' && window.trackCTAClick) {
      window.trackCTAClick()
    }
  },

  // Rastrear evento customizado
  trackEvent: (eventName: string, parameters?: Record<string, any>) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', eventName, {
        ...parameters,
        page_location: window.location.href,
        page_title: document.title
      })
    }
  },

  // Rastrear conversão específica
  trackConversion: (conversionType: string, value?: number) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'conversion', {
        send_to: 'G-YZC8KBGXV9',
        conversion_type: conversionType,
        value: value,
        currency: 'BRL'
      })
    }
  }
}

// Hook para usar analytics em componentes React
export function useAnalytics() {
  return analytics
}

// Exemplo de uso nos componentes:
//
// import { useAnalytics } from '@/lib/analytics-events'
//
// function MyComponent() {
//   const { trackLeadCapture, trackCTAClick } = useAnalytics()
//
//   const handleFormSubmit = () => {
//     trackLeadCapture()
//     // ... resto da lógica
//   }
//
//   const handleCTA = () => {
//     trackCTAClick()
//     // ... resto da lógica
//   }
//
//   return (
//     <button onClick={handleCTA}>CTA Button</button>
//   )
// }
