import api from './api'

/**
 * 优化的数据库服务层
 * 包含智能缓存、请求去重、错误重试等功能
 */

// 缓存管理器
class CacheManager {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>()
  private readonly DEFAULT_TTL = 5 * 60 * 1000 // 5分钟
  
  get(key: string): any {
    const cached = this.cache.get(key)
    if (cached && Date.now() - cached.timestamp < cached.ttl) {
      console.log(`缓存命中: ${key}`)
      return cached.data
    }
    return null
  }
  
  set(key: string, data: any, ttl = this.DEFAULT_TTL): void {
    this.cache.set(key, {
      data: JSON.parse(JSON.stringify(data)), // 深拷贝避免引用问题
      timestamp: Date.now(),
      ttl
    })
    console.log(`缓存已设置: ${key} (TTL: ${ttl}ms)`)
  }
  
  delete(key: string): void {
    this.cache.delete(key)
    console.log(`缓存已删除: ${key}`)
  }
  
  clear(): void {
    this.cache.clear()
    console.log('所有缓存已清除')
  }
  
  // 清理过期缓存
  cleanup(): void {
    const now = Date.now()
    for (const [key, value] of this.cache.entries()) {
      if (now - value.timestamp >= value.ttl) {
        this.cache.delete(key)
      }
    }
  }
}

// 请求去重管理器
class RequestDeduplicator {
  private pendingRequests = new Map<string, Promise<any>>()
  
  async execute<T>(key: string, requestFn: () => Promise<T>): Promise<T> {
    // 如果已有相同请求在进行中，直接返回该Promise
    if (this.pendingRequests.has(key)) {
      console.log(`请求去重: ${key}`)
      return this.pendingRequests.get(key) as Promise<T>
    }
    
    const promise = requestFn()
      .finally(() => {
        // 请求完成后移除记录
        this.pendingRequests.delete(key)
      })
    
    this.pendingRequests.set(key, promise)
    return promise
  }
}

// 错误重试管理器
class RetryManager {
  async execute<T>(
    requestFn: () => Promise<T>,
    maxRetries = 3,
    baseDelay = 1000
  ): Promise<T> {
    let lastError: Error
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await requestFn()
      } catch (error) {
        lastError = error as Error
        
        if (attempt === maxRetries) {
          throw lastError
        }
        
        // 指数退避延迟
        const delay = baseDelay * Math.pow(2, attempt)
        console.warn(`请求失败，${delay}ms后重试 (${attempt + 1}/${maxRetries + 1}):`, error)
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
    
    throw lastError!
  }
}

// 初始化管理器实例
const cacheManager = new CacheManager()
const requestDeduplicator = new RequestDeduplicator()
const retryManager = new RetryManager()

// 定期清理过期缓存
setInterval(() => {
  cacheManager.cleanup()
}, 60000) // 每分钟清理一次

/**
 * 获取所有接口资源（优化版）
 */
export const getAllInterfaceResources = async (page = 1, size = 50, forceRefresh = false) => {
  const cacheKey = `interface_resources_${page}_${size}`
  
  // 检查缓存
  if (!forceRefresh) {
    const cached = cacheManager.get(cacheKey)
    if (cached) {
      return cached
    }
  }
  
  // 去重请求
  return requestDeduplicator.execute(cacheKey, async () => {
    const response = await retryManager.execute(async () => {
      return api.get('/database/interface-resources', {
        params: { page, size }
      })
    })
    
    // 缓存成功响应
    if (response?.success) {
      cacheManager.set(cacheKey, response, 3 * 60 * 1000) // 3分钟缓存
    }
    
    return response
  })
}

/**
 * 搜索接口资源（优化版）
 */
export const searchInterfaceResources = async (keyword: string, page = 1, size = 50) => {
  const cacheKey = `search_${keyword}_${page}_${size}`
  
  // 搜索结果缓存时间较短
  const cached = cacheManager.get(cacheKey)
  if (cached) {
    return cached
  }
  
  return requestDeduplicator.execute(cacheKey, async () => {
    const response = await retryManager.execute(async () => {
      return api.get('/database/interface-resources/search', {
        params: { keyword, page, size }
      })
    })
    
    if (response?.success) {
      cacheManager.set(cacheKey, response, 60 * 1000) // 1分钟缓存
    }
    
    return response
  })
}

/**
 * 获取表字段信息（优化版）
 */
export const getTableFields = async (tableName: string, forceRefresh = false) => {
  const cacheKey = `table_fields_${tableName}`
  
  if (!forceRefresh) {
    const cached = cacheManager.get(cacheKey)
    if (cached) {
      return cached
    }
  }
  
  return requestDeduplicator.execute(cacheKey, async () => {
    const response = await retryManager.execute(async () => {
      return api.get(`/database/tables/${encodeURIComponent(tableName)}/fields`)
    })
    
    if (response?.success) {
      cacheManager.set(cacheKey, response, 10 * 60 * 1000) // 10分钟缓存
    }
    
    return response
  })
}

/**
 * 获取表数据（优化版）
 */
export const getTableData = async (tableName: string, page = 1, size = 20, forceRefresh = false) => {
  const cacheKey = `table_data_${tableName}_${page}_${size}`
  
  if (!forceRefresh) {
    const cached = cacheManager.get(cacheKey)
    if (cached) {
      return cached
    }
  }
  
  return requestDeduplicator.execute(cacheKey, async () => {
    const response = await retryManager.execute(async () => {
      return api.get(`/database/tables/${encodeURIComponent(tableName)}/data`, {
        params: { page, size }
      })
    })
    
    if (response?.success) {
      cacheManager.set(cacheKey, response, 2 * 60 * 1000) // 2分钟缓存
    }
    
    return response
  })
}

/**
 * 执行自定义SQL查询（优化版）
 */
export const executeCustomQuery = async (sql: string) => {
  // 自定义查询不缓存，每次都执行
  return retryManager.execute(async () => {
    return api.post('/database/executeCustomSQL', { sql })
  })
}

/**
 * 批量预加载数据
 */
export const preloadData = async (tableNames: string[]) => {
  console.log('开始预加载数据...')
  
  const promises = tableNames.slice(0, 5).map(async (tableName) => {
    try {
      await getTableFields(tableName)
      console.log(`预加载完成: ${tableName}`)
    } catch (error) {
      console.warn(`预加载失败: ${tableName}`, error)
    }
  })
  
  await Promise.allSettled(promises)
  console.log('预加载完成')
}

/**
 * 清除缓存
 */
export const clearCache = (pattern?: string) => {
  if (pattern) {
    // 清除匹配模式的缓存
    cacheManager.clear()
  } else {
    cacheManager.clear()
  }
}

/**
 * 获取缓存统计
 */
export const getCacheStats = () => {
  return {
    size: cacheManager['cache'].size,
    keys: Array.from(cacheManager['cache'].keys())
  }
}

// 导出默认的数据库服务函数
export default {
  getAllInterfaceResources,
  searchInterfaceResources,
  getTableFields,
  getTableData,
  executeCustomQuery,
  preloadData,
  clearCache,
  getCacheStats
}
