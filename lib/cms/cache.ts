import type { CMSCache, CMSCacheEntry } from './types'

export class RedisCache implements CMSCache {
  private client: any

  constructor(redisUrl?: string) {
    if (redisUrl && typeof window === 'undefined') {
      try {
        // Dynamically import redis only on server side
        const { createClient } = require('redis')
        this.client = createClient({ url: redisUrl })
        this.client.connect().catch(console.error)
      } catch (error) {
        console.warn('Redis not available, falling back to memory cache')
        this.client = null
      }
    }
  }

  async get<T>(key: string): Promise<T | null> {
    if (!this.client?.isOpen) return null

    try {
      const data = await this.client.get(`cms:${key}`)
      if (!data) return null

      const entry: CMSCacheEntry<T> = JSON.parse(data)
      const now = Date.now()

      if (now > entry.timestamp + entry.ttl) {
        await this.delete(key)
        return null
      }

      return entry.data
    } catch (error) {
      console.error('Redis cache get error:', error)
      return null
    }
  }

  async set<T>(key: string, data: T, ttl: number = 5 * 60 * 1000): Promise<void> {
    if (!this.client?.isOpen) return

    try {
      const entry: CMSCacheEntry<T> = {
        data,
        timestamp: Date.now(),
        ttl
      }

      await this.client.setEx(`cms:${key}`, Math.ceil(ttl / 1000), JSON.stringify(entry))
    } catch (error) {
      console.error('Redis cache set error:', error)
    }
  }

  async delete(key: string): Promise<void> {
    if (!this.client?.isOpen) return

    try {
      await this.client.del(`cms:${key}`)
    } catch (error) {
      console.error('Redis cache delete error:', error)
    }
  }

  async clear(): Promise<void> {
    if (!this.client?.isOpen) return

    try {
      const keys = await this.client.keys('cms:*')
      if (keys.length > 0) {
        await this.client.del(keys)
      }
    } catch (error) {
      console.error('Redis cache clear error:', error)
    }
  }
}

export class AdvancedMemoryCache implements CMSCache {
  private cache = new Map<string, CMSCacheEntry<any>>()
  private maxSize: number
  private cleanupInterval: NodeJS.Timeout | null = null

  constructor(maxSize = 100) {
    this.maxSize = maxSize
    this.startCleanupInterval()
  }

  private startCleanupInterval() {
    if (typeof window === 'undefined') {
      // Only run cleanup on server side
      this.cleanupInterval = setInterval(() => {
        this.cleanup()
      }, 60 * 1000) // Run every minute
    }
  }

  private cleanup() {
    const now = Date.now()
    const keysToDelete: string[] = []

    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.timestamp + entry.ttl) {
        keysToDelete.push(key)
      }
    }

    keysToDelete.forEach(key => this.cache.delete(key))
  }

  private evictLRU() {
    if (this.cache.size >= this.maxSize) {
      // Find oldest entry
      let oldestKey = ''
      let oldestTime = Date.now()

      for (const [key, entry] of this.cache.entries()) {
        if (entry.timestamp < oldestTime) {
          oldestTime = entry.timestamp
          oldestKey = key
        }
      }

      if (oldestKey) {
        this.cache.delete(oldestKey)
      }
    }
  }

  async get<T>(key: string): Promise<T | null> {
    const entry = this.cache.get(key)
    if (!entry) return null

    const now = Date.now()
    if (now > entry.timestamp + entry.ttl) {
      this.cache.delete(key)
      return null
    }

    return entry.data
  }

  async set<T>(key: string, data: T, ttl: number = 5 * 60 * 1000): Promise<void> {
    this.evictLRU()

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    })
  }

  async delete(key: string): Promise<void> {
    this.cache.delete(key)
  }

  async clear(): Promise<void> {
    this.cache.clear()
  }

  // Additional methods for advanced cache management
  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      utilization: (this.cache.size / this.maxSize) * 100
    }
  }

  destroy() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval)
      this.cleanupInterval = null
    }
    this.cache.clear()
  }
}

// Smart cache factory that chooses the best available cache
export function createSmartCache(): CMSCache {
  // Try Redis first (server-side only)
  if (typeof window === 'undefined' && process.env.REDIS_URL) {
    const redisCache = new RedisCache(process.env.REDIS_URL)
    // Test if Redis is working
    if (redisCache) {
      console.log('CMS: Using Redis cache')
      return redisCache
    }
  }

  // Fallback to advanced memory cache
  console.log('CMS: Using advanced memory cache')
  return new AdvancedMemoryCache()
}

// Cache warming utility
export class CacheWarmer {
  private cache: CMSCache
  private warmingInterval: NodeJS.Timeout | null = null

  constructor(cache: CMSCache) {
    this.cache = cache
  }

  // Warm up cache with frequently accessed data
  async warmUp(fetchFunction: () => Promise<any>, key: string, ttl?: number) {
    try {
      console.log(`CMS Cache: Warming up ${key}`)
      const data = await fetchFunction()
      await this.cache.set(key, data, ttl)
      console.log(`CMS Cache: Successfully warmed up ${key}`)
    } catch (error) {
      console.error(`CMS Cache: Failed to warm up ${key}:`, error)
    }
  }

  // Start automatic cache warming
  startAutoWarmup(fetchFunction: () => Promise<any>, key: string, intervalMinutes = 30) {
    if (typeof window !== 'undefined') return // Only run on server

    this.stopAutoWarmup()

    this.warmingInterval = setInterval(() => {
      this.warmUp(fetchFunction, key)
    }, intervalMinutes * 60 * 1000)

    console.log(`CMS Cache: Started auto-warmup for ${key} every ${intervalMinutes} minutes`)
  }

  stopAutoWarmup() {
    if (this.warmingInterval) {
      clearInterval(this.warmingInterval)
      this.warmingInterval = null
      console.log('CMS Cache: Stopped auto-warmup')
    }
  }
}
