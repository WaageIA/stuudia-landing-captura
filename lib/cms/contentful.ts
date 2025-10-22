import { createClient } from 'contentful'
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
  CMSMedia
} from './types'

class ContentfulClient {
  private client: any

  constructor(spaceId: string, accessToken: string, environment: string = 'master') {
    this.client = createClient({
      space: spaceId,
      accessToken,
      environment
    })
  }

  private transformMedia(asset: any): CMSMedia {
    return {
      id: asset.sys.id,
      createdAt: asset.sys.createdAt,
      updatedAt: asset.sys.updatedAt,
      publishedAt: asset.sys.publishedAt,
      name: asset.fields.title || '',
      alternativeText: asset.fields.description,
      caption: asset.fields.description,
      width: asset.fields.file?.details?.image?.width || 0,
      height: asset.fields.file?.details?.image?.height || 0,
      formats: asset.fields.file?.details?.image ? {
        thumbnail: {
          name: 'thumbnail',
          hash: '',
          ext: '',
          mime: asset.fields.file.contentType,
          width: 150,
          height: 150,
          size: 0,
          url: `https:${asset.fields.file.url}?w=150&h=150&fit=thumb`
        },
        small: {
          name: 'small',
          hash: '',
          ext: '',
          mime: asset.fields.file.contentType,
          width: 400,
          height: 400,
          size: 0,
          url: `https:${asset.fields.file.url}?w=400&h=400&fit=thumb`
        },
        medium: {
          name: 'medium',
          hash: '',
          ext: '',
          mime: asset.fields.file.contentType,
          width: 800,
          height: 800,
          size: 0,
          url: `https:${asset.fields.file.url}?w=800&h=800&fit=thumb`
        },
        large: {
          name: 'large',
          hash: '',
          ext: '',
          mime: asset.fields.file.contentType,
          width: 1200,
          height: 1200,
          size: 0,
          url: `https:${asset.fields.file.url}?w=1200&h=1200&fit=thumb`
        }
      } : undefined,
      hash: '',
      ext: asset.fields.file?.url?.split('.').pop() || '',
      mime: asset.fields.file?.contentType || '',
      size: asset.fields.file?.details?.size || 0,
      url: `https:${asset.fields.file.url}`,
      provider: 'contentful',
      provider_metadata: asset.fields.file
    }
  }

  private transformHeroSection(entry: any): CMSHeroSection {
    return {
      id: entry.sys.id,
      createdAt: entry.sys.createdAt,
      updatedAt: entry.sys.updatedAt,
      publishedAt: entry.sys.publishedAt,
      title: entry.fields.title || '',
      subtitle: entry.fields.subtitle || '',
      ctaText: entry.fields.ctaText || '',
      ctaLink: entry.fields.ctaLink || '',
      backgroundImage: entry.fields.backgroundImage ? this.transformMedia(entry.fields.backgroundImage) : undefined,
      images: entry.fields.images?.map((img: any) => this.transformMedia(img)) || [],
      isActive: entry.fields.isActive !== false,
      seoTitle: entry.fields.seoTitle,
      seoDescription: entry.fields.seoDescription
    }
  }

  private transformFeature(entry: any): any {
    return {
      id: entry.sys.id,
      createdAt: entry.sys.createdAt,
      updatedAt: entry.sys.updatedAt,
      publishedAt: entry.sys.publishedAt,
      title: entry.fields.title || '',
      description: entry.fields.description || '',
      icon: entry.fields.icon || '',
      iconType: entry.fields.iconType || 'lucide',
      order: entry.fields.order || 0,
      isActive: entry.fields.isActive !== false
    }
  }

  private transformFeaturesSection(entry: any): CMSFeaturesSection {
    return {
      id: entry.sys.id,
      createdAt: entry.sys.createdAt,
      updatedAt: entry.sys.updatedAt,
      publishedAt: entry.sys.publishedAt,
      title: entry.fields.title || '',
      subtitle: entry.fields.subtitle,
      features: entry.fields.features?.map((feature: any) => this.transformFeature(feature)) || [],
      isActive: entry.fields.isActive !== false
    }
  }

  private transformTestimonial(entry: any): any {
    return {
      id: entry.sys.id,
      createdAt: entry.sys.createdAt,
      updatedAt: entry.sys.updatedAt,
      publishedAt: entry.sys.publishedAt,
      name: entry.fields.name || '',
      role: entry.fields.role || '',
      company: entry.fields.company,
      content: entry.fields.content || '',
      rating: entry.fields.rating || 5,
      avatar: entry.fields.avatar ? this.transformMedia(entry.fields.avatar) : undefined,
      isFeatured: entry.fields.isFeatured || false,
      order: entry.fields.order || 0,
      isActive: entry.fields.isActive !== false
    }
  }

