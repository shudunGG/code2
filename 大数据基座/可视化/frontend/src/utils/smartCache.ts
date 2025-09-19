// 智能缓存管理工具
export interface CacheItem<T> {
  data: T
  timestamp: number
  expireTime: number
  key: string
}

export interface CacheConfig {
  defaultTTL: number // 默认过期时间（毫秒）
  maxSize: number    // 最大缓存条目数
  enablePersistence: boolean // 是否启用本地存储持久化
  compressionEnabled: boolean // 是否启用压缩
}

export class SmartCache {
  private cache: Map<string, CacheItem<any>> = new Map()
  private accessCount: Map<string, number> = new Map()
  private lastAccess: Map<string, number> = new Map()
  
  private config: CacheConfig = {
    defaultTTL: 5 * 60 * 1000, // 5分钟
    maxSize: 100,
    enablePersistence: true,
    compressionEnabled: false
  }

  constructor(config?: Partial<CacheConfig>) {
    if (config) {
      this.config = { ...this.config, ...config }
    }
    
    // 从本地存储恢复缓存
    if (this.config.enablePersistence) {
      this.loadFromStorage()
    }
    
    // 定期清理过期缓存
    setInterval(() => this.cleanup(), 60000) // 每分钟清理一次
  }

  /**
   * 设置缓存
   */
  set<T>(key: string, data: T, ttl?: number): void {
    const expireTime = (ttl || this.config.defaultTTL)
    const item: CacheItem<T> = {
      data,
      timestamp: Date.now(),
      expireTime: Date.now() + expireTime,
      key
    }

    // 如果达到最大容量，移除最少使用的项
    if (this.cache.size >= this.config.maxSize) {
      this.evictLRU()
    }

    this.cache.set(key, item)
    this.accessCount.set(key, 0)
    this.updateAccess(key)
    
    // 持久化到本地存储
    if (this.config.enablePersistence) {
      this.saveToStorage(key, item)
    }

    console.log(`📦 缓存已设置: ${key} (TTL: ${expireTime}ms)`)
  }

  /**
   * 获取缓存
   */
  get<T>(key: string): T | null {
    const item = this.cache.get(key)
    
    if (!item) {
      console.log(`📦 缓存未命中: ${key}`)
      return null
    }

    // 检查是否过期
    if (Date.now() > item.expireTime) {
      console.log(`📦 缓存已过期: ${key}`)
      this.delete(key)
      return null
    }

    this.updateAccess(key)
    console.log(`📦 缓存命中: ${key}`)
    return item.data as T
  }

  /**
   * 检查缓存是否存在且有效
   */
  has(key: string): boolean {
    const item = this.cache.get(key)
    if (!item) return false
    
    if (Date.now() > item.expireTime) {
      this.delete(key)
      return false
    }
    
    return true
  }

  /**
   * 删除缓存
   */
  delete(key: string): boolean {
    const deleted = this.cache.delete(key)
    this.accessCount.delete(key)
    this.lastAccess.delete(key)
    
    if (this.config.enablePersistence) {
      localStorage.removeItem(`cache_${key}`)
    }
    
    if (deleted) {
      console.log(`📦 缓存已删除: ${key}`)
    }
    
    return deleted
  }

  /**
   * 清空所有缓存
   */
  clear(): void {
    const keys = Array.from(this.cache.keys())
    this.cache.clear()
    this.accessCount.clear()
    this.lastAccess.clear()
    
    if (this.config.enablePersistence) {
      keys.forEach(key => localStorage.removeItem(`cache_${key}`))
    }
    
    console.log('📦 所有缓存已清空')
  }

  /**
   * 获取或设置缓存（如果不存在则调用工厂函数）
   */
  async getOrSet<T>(
    key: string, 
    factory: () => Promise<T>, 
    ttl?: number
  ): Promise<T> {
    const cached = this.get<T>(key)
    if (cached !== null) {
      return cached
    }

    console.log(`📦 缓存未命中，执行工厂函数: ${key}`)
    const data = await factory()
    this.set(key, data, ttl)
    return data
  }

  /**
   * 更新访问统计
   */
  private updateAccess(key: string): void {
    const count = this.accessCount.get(key) || 0
    this.accessCount.set(key, count + 1)
    this.lastAccess.set(key, Date.now())
  }

