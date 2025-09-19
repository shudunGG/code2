// 前端性能监控工具
export class PerformanceMonitor {
  private static instance: PerformanceMonitor
  private metrics: Map<string, any[]> = new Map()
  private config = {
    slowRequestThreshold: 3000, // 慢请求阈值（毫秒）
    enableConsoleLog: true,
    maxMetricsCount: 1000 // 最大保存的指标数量
  }

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor()
    }
    return PerformanceMonitor.instance
  }

  /**
   * 记录API请求性能
   */
  recordApiCall(url: string, method: string, duration: number, status: number, error?: any) {
    const metric = {
      url,
      method,
      duration,
      status,
      error: error?.message || null,
      timestamp: new Date().toISOString(),
      isSlowRequest: duration > this.config.slowRequestThreshold
    }

    // 添加到指标集合
    const key = `api_${method}_${url.replace(/[^a-zA-Z0-9]/g, '_')}`
    if (!this.metrics.has(key)) {
      this.metrics.set(key, [])
    }
    
    const metrics = this.metrics.get(key)!
    metrics.push(metric)
    
    // 限制指标数量
    if (metrics.length > this.config.maxMetricsCount) {
      metrics.shift()
    }

    // 记录慢请求
    if (metric.isSlowRequest && this.config.enableConsoleLog) {
      console.warn(`🐌 慢请求检测: ${method} ${url} - ${duration}ms`)
    }

    // 记录错误请求
    if (error && this.config.enableConsoleLog) {
      console.error(`❌ API请求失败: ${method} ${url}`, error)
    }

    // 正常请求日志
    if (!error && this.config.enableConsoleLog) {
      console.log(`✅ API请求完成: ${method} ${url} - ${duration}ms`)
    }
  }

  /**
   * 记录页面加载性能
   */
  recordPageLoad(pageName: string, loadTime: number) {
    const metric = {
      pageName,
      loadTime,
      timestamp: new Date().toISOString(),
      isSlowLoad: loadTime > 2000
    }

    const key = `page_${pageName}`
    if (!this.metrics.has(key)) {
      this.metrics.set(key, [])
    }
    
    this.metrics.get(key)!.push(metric)

    if (this.config.enableConsoleLog) {
      if (metric.isSlowLoad) {
        console.warn(`🐌 页面加载较慢: ${pageName} - ${loadTime}ms`)
      } else {
        console.log(`📄 页面加载完成: ${pageName} - ${loadTime}ms`)
      }
    }
  }

  /**
   * 记录用户操作
   */
  recordUserAction(action: string, element?: string, duration?: number) {
    const metric = {
      action,
      element,
      duration: duration || 0,
      timestamp: new Date().toISOString()
    }

    const key = `user_action_${action}`
    if (!this.metrics.has(key)) {
      this.metrics.set(key, [])
    }
    
    this.metrics.get(key)!.push(metric)

    if (this.config.enableConsoleLog) {
      console.log(`👆 用户操作: ${action}${element ? ` (${element})` : ''}${duration ? ` - ${duration}ms` : ''}`)
    }
  }

  /**
   * 获取性能统计
   */
  getStatistics(): any {
    const stats: any = {
      summary: {
        totalApiCalls: 0,
        slowApiCalls: 0,
        errorApiCalls: 0,
        averageResponseTime: 0,
        totalPageLoads: 0,
        slowPageLoads: 0,
        totalUserActions: 0
      },
      details: {}
    }

    let totalDuration = 0
    let totalRequests = 0

    this.metrics.forEach((metrics, key) => {
      if (key.startsWith('api_')) {
        const apiStats = {
          totalCalls: metrics.length,
          slowCalls: metrics.filter((m: any) => m.isSlowRequest).length,
          errorCalls: metrics.filter((m: any) => m.error).length,
          averageDuration: metrics.reduce((sum: number, m: any) => sum + m.duration, 0) / metrics.length,
          successRate: (metrics.length - metrics.filter((m: any) => m.error).length) / metrics.length * 100
        }
        
        stats.details[key] = apiStats
        stats.summary.totalApiCalls += apiStats.totalCalls
        stats.summary.slowApiCalls += apiStats.slowCalls
        stats.summary.errorApiCalls += apiStats.errorCalls
        
        totalDuration += metrics.reduce((sum: number, m: any) => sum + m.duration, 0)
        totalRequests += metrics.length
      } else if (key.startsWith('page_')) {
        const pageStats = {
          totalLoads: metrics.length,
          slowLoads: metrics.filter((m: any) => m.isSlowLoad).length,
          averageLoadTime: metrics.reduce((sum: number, m: any) => sum + m.loadTime, 0) / metrics.length
        }
        
        stats.details[key] = pageStats
        stats.summary.totalPageLoads += pageStats.totalLoads
        stats.summary.slowPageLoads += pageStats.slowLoads
      } else if (key.startsWith('user_action_')) {
        stats.summary.totalUserActions += metrics.length
        stats.details[key] = { totalActions: metrics.length }
      }
    })

    stats.summary.averageResponseTime = totalRequests > 0 ? totalDuration / totalRequests : 0

    return stats
  }

  /**
   * 打印性能统计
   */
  printStatistics() {
    const stats = this.getStatistics()
    console.group('📊 性能统计报告')
    console.log('总体概况:', stats.summary)
    console.log('详细数据:', stats.details)
    console.groupEnd()
  }

  /**
   * 清除所有指标
   */
  clearMetrics() {
    this.metrics.clear()
    console.log('🧹 性能指标已清除')
  }

  /**
   * 配置监控参数
   */
  configure(config: Partial<typeof this.config>) {
    this.config = { ...this.config, ...config }
  }
}

// 导出单例实例
export const performanceMonitor = PerformanceMonitor.getInstance()

// Vue 3 组合式API Hook
export function usePerformanceMonitor() {
  const recordApiCall = (url: string, method: string, duration: number, status: number, error?: any) => {
    performanceMonitor.recordApiCall(url, method, duration, status, error)
  }

  const recordPageLoad = (pageName: string, loadTime: number) => {
    performanceMonitor.recordPageLoad(pageName, loadTime)
  }

  const recordUserAction = (action: string, element?: string, duration?: number) => {
    performanceMonitor.recordUserAction(action, element, duration)
  }

  const getStatistics = () => {
    return performanceMonitor.getStatistics()
  }

  const printStatistics = () => {
    performanceMonitor.printStatistics()
  }

  const clearMetrics = () => {
    performanceMonitor.clearMetrics()
  }

  return {
    recordApiCall,
    recordPageLoad,
    recordUserAction,
    getStatistics,
    printStatistics,
    clearMetrics
  }
}