  private transformTestimonialsSection(entry: any): CMSTestimonialsSection {
    return {
      id: entry.sys.id,
      createdAt: entry.sys.createdAt,
      updatedAt: entry.sys.updatedAt,
      publishedAt: entry.sys.publishedAt,
      title: entry.fields.title || '',
      subtitle: entry.fields.subtitle,
      testimonials: entry.fields.testimonials?.map((testimonial: any) => this.transformTestimonial(testimonial)) || [],
      isActive: entry.fields.isActive !== false
    }
  }

  private transformHowItWorksStep(entry: any): any {
    return {
      id: entry.sys.id,
      createdAt: entry.sys.createdAt,
      updatedAt: entry.sys.updatedAt,
      publishedAt: entry.sys.publishedAt,
      title: entry.fields.title || '',
      description: entry.fields.description || '',
      icon: entry.fields.icon || '',
      iconType: entry.fields.iconType || 'lucide',
      image: entry.fields.image ? this.transformMedia(entry.fields.image) : undefined,
      order: entry.fields.order || 0,
      isActive: entry.fields.isActive !== false
    }
  }

  private transformHowItWorksSection(entry: any): CMSHowItWorksSection {
    return {
      id: entry.sys.id,
      createdAt: entry.sys.createdAt,
      updatedAt: entry.sys.updatedAt,
      publishedAt: entry.sys.publishedAt,
      title: entry.fields.title || '',
      subtitle: entry.fields.subtitle,
      steps: entry.fields.steps?.map((step: any) => this.transformHowItWorksStep(step)) || [],
      isActive: entry.fields.isActive !== false
    }
  }

  private transformPlan(entry: any): any {
    return {
      id: entry.sys.id,
      createdAt: entry.sys.createdAt,
      updatedAt: entry.sys.updatedAt,
      publishedAt: entry.sys.publishedAt,
      name: entry.fields.name || '',
      description: entry.fields.description || '',
      price: entry.fields.price || 0,
      currency: entry.fields.currency || 'BRL',
      interval: entry.fields.interval || 'monthly',
      features: entry.fields.features || [],
      ctaText: entry.fields.ctaText || '',
      ctaLink: entry.fields.ctaLink || '',
      isPopular: entry.fields.isPopular || false,
      isActive: entry.fields.isActive !== false,
      order: entry.fields.order || 0,
      badge: entry.fields.badge
    }
  }

  private transformPricingSection(entry: any): CMSPricingSection {
    return {
      id: entry.sys.id,
      createdAt: entry.sys.createdAt,
      updatedAt: entry.sys.updatedAt,
      publishedAt: entry.sys.publishedAt,
      title: entry.fields.title || '',
      subtitle: entry.fields.subtitle,
      plans: entry.fields.plans?.map((plan: any) => this.transformPlan(plan)) || [],
      isActive: entry.fields.isActive !== false
    }
  }

  private transformFaq(entry: any): any {
    return {
      id: entry.sys.id,
      createdAt: entry.sys.createdAt,
      updatedAt: entry.sys.updatedAt,
      publishedAt: entry.sys.publishedAt,
      question: entry.fields.question || '',
      answer: entry.fields.answer || '',
      category: entry.fields.category,
      order: entry.fields.order || 0,
      isActive: entry.fields.isActive !== false
    }
  }

  private transformFaqSection(entry: any): CMSFaqSection {
    return {
      id: entry.sys.id,
      createdAt: entry.sys.createdAt,
      updatedAt: entry.sys.updatedAt,
      publishedAt: entry.sys.publishedAt,
      title: entry.fields.title || '',
      subtitle: entry.fields.subtitle,
      faqs: entry.fields.faqs?.map((faq: any) => this.transformFaq(faq)) || [],
      isActive: entry.fields.isActive !== false
    }
  }

  private transformCTASection(entry: any): CMSCTASection {
    return {
      id: entry.sys.id,
      createdAt: entry.sys.createdAt,
      updatedAt: entry.sys.updatedAt,
      publishedAt: entry.sys.publishedAt,
      title: entry.fields.title || '',
      subtitle: entry.fields.subtitle,
      ctaText: entry.fields.ctaText || '',
      ctaLink: entry.fields.ctaLink || '',
      backgroundImage: entry.fields.backgroundImage ? this.transformMedia(entry.fields.backgroundImage) : undefined,
      isActive: entry.fields.isActive !== false
    }
  }

