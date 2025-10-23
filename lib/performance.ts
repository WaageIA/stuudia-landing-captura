import React from 'react'

// Lazy loading para componentes pesados
export const lazyLoadComponent = (importFunc: () => Promise<any>) => {
  return React.lazy(importFunc)
}

// Preload de recursos críticos
export const preloadCriticalResources = () => {
  if (typeof window !== 'undefined') {
    // Preload de fontes críticas
    const fontPreload = document.createElement('link')
    fontPreload.rel = 'preload'
    fontPreload.href = '/fonts/inter-var.woff2'
    fontPreload.as = 'font'
    fontPreload.type = 'font/woff2'
    fontPreload.crossOrigin = 'anonymous'
    document.head.appendChild(fontPreload)

    // Preload de imagens críticas
    const criticalImages = [
      '/bonus-gratis/img-01.webp',
      '/bonus-gratis/img-02.webp',
      '/bonus-gratis/logo-studia-white.png'
    ]

    criticalImages.forEach(src => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.href = src
      link.as = 'image'
      document.head.appendChild(link)
    })
  }
}

// Otimização de imagens
export const optimizeImage = (src: string, width?: number, quality = 80) => {
  const params = new URLSearchParams()
  if (width) params.set('w', width.toString())
  params.set('q', quality.toString())
  
  return `${src}?${params.toString()}`
}

// Hook para lazy loading de imagens
export const useLazyImage = (src: string, options?: IntersectionObserverInit) => {
  const [imageSrc, setImageSrc] = React.useState<string | null>(null)
  const [imageRef, setImageRef] = React.useState<HTMLImageElement | null>(null)

  React.useEffect(() => {
    if (!imageRef) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setImageSrc(src)
          observer.unobserve(imageRef)
        }
      },
      options
    )

    observer.observe(imageRef)

    return () => {
      if (imageRef) {
        observer.unobserve(imageRef)
      }
    }
  }, [imageRef, src, options])

  return [imageSrc, setImageRef] as const
}

// Debounce para otimizar eventos
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value)

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}
