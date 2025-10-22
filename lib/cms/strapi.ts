import type {
  CMSContent,
  CMSHeroSection,
  CMSFeaturesSection,
  CMSTestimonialsSection,
  CMSHowItWorksSection,
  CMSPricingSection,
  CMSFaqSection,
  CMSCTASection,
  CMSSEO,
  CMSResponse,
  CMSListResponse
} from './types'

class StrapiClient {
  private baseUrl: string
  private apiToken?: string

  constructor(baseUrl: string, apiToken?: string) {
    this.baseUrl = baseUrl.replace(/\/$/, '') // Remove trailing slash
    this.apiToken = apiToken
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}/api${endpoint}`

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    }

    if (this.apiToken) {
      headers.Authorization = `Bearer ${this.apiToken}`
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      })

      if (!response.ok) {
        throw new Error(`Strapi API error: ${response.status} ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Strapi request failed:', error)
      throw error
    }
  }

  // Generic methods
  async find<T>(
    contentType: string,
    params?: {
      populate?: string | string[]
      filters?: Record<string, any>
      sort?: string[]
      pagination?: {
        page?: number
        pageSize?: number
      }
      publicationState?: 'live' | 'preview'
    }
  ): Promise<CMSListResponse<T>> {
    const searchParams = new URLSearchParams()

    if (params?.populate) {
      const populate = Array.isArray(params.populate)
        ? params.populate.join(',')
        : params.populate
      searchParams.set('populate', populate)
    }

    if (params?.filters) {
      searchParams.set('filters', JSON.stringify(params.filters))
    }

    if (params?.sort) {
      searchParams.set('sort', params.sort.join(','))
    }

    if (params?.pagination) {
      if (params.pagination.page) {
        searchParams.set('pagination[page]', params.pagination.page.toString())
      }
      if (params.pagination.pageSize) {
        searchParams.set('pagination[pageSize]', params.pagination.pageSize.toString())
      }
    }

    if (params?.publicationState) {
      searchParams.set('publicationState', params.publicationState)
    }

    const queryString = searchParams.toString()
    const endpoint = `/${contentType}${queryString ? `?${queryString}` : ''}`

    return this.request<CMSListResponse<T>>(endpoint)
  }

  async findOne<T>(
    contentType: string,
    id: string | number,
    params?: {
      populate?: string | string[]
      publicationState?: 'live' | 'preview'
    }
  ): Promise<CMSResponse<T>> {
    const searchParams = new URLSearchParams()

    if (params?.populate) {
      const populate = Array.isArray(params.populate)
        ? params.populate.join(',')
        : params.populate
      searchParams.set('populate', populate)
    }

    if (params?.publicationState) {
      searchParams.set('publicationState', params.publicationState)
    }

    const queryString = searchParams.toString()
    const endpoint = `/${contentType}/${id}${queryString ? `?${queryString}` : ''}`

    return this.request<CMSResponse<T>>(endpoint)
  }

  // Specific methods for StuudIA content types
  async getHeroSection(): Promise<CMSHeroSection | null> {
    try {
      const response = await this.find<CMSHeroSection>('hero-sections', {
        populate: ['backgroundImage', 'images'],
        filters: { isActive: true },
        publicationState: 'live'
      })

      return response.data[0] || null
    } catch (error) {
      console.error('Error fetching hero section:', error)
      return null
    }
  }

  async getFeaturesSection(): Promise<CMSFeaturesSection | null> {
    try {
      const response = await this.find<CMSFeaturesSection>('features-sections', {
        populate: ['features'],
        filters: { isActive: true },
        publicationState: 'live'
      })

      return response.data[0] || null
    } catch (error) {
      console.error('Error fetching features section:', error)
      return null
    }
  }

  async getTestimonialsSection(): Promise<CMSTestimonialsSection | null> {
    try {
      const response = await this.find<CMSTestimonialsSection>('testimonials-sections', {
        populate: ['testimonials', 'testimonials.avatar'],
        filters: { isActive: true },
        publicationState: 'live'
      })

      return response.data[0] || null
    } catch (error) {
      console.error('Error fetching testimonials section:', error)
      return null
    }
  }

  async getHowItWorksSection(): Promise<CMSHowItWorksSection | null> {
    try {
      const response = await this.find<CMSHowItWorksSection>('how-it-works-sections', {
        populate: ['steps', 'steps.image'],
        filters: { isActive: true },
        publicationState: 'live'
      })

      return response.data[0] || null
    } catch (error) {
      console.error('Error fetching how it works section:', error)
      return null
    }
  }

  async getPricingSection(): Promise<CMSPricingSection | null> {
    try {
      const response = await this.find<CMSPricingSection>('pricing-sections', {
        populate: ['plans'],
        filters: { isActive: true },
        publicationState: 'live'
      })

      return response.data[0] || null
    } catch (error) {
      console.error('Error fetching pricing section:', error)
      return null
    }
  }

  async getFaqSection(): Promise<CMSFaqSection | null> {
    try {
      const response = await this.find<CMSFaqSection>('faq-sections', {
        populate: ['faqs'],
        filters: { isActive: true },
        publicationState: 'live'
      })

      return response.data[0] || null
    } catch (error) {
      console.error('Error fetching FAQ section:', error)
      return null
    }
  }

  async getCTASection(): Promise<CMSCTASection | null> {
    try {
      const response = await this.find<CMSCTASection>('cta-sections', {
        populate: ['backgroundImage'],
        filters: { isActive: true },
        publicationState: 'live'
      })

      return response.data[0] || null
    } catch (error) {
      console.error('Error fetching CTA section:', error)
      return null
    }
  }

  async getSEO(): Promise<CMSSEO | null> {
    try {
      const response = await this.find<CMSSEO>('seos', {
        populate: ['ogImage', 'twitterImage'],
        publicationState: 'live'
      })

      return response.data[0] || null
    } catch (error) {
      console.error('Error fetching SEO data:', error)
      return null
    }
  }

  // Get all content at once for better performance
  async getAllContent(): Promise<CMSContent | null> {
    try {
      const [
        hero,
        features,
        testimonials,
        howItWorks,
        pricing,
        faq,
        cta,
        seo
      ] = await Promise.all([
        this.getHeroSection(),
        this.getFeaturesSection(),
        this.getTestimonialsSection(),
        this.getHowItWorksSection(),
        this.getPricingSection(),
        this.getFaqSection(),
        this.getCTASection(),
        this.getSEO()
      ])

      if (!hero) {
        console.warn('Hero section not found in CMS')
        return null
      }

      return {
        hero,
        features: features || { id: '', title: '', features: [], isActive: false } as CMSFeaturesSection,
        testimonials: testimonials || { id: '', title: '', testimonials: [], isActive: false } as CMSTestimonialsSection,
        howItWorks: howItWorks || { id: '', title: '', steps: [], isActive: false } as CMSHowItWorksSection,
        pricing: pricing || { id: '', title: '', plans: [], isActive: false } as CMSPricingSection,
        faq: faq || { id: '', title: '', faqs: [], isActive: false } as CMSFaqSection,
        cta: cta || { id: '', title: '', ctaText: '', ctaLink: '', isActive: false } as CMSCTASection,
        seo: seo || {
          title: 'StuudIA - Fotos Profissionais com IA',
          description: 'Transforme suas fotos de produto em imagens profissionais com Inteligência Artificial',
          keywords: ['fotos profissionais', 'IA', 'modelo virtual'],
          noindex: false,
          nofollow: false
        },
        global: {
          siteName: 'StuudIA',
          siteDescription: 'Transforme fotos de celular em ensaios profissionais de estúdio com modelo IA',
          contactEmail: 'suporte@studia.com.br',
          contactPhone: '+5562999999999',
          socialLinks: {
            instagram: 'https://instagram.com/appstuudia',
            facebook: 'https://facebook.com/profile.php?id=61582139489466'
          }
        }
      }
    } catch (error) {
      console.error('Error fetching all CMS content:', error)
      return null
    }
  }
}

// Factory function to create Strapi client
export function createStrapiClient(baseUrl?: string, apiToken?: string): StrapiClient {
  const url = baseUrl || process.env.STRAPI_URL
  const token = apiToken || process.env.STRAPI_API_TOKEN

  if (!url) {
    throw new Error('STRAPI_URL environment variable is required')
  }

  return new StrapiClient(url, token)
}

// Default export
export default StrapiClient