  /**
   * LRU淘汰策略
   */
  private evictLRU(): void {
    let lruKey = ''
    let lruTime = Date.now()
    
    for (const [key, time] of this.lastAccess) {
      if (time < lruTime) {
        lruTime = time
        lruKey = key
      }
    }
    
    if (lruKey) {
      console.log(`📦 LRU淘汰缓存: ${lruKey}`)
      this.delete(lruKey)
    }
  }

  /**
   * 清理过期缓存
   */
  private cleanup(): void {
    const now = Date.now()
    const expiredKeys: string[] = []
    
    for (const [key, item] of this.cache) {
      if (now > item.expireTime) {
        expiredKeys.push(key)
      }
    }
    
    expiredKeys.forEach(key => this.delete(key))
    
    if (expiredKeys.length > 0) {
      console.log(`📦 清理了 ${expiredKeys.length} 个过期缓存`)
    }
  }

  /**
   * 从本地存储加载缓存
   */
  private loadFromStorage(): void {
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key?.startsWith('cache_')) {
          const cacheKey = key.substring(6)
          const itemStr = localStorage.getItem(key)
          if (itemStr) {
            const item: CacheItem<any> = JSON.parse(itemStr)
            if (Date.now() <= item.expireTime) {
              this.cache.set(cacheKey, item)
              this.accessCount.set(cacheKey, 0)
              this.lastAccess.set(cacheKey, item.timestamp)
            } else {
              localStorage.removeItem(key)
            }
          }
        }
      }
      console.log(`📦 从本地存储恢复了 ${this.cache.size} 个缓存项`)
    } catch (error) {
      console.error('📦 从本地存储恢复缓存失败:', error)
    }
  }

  /**
   * 保存到本地存储
   */
  private saveToStorage(key: string, item: CacheItem<any>): void {
    try {
      localStorage.setItem(`cache_${key}`, JSON.stringify(item))
    } catch (error) {
      console.error(`📦 保存缓存到本地存储失败 (${key}):`, error)
    }
  }

  /**
   * 获取缓存统计信息
   */
  getStats(): any {
    const now = Date.now()
    let validCount = 0
    let expiredCount = 0
    let totalSize = 0
    
    for (const [key, item] of this.cache) {
      if (now <= item.expireTime) {
        validCount++
      } else {
        expiredCount++
      }
      totalSize += JSON.stringify(item.data).length
    }
    
    return {
      totalItems: this.cache.size,
      validItems: validCount,
      expiredItems: expiredCount,
      totalSizeBytes: totalSize,
      hitRate: this.calculateHitRate(),
      topAccessedKeys: this.getTopAccessedKeys(5)
    }
  }

  /**
   * 计算缓存命中率
   */
  private calculateHitRate(): number {
    const totalAccess = Array.from(this.accessCount.values()).reduce((sum, count) => sum + count, 0)
    return totalAccess > 0 ? (totalAccess / (totalAccess + this.cache.size)) * 100 : 0
  }

  /**
   * 获取访问次数最多的键
   */
  private getTopAccessedKeys(limit: number): { key: string; count: number }[] {
    return Array.from(this.accessCount.entries())
      .sort(([,a], [,b]) => b - a)
      .slice(0, limit)
      .map(([key, count]) => ({ key, count }))
  }
}

// 创建全局缓存实例
export const globalCache = new SmartCache({
  defaultTTL: 5 * 60 * 1000, // 5分钟
  maxSize: 200,
  enablePersistence: true
})

// 专门用于API响应的缓存实例
export const apiCache = new SmartCache({
  defaultTTL: 2 * 60 * 1000, // 2分钟
  maxSize: 50,
  enablePersistence: false
})

// Vue 3 组合式API Hook
export function useSmartCache(cacheInstance: SmartCache = globalCache) {
  const setCache = <T>(key: string, data: T, ttl?: number) => {
    cacheInstance.set(key, data, ttl)
  }

  const getCache = <T>(key: string): T | null => {
    return cacheInstance.get<T>(key)
  }

  const hasCache = (key: string): boolean => {
    return cacheInstance.has(key)
  }

  const deleteCache = (key: string): boolean => {
    return cacheInstance.delete(key)
  }

  const clearCache = () => {
    cacheInstance.clear()
  }

  const getOrSetCache = async <T>(
    key: string, 
    factory: () => Promise<T>, 
    ttl?: number
  ): Promise<T> => {
    return cacheInstance.getOrSet(key, factory, ttl)
  }

  const getCacheStats = () => {
    return cacheInstance.getStats()
  }

  return {
    setCache,
    getCache,
    hasCache,
    deleteCache,
    clearCache,
    getOrSetCache,
    getCacheStats
  }
}
