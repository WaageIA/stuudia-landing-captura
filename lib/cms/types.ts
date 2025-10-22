// ===========================================
// TIPOS PARA HEADLESS CMS - STUDIA
// ===========================================

export interface CMSBaseEntity {
  id: string
  createdAt: string
  updatedAt: string
  publishedAt?: string
}

// Hero Section Types
export interface CMSHeroSection extends CMSBaseEntity {
  title: string
  subtitle: string
  ctaText: string
  ctaLink: string
  backgroundImage?: CMSMedia
  images: CMSMedia[]
  isActive: boolean
  seoTitle?: string
  seoDescription?: string
}

// Features Section Types
export interface CMSFeature extends CMSBaseEntity {
  title: string
  description: string
  icon: string
  iconType: 'lucide' | 'custom'
  order: number
  isActive: boolean
}

export interface CMSFeaturesSection extends CMSBaseEntity {
  title: string
  subtitle?: string
  features: CMSFeature[]
  isActive: boolean
}

// Testimonials Types
export interface CMSTestimonial extends CMSBaseEntity {
  name: string
  role: string
  company?: string
  content: string
  rating: number
  avatar?: CMSMedia
  isFeatured: boolean
  order: number
  isActive: boolean
}

export interface CMSTestimonialsSection extends CMSBaseEntity {
  title: string
  subtitle?: string
  testimonials: CMSTestimonial[]
  isActive: boolean
}

// FAQ Types
export interface CMSFaq extends CMSBaseEntity {
  question: string
  answer: string
  category?: string
  order: number
  isActive: boolean
}

export interface CMSFaqSection extends CMSBaseEntity {
  title: string
  subtitle?: string
  faqs: CMSFaq[]
  isActive: boolean
}

// How It Works Types
export interface CMSHowItWorksStep extends CMSBaseEntity {
  title: string
  description: string
  icon: string
  iconType: 'lucide' | 'custom'
  image?: CMSMedia
  order: number
  isActive: boolean
}

export interface CMSHowItWorksSection extends CMSBaseEntity {
  title: string
  subtitle?: string
  steps: CMSHowItWorksStep[]
  isActive: boolean
}

// Pricing Types
export interface CMSPlan extends CMSBaseEntity {
  name: string
  description: string
  price: number
  currency: string
  interval: 'monthly' | 'yearly'
  features: string[]
  ctaText: string
  ctaLink: string
  isPopular: boolean
  isActive: boolean
  order: number
  badge?: string
}

export interface CMSPricingSection extends CMSBaseEntity {
  title: string
  subtitle?: string
  plans: CMSPlan[]
  isActive: boolean
}

// CTA Section Types
export interface CMSCTASection extends CMSBaseEntity {
  title: string
  subtitle?: string
  ctaText: string
  ctaLink: string
  backgroundImage?: CMSMedia
  isActive: boolean
}

// Media Types
export interface CMSMedia extends CMSBaseEntity {
  name: string
  alternativeText?: string
  caption?: string
  width: number
  height: number
  formats?: {
    thumbnail?: CMSMediaFormat
    small?: CMSMediaFormat
    medium?: CMSMediaFormat
    large?: CMSMediaFormat
  }
  hash: string
  ext: string
  mime: string
  size: number
  url: string
  previewUrl?: string
  provider: string
  provider_metadata?: any
}

export interface CMSMediaFormat {
  name: string
  hash: string
  ext: string
  mime: string
  width: number
  height: number
  size: number
  path?: string
  url: string
}

// SEO Types
export interface CMSSEO {
  title: string
  description: string
  keywords: string[]
  ogImage?: CMSMedia
  twitterImage?: CMSMedia
  canonicalUrl?: string
  noindex: boolean
  nofollow: boolean
}

// Main CMS Content Type
export interface CMSContent {
  hero: CMSHeroSection
  features: CMSFeaturesSection
  testimonials: CMSTestimonialsSection
  howItWorks: CMSHowItWorksSection
  pricing: CMSPricingSection
  faq: CMSFaqSection
  cta: CMSCTASection
  seo: CMSSEO
  global: {
    siteName: string
    siteDescription: string
    contactEmail: string
    contactPhone?: string
    socialLinks: {
      instagram?: string
      facebook?: string
      twitter?: string
      linkedin?: string
    }
  }
}

// API Response Types
export interface CMSResponse<T> {
  data: T
  meta?: {
    pagination?: {
      page: number
      pageSize: number
      pageCount: number
      total: number
    }
  }
}

export interface CMSListResponse<T> extends CMSResponse<T[]> {}

// CMS Provider Types
export type CMSProvider = 'strapi' | 'contentful'

export interface CMSConfig {
  provider: CMSProvider
  baseUrl: string
  apiToken?: string
  spaceId?: string // For Contentful
  environment?: string // For Contentful
}

// Cache Types
export interface CMSCacheEntry<T> {
  data: T
  timestamp: number
  ttl: number // Time to live in milliseconds
}

export interface CMSCache {
  get<T>(key: string): Promise<T | null>
  set<T>(key: string, data: T, ttl?: number): Promise<void>
  delete(key: string): Promise<void>
  clear(): Promise<void>
}