  private transformSEO(entry: any): CMSSEO {
    return {
      title: entry.fields.title || '',
      description: entry.fields.description || '',
      keywords: entry.fields.keywords || [],
      ogImage: entry.fields.ogImage ? this.transformMedia(entry.fields.ogImage) : undefined,
      twitterImage: entry.fields.twitterImage ? this.transformMedia(entry.fields.twitterImage) : undefined,
      canonicalUrl: entry.fields.canonicalUrl,
      noindex: entry.fields.noindex || false,
      nofollow: entry.fields.nofollow || false
    }
  }

  // Public methods
  async getHeroSection(): Promise<CMSHeroSection | null> {
    try {
      const entries = await this.client.getEntries({
        content_type: 'heroSection',
        limit: 1
      })

      if (entries.items.length === 0) return null

      return this.transformHeroSection(entries.items[0])
    } catch (error) {
      console.error('Error fetching hero section from Contentful:', error)
      return null
    }
  }

  async getFeaturesSection(): Promise<CMSFeaturesSection | null> {
    try {
      const entries = await this.client.getEntries({
        content_type: 'featuresSection',
        limit: 1,
        include: 2
      })

      if (entries.items.length === 0) return null

      return this.transformFeaturesSection(entries.items[0])
    } catch (error) {
      console.error('Error fetching features section from Contentful:', error)
      return null
    }
  }

  async getTestimonialsSection(): Promise<CMSTestimonialsSection | null> {
    try {
      const entries = await this.client.getEntries({
        content_type: 'testimonialsSection',
        limit: 1,
        include: 2
      })

      if (entries.items.length === 0) return null

      return this.transformTestimonialsSection(entries.items[0])
    } catch (error) {
      console.error('Error fetching testimonials section from Contentful:', error)
      return null
    }
  }

  async getHowItWorksSection(): Promise<CMSHowItWorksSection | null> {
    try {
      const entries = await this.client.getEntries({
        content_type: 'howItWorksSection',
        limit: 1,
        include: 2
      })

      if (entries.items.length === 0) return null

      return this.transformHowItWorksSection(entries.items[0])
    } catch (error) {
      console.error('Error fetching how it works section from Contentful:', error)
      return null
    }
  }

  async getPricingSection(): Promise<CMSPricingSection | null> {
    try {
      const entries = await this.client.getEntries({
        content_type: 'pricingSection',
        limit: 1,
        include: 2
      })

      if (entries.items.length === 0) return null

      return this.transformPricingSection(entries.items[0])
    } catch (error) {
      console.error('Error fetching pricing section from Contentful:', error)
      return null
    }
  }

  async getFaqSection(): Promise<CMSFaqSection | null> {
    try {
      const entries = await this.client.getEntries({
        content_type: 'faqSection',
        limit: 1,
        include: 2
      })

      if (entries.items.length === 0) return null

      return this.transformFaqSection(entries.items[0])
    } catch (error) {
      console.error('Error fetching FAQ section from Contentful:', error)
      return null
    }
  }

  async getCTASection(): Promise<CMSCTASection | null> {
    try {
      const entries = await this.client.getEntries({
        content_type: 'ctaSection',
        limit: 1,
        include: 1
      })

      if (entries.items.length === 0) return null

      return this.transformCTASection(entries.items[0])
    } catch (error) {
      console.error('Error fetching CTA section from Contentful:', error)
      return null
    }
  }

  async getSEO(): Promise<CMSSEO | null> {
    try {
      const entries = await this.client.getEntries({
        content_type: 'seo',
        limit: 1,
        include: 1
      })

      if (entries.items.length === 0) return null

      return this.transformSEO(entries.items[0])
    } catch (error) {
      console.error('Error fetching SEO data from Contentful:', error)
      return null
    }
  }

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
        console.warn('Hero section not found in Contentful')
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
      console.error('Error fetching all CMS content from Contentful:', error)
      return null
    }
  }
}

// Factory function to create Contentful client
export function createContentfulClient(
  spaceId?: string,
  accessToken?: string,
  environment?: string
): ContentfulClient {
  const space = spaceId || process.env.CONTENTFUL_SPACE_ID
  const token = accessToken || process.env.CONTENTFUL_ACCESS_TOKEN
  const env = environment || process.env.CONTENTFUL_ENVIRONMENT || 'master'

  if (!space || !token) {
    throw new Error('CONTENTFUL_SPACE_ID and CONTENTFUL_ACCESS_TOKEN environment variables are required')
  }

  return new ContentfulClient(space, token, env)
}

// Default export
export default ContentfulClient
