import axios from 'axios'

// 创建axios实例
const api = axios.create({
  baseURL: '/api', // 使用代理路径
  timeout: 180000, // 增加超时时间到180秒（3分钟）
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  },
  // 添加重试配置
  retry: 3,
  retryDelay: 1000
})

// 重试逻辑
api.interceptors.response.use(undefined, (err) => {
  const { config } = err
  
  if (!config || !config.retry) {
    return Promise.reject(err)
  }
  
  // 设置重试次数
  config.__retryCount = config.__retryCount || 0
  
  if (config.__retryCount >= config.retry) {
    return Promise.reject(err)
  }
  
  config.__retryCount += 1
  
  // 创建延迟Promise
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
  
  return delay(config.retryDelay || 1000).then(() => api(config))
})

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    // 添加请求时间戳
    config.metadata = { startTime: new Date() }
    console.log(`[API请求] ${config.method?.toUpperCase()} ${config.url}`, config.params || config.data)
    return config
  },
  (error) => {
    console.error('[API请求错误]:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    const duration = new Date().getTime() - response.config.metadata.startTime.getTime()
    console.log(`[API响应] ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status} (${duration}ms)`)
    return response.data
  },
  (error) => {
    const duration = error.config?.metadata ? 
      new Date().getTime() - error.config.metadata.startTime.getTime() : 0
    
    console.error(`[API错误] ${error.config?.method?.toUpperCase()} ${error.config?.url} - ${error.response?.status || 'Network Error'} (${duration}ms):`, error)
    
    // 根据错误状态码提供友好的错误信息
    let errorMessage = '请求失败'
    if (error.response) {
      switch (error.response.status) {
        case 400:
          errorMessage = '请求参数错误'
          break
        case 401:
          errorMessage = '未授权访问'
          break
        case 403:
          errorMessage = '禁止访问'
          break
        case 404:
          errorMessage = '请求的资源不存在'
          break
        case 500:
          errorMessage = '服务器内部错误'
          break
        case 502:
          errorMessage = '网关错误'
          break
        case 503:
          errorMessage = '服务暂时不可用'
          break
        default:
          errorMessage = `请求失败 (${error.response.status})`
      }
    } else if (error.request) {
      errorMessage = '网络连接失败，请检查网络连接'
    }
    
    error.friendlyMessage = errorMessage
    return Promise.reject(error)
  }
)

export default api