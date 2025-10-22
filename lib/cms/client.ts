import type { CMSContent, CMSConfig } from './types'
import { createStrapiClient } from './strapi'
// import { createContentfulClient } from './contentful' // Temporariamente comentado - dependência não instalada
import { createSmartCache, CacheWarmer } from './cache'

export class CMSClient {
  private config: CMSConfig
  private cache: ReturnType<typeof createSmartCache>
  private cacheWarmer: CacheWarmer

  constructor(config: CMSConfig) {
    this.config = config
    this.cache = createSmartCache()
    this.cacheWarmer = new CacheWarmer(this.cache)
  }

  private getCacheKey(method: string, params?: Record<string, any>): string {
    return `cms:${this.config.provider}:${method}${params ? `:${JSON.stringify(params)}` : ''}`
  }

  async getAllContent(useCache: boolean = true): Promise<CMSContent | null> {
    const cacheKey = this.getCacheKey('allContent')

    if (useCache) {
      const cached = await this.cache.get<CMSContent>(cacheKey)
      if (cached) {
        console.log('CMS: Using cached content')
        return cached
      }
    }

    let content: CMSContent | null = null

    try {
      if (this.config.provider === 'strapi') {
        const client = createStrapiClient(this.config.baseUrl, this.config.apiToken)
        content = await client.getAllContent()
      } else if (this.config.provider === 'contentful') {
        // Temporariamente desabilitado - dependência não instalada
        console.warn('CMS: Contentful provider temporarily disabled - dependency not installed')
        content = null
        // const client = createContentfulClient(
        //   this.config.spaceId,
        //   this.config.apiToken,
        //   this.config.environment
        // )
        // content = await client.getAllContent()
      } else {
        throw new Error(`Unsupported CMS provider: ${this.config.provider}`)
      }

      if (content && useCache) {
        // Cache por 5 minutos por padrão
        await this.cache.set(cacheKey, content, 5 * 60 * 1000)
        console.log('CMS: Content cached successfully')
      }

      return content
    } catch (error) {
      console.error('CMS: Error fetching content:', error)

      // Se falhou, tenta usar cache antigo mesmo se expirado
      if (useCache) {
        const cached = await this.cache.get<CMSContent>(cacheKey)
        if (cached) {
          console.log('CMS: Using stale cache due to error')
          return cached
        }
      }

      return null
    }
  }

  async clearCache(): Promise<void> {
    await this.cache.clear()
    console.log('CMS: Cache cleared')
  }

  async refreshContent(): Promise<CMSContent | null> {
    // Limpa cache e busca conteúdo novo
    await this.clearCache()
    return this.getAllContent(false)
  }

  // Cache warming methods
  async startAutoWarmup(intervalMinutes = 30) {
    this.cacheWarmer.startAutoWarmup(
      () => this.getAllContent(false),
      this.getCacheKey('allContent'),
      intervalMinutes
    )
  }

  async warmUpCache() {
    await this.cacheWarmer.warmUp(
      () => this.getAllContent(false),
      this.getCacheKey('allContent')
    )
  }

  // Health check
  async healthCheck(): Promise<{ status: 'ok' | 'error', provider: string, lastFetch?: number, cacheStats?: any }> {
    try {
      const content = await this.getAllContent(false)
      const cacheKey = this.getCacheKey('allContent')
      const cached = await this.cache.get(cacheKey)

      return {
        status: content ? 'ok' : 'error',
        provider: this.config.provider,
        lastFetch: (cached as any)?.timestamp,
        cacheStats: typeof (this.cache as any).getStats === 'function' ? (this.cache as any).getStats() : undefined
      }
    } catch (error) {
      return {
        status: 'error',
        provider: this.config.provider
      }
    }
  }
}

// Factory function to create CMS client based on environment variables
export function createCMSClient(): CMSClient {
  const provider = (process.env.CMS_PROVIDER || 'strapi') as 'strapi' | 'contentful'

  const config: CMSConfig = {
    provider,
    baseUrl: process.env.STRAPI_URL || '',
    apiToken: process.env.STRAPI_API_TOKEN,
    spaceId: process.env.CONTENTFUL_SPACE_ID,
    environment: process.env.CONTENTFUL_ENVIRONMENT || 'master'
  }

  // Validate configuration based on provider
  if (provider === 'strapi' && !config.baseUrl) {
    console.warn('CMS: STRAPI_URL not configured, using fallback')
  }

  if (provider === 'contentful' && (!config.spaceId || !config.apiToken)) {
    console.warn('CMS: CONTENTFUL_SPACE_ID or CONTENTFUL_ACCESS_TOKEN not configured, using fallback')
  }

  return new CMSClient(config)
}

// Default instance
export const cmsClient = createCMSClient()

// Export utility functions
export { createStrapiClient }
// export { createContentfulClient } // Temporariamente comentado - dependência não instalada
export type { CMSContent, CMSConfig }
