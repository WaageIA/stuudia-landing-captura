'use client'

import Script from 'next/script'
import { useEffect } from 'react'

export function Analytics() {
  useEffect(() => {
    // Garantir que o atributo data-google-analytics-opt-out seja consistente
    if (typeof window !== 'undefined') {
      const htmlElement = document.documentElement
      if (!htmlElement.hasAttribute('data-google-analytics-opt-out')) {
        htmlElement.setAttribute('data-google-analytics-opt-out', '')
      }
    }
  }, [])

  return (
    <>
      {/* Google Analytics 4 - gtag.js */}
      <Script
        strategy="afterInteractive"
        src="https://www.googletagmanager.com/gtag/js?id=G-YZC8KBGXV9"
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-YZC8KBGXV9', {
              page_title: document.title,
              page_location: window.location.href,
              custom_map: {
                'custom_parameter_1': 'modelo_ia',
                'custom_parameter_2': 'fotos_profissionais'
              }
            });

            // Eventos específicos para StuudIA
            gtag('event', 'page_view', {
              page_title: 'StuudIA - Fotos Profissionais com IA',
              page_location: window.location.href,
              content_group1: 'landing_page'
            });

            // Eventos de conversão
            function trackLeadCapture() {
              gtag('event', 'lead_captured', {
                event_category: 'engagement',
                event_label: 'bonus_gratis_page'
              });
            }

            function trackCTAClick() {
              gtag('event', 'cta_clicked', {
                event_category: 'conversion',
                event_label: 'bonus_gratis_page'
              });
            }

            // Expor funções globalmente
            window.trackLeadCapture = trackLeadCapture;
            window.trackCTAClick = trackCTAClick;
          `,
        }}
      />
    </>
  )
}
