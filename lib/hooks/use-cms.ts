import { useState, useEffect } from 'react'
import type { CMSContent } from '@/lib/cms/types'

interface UseCMSOptions {
  refresh?: boolean
  enabled?: boolean
}

interface UseCMSReturn {
  content: CMSContent | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
  clearCache: () => Promise<void>
}

export function useCMS(options: UseCMSOptions = {}): UseCMSReturn {
  const { refresh = false, enabled = true } = options

  const [content, setContent] = useState<CMSContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchContent = async (useCache = true) => {
    if (!enabled) return

    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/bonus-gratis/api/cms/content${!useCache ? '?refresh=true' : ''}`)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()

      if (data.ok) {
        setContent(data.data)
      } else {
        throw new Error(data.error || 'Erro ao buscar conteúdo do CMS')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido'
      setError(errorMessage)
      console.error('useCMS Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const refetch = async () => {
    await fetchContent(false)
  }

  const clearCache = async () => {
    try {
      const response = await fetch('/bonus-gratis/api/cms/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'clear_cache' }),
      })

      if (response.ok) {
        await fetchContent(false) // Recarregar conteúdo após limpar cache
      }
    } catch (err) {
      console.error('Error clearing CMS cache:', err)
    }
  }

  useEffect(() => {
    fetchContent(!refresh)
  }, [enabled, refresh])

  return {
    content,
    loading,
    error,
    refetch,
    clearCache
  }
}

// Hook específico para seções individuais
export function useCMSSection<T>(
  sectionKey: keyof CMSContent,
  options: UseCMSOptions = {}
): UseCMSReturn & { section: T | null } {
  const { content, loading, error, refetch, clearCache } = useCMS(options)

  const section = content ? content[sectionKey] as T : null

  return {
    content,
    section,
    loading,
    error,
    refetch,
    clearCache
  }
}

// Hook para health check
export function useCMSHealth() {
  const [health, setHealth] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const checkHealth = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/bonus-gratis/api/cms/health')
      const data = await response.json()

      setHealth(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro no health check'
      setError(errorMessage)
      console.error('useCMSHealth Error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkHealth()
  }, [])

  return {
    health,
    loading,
    error,
    refetch: checkHealth
  }
}
