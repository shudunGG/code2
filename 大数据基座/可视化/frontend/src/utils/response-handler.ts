// 统一API响应类型定义
export interface ApiResponse<T = any> {
  success: boolean
  message: string
  data: T
  code: number
  timestamp: number
}

// 分页响应类型
export interface PageResponse<T = any> {
  data: T[]
  total: number
  page: number
  size: number
  totalPages: number
}

// 错误类型枚举
export enum ErrorCode {
  SUCCESS = 200,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
  DATABASE_ERROR = 5001,
  DATA_SOURCE_ERROR = 5002,
  SQL_EXECUTION_ERROR = 5003
}

// 响应处理工具类
export class ResponseHandler {
  
  /**
   * 检查响应是否成功
   */
  static isSuccess<T>(response: ApiResponse<T>): boolean {
    return response && response.success === true
  }
  
  /**
   * 获取响应数据，失败时返回默认值
   */
  static getData<T>(response: ApiResponse<T>, defaultValue: T | null = null): T | null {
    return this.isSuccess(response) ? response.data : defaultValue
  }
  
  /**
   * 获取错误消息
   */
  static getErrorMessage<T>(response: ApiResponse<T>): string {
    if (this.isSuccess(response)) {
      return ''
    }
    return response?.message || '未知错误'
  }
  
  /**
   * 获取错误代码
   */
  static getErrorCode<T>(response: ApiResponse<T>): number {
    return response?.code || ErrorCode.INTERNAL_SERVER_ERROR
  }
  
  /**
   * 处理API响应
   */
  static handle<T>(
    response: ApiResponse<T>,
    onSuccess?: (data: T) => void,
    onError?: (message: string, code: number) => void
  ): T | null {
    if (this.isSuccess(response)) {
      onSuccess?.(response.data)
      return response.data
    } else {
      const message = this.getErrorMessage(response)
      const code = this.getErrorCode(response)
      onError?.(message, code)
      return null
    }
  }
  
  /**
   * 显示错误提示
   */
  static showError<T>(response: ApiResponse<T>): void {
    if (!this.isSuccess(response)) {
      const message = this.getErrorMessage(response)
      // 这里可以集成具体的提示组件，如 Element Plus 的 Message
      console.error('API Error:', message)
      // ElMessage.error(message)
    }
  }
  
  /**
   * 显示成功提示
   */
  static showSuccess<T>(response: ApiResponse<T>, customMessage?: string): void {
    if (this.isSuccess(response)) {
      const message = customMessage || response.message || '操作成功'
      console.log('API Success:', message)
      // ElMessage.success(message)
    }
  }
  
  /**
   * 处理分页响应
   */
  static handlePageResponse<T>(
    response: ApiResponse<PageResponse<T>>,
    onSuccess?: (data: T[], total: number, page: number, size: number) => void,
    onError?: (message: string, code: number) => void
  ): PageResponse<T> | null {
    return this.handle(
      response,
      (pageData) => {
        onSuccess?.(pageData.data, pageData.total, pageData.page, pageData.size)
      },
      onError
    )
  }
  
  /**
   * 根据错误码进行不同处理
   */
  static handleByErrorCode<T>(
    response: ApiResponse<T>,
    handlers: Partial<Record<ErrorCode, (message: string) => void>>
  ): void {
    if (!this.isSuccess(response)) {
      const code = this.getErrorCode(response) as ErrorCode
      const message = this.getErrorMessage(response)
      
      const handler = handlers[code] || handlers[ErrorCode.INTERNAL_SERVER_ERROR]
      if (handler) {
        handler(message)
      } else {
        console.error(`未处理的错误码 ${code}: ${message}`)
      }
    }
  }
}

// 常用错误处理函数
export const commonErrorHandlers = {
  [ErrorCode.UNAUTHORIZED]: (message: string) => {
    console.error('未授权访问:', message)
    // 可以在这里处理登录跳转
    // router.push('/login')
  },
  
  [ErrorCode.FORBIDDEN]: (message: string) => {
    console.error('访问被禁止:', message)
    // ElMessage.error('您没有权限执行此操作')
  },
  
  [ErrorCode.NOT_FOUND]: (message: string) => {
    console.error('资源不存在:', message)
    // ElMessage.error('请求的资源不存在')
  },
  
  [ErrorCode.DATABASE_ERROR]: (message: string) => {
    console.error('数据库错误:', message)
    // ElMessage.error('数据库操作失败，请稍后重试')
  },
  
  [ErrorCode.DATA_SOURCE_ERROR]: (message: string) => {
    console.error('数据源错误:', message)
    // ElMessage.error('数据源连接失败，请检查网络连接')
  },
  
  [ErrorCode.SQL_EXECUTION_ERROR]: (message: string) => {
    console.error('SQL执行错误:', message)
    // ElMessage.error('查询执行失败，请检查查询条件')
  }
}

// 使用示例:
/*
// 基本使用
const response = await api.get('/api/database/tables')
const tables = ResponseHandler.getData(response, [])

// 带回调处理
ResponseHandler.handle(
  response,
  (data) => {
    console.log('获取表列表成功:', data)
    tables.value = data
  },
  (message, code) => {
    console.error('获取表列表失败:', message)
    error.value = message
  }
)

// 错误码处理
ResponseHandler.handleByErrorCode(response, commonErrorHandlers)

// 分页处理
const pageResponse = await api.get('/api/database/interface-resources')
ResponseHandler.handlePageResponse(
  pageResponse,
  (data, total, page, size) => {
    tableData.value = data
    pagination.value.total = total
    pagination.value.page = page
    pagination.value.size = size
  },
  (message) => {
    error.value = message
  }
)
*/