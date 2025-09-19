import api from './api'
import { performanceMonitor } from '../utils/performanceMonitor'
import { apiCache, useSmartCache } from '../utils/smartCache'

// 数据库服务类
export class DatabaseService {
  private cache = useSmartCache(apiCache)
  
  // 获取接口资源数据
  async getInterfaceResources(page: number = 1, size: number = 1000) {
    const cacheKey = `interface_resources_${page}_${size}`
    const startTime = performance.now()
    
    try {
      // 尝试从缓存获取
      const cachedData = this.cache.getCache(cacheKey)
      if (cachedData) {
        const duration = performance.now() - startTime
        performanceMonitor.recordApiCall('/database/interface-resources', 'GET', duration, 200)
        console.log('使用缓存数据:', cachedData)
        return cachedData
      }
      
      console.log('使用axios请求API...')
      const response = await api.get(`/database/interface-resources?page=${page}&size=${size}`)
      console.log('axios获取的数据:', response)
      
      const result = response.data || response
      
      // 缓存结果
      this.cache.setCache(cacheKey, result, 2 * 60 * 1000) // 2分钟缓存
      
      const duration = performance.now() - startTime
      performanceMonitor.recordApiCall('/database/interface-resources', 'GET', duration, 200)
      
      return result
    } catch (error: any) {
      const duration = performance.now() - startTime
      performanceMonitor.recordApiCall('/database/interface-resources', 'GET', duration, error.response?.status || 0, error)
      console.error('获取接口资源失败:', error)
      throw error
    }
  }

  // 获取接口资源总数
  async getInterfaceResourcesCount() {
    try {
      const response = await api.get('/database/interface-resources/count')
      return response.count || 0
    } catch (error) {
      console.error('获取接口资源总数失败:', error)
      throw error
    }
  }

  // 获取所有接口资源数据（分批获取）
  async getAllInterfaceResources() {
    try {
      // 先获取总数
      const totalCount = await this.getInterfaceResourcesCount()
      console.log(`数据库中总共有 ${totalCount} 条接口资源记录`)
      
      let allData = []
      let page = 1
      const size = 1000
      const totalPages = Math.ceil(totalCount / size)

      while (page <= totalPages) {
        try {
          console.log(`正在获取第${page}/${totalPages}页数据...`)
          const pageData = await this.getInterfaceResources(page, size)
          
          if (pageData && pageData.length > 0) {
            allData = allData.concat(pageData)
            console.log(`已获取 ${allData.length}/${totalCount} 条数据`)
          } else {
            console.log(`第${page}页没有数据，停止获取`)
            break
          }
          
          // 添加延迟避免请求过快
          if (page < totalPages) {
            await new Promise(resolve => setTimeout(resolve, 200))
          }
        } catch (pageError) {
          console.error(`获取第${page}页数据失败:`, pageError)
          // 如果是第一页就失败，直接抛出错误
          if (page === 1) {
            throw pageError
          }
          // 其他页失败则跳过
          console.log(`跳过第${page}页，继续获取下一页`)
        }
        
        page++
      }

      console.log(`总共获取到 ${allData.length} 条数据`)
      return allData
    } catch (error) {
      console.error('获取所有接口资源失败:', error)
      throw error
    }
  }
  
  // 在 "// 表格管理功能已移除" 注释后添加以下方法：
  
  // 获取表格列表
  async getTables() {
    try {
      const response = await api.get('/database/tables')
      if (response.data.success) {
        return {
          success: true,
          data: response.data.data
        }
      } else {
        return {
          success: false,
          message: response.data.message || '获取表格列表失败'
        }
      }
    } catch (error) {
      console.error('获取表格列表失败:', error)
      return {
        success: false,
        message: error.message || '获取表格列表失败'
      }
    }
  }
  
  // 获取表格详情
  async getTableDetails(tableName: string) {
    try {
      const response = await api.get(`/database/tables/${tableName}`)
      if (response.data.success) {
        return {
          success: true,
          data: response.data.data
        }
      } else {
        return {
          success: false,
          message: response.data.message || '获取表格详情失败'
        }
      }
    } catch (error) {
      console.error('获取表格详情失败:', error)
      return {
        success: false,
        message: error.message || '获取表格详情失败'
      }
    }
  }
  
  // 获取表格数据
  async getTableData(tableName: string, page: number = 1, size: number = 10) {
    try {
      const response = await api.get(`/database/tables/${tableName}/data`, {
        params: { page, size }
      })
      if (response.data.success) {
        return {
          success: true,
          data: response.data.data
        }
      } else {
        return {
          success: false,
          message: response.data.message || '获取表格数据失败'
        }
      }
    } catch (error) {
      console.error('获取表格数据失败:', error)
      return {
        success: false,
        message: error.message || '获取表格数据失败'
      }
    }
  }
  
  // 获取表字段信息
  async getTableFields(tableName: string) {
    try {
      console.log('获取表字段信息，表名:', tableName)
      const response = await api.get(`/database/tables/${tableName}/fields`)
      console.log('API响应:', response)
      if (response.success) {
        return {
          success: true,
          data: response.data
        }
      } else {
        return {
          success: false,
          message: response.message || '获取表字段信息失败'
        }
      }
    } catch (error) {
      console.error('获取表字段信息失败:', error)
      return {
        success: false,
        message: error.message || '获取表字段信息失败'
      }
    }
  }

  // 执行自定义SQL查询（保留兼容性，但建议使用结构化查询）
  async executeCustomQuery(sql: string) {
    try {
      const response = await api.post('/database/executeCustomSQL', { sql })
      console.log('executeCustomQuery API响应:', response)
      
      // 后端返回格式: {success: true, data: [...]}
      if (response && response.success && response.data) {
        return {
          success: true,
          data: response.data
        }
      } else if (response && response.success === false) {
        return {
          success: false,
          message: response.message || 'API调用失败',
          data: []
        }
      } else {
        return {
          success: false,
          message: 'API响应格式错误',
          data: []
        }
      }
    } catch (error) {
      console.error('执行SQL查询失败:', error)
      return {
        success: false,
        error: error.message,
        data: []
      }
    }
  }
  
  // 执行结构化查询（安全版本）
  async executeStructuredQuery(tableName: string, fields: string[], conditions: any[] = [], limit?: number) {
    try {
      const requestData = {
        tableName,
        fields,
        conditions,
        limit
      }
      
      const response = await api.post('/database/executeStructuredQuery', requestData)
      console.log('executeStructuredQuery API响应:', response)
      
      if (response && response.success && response.data) {
        return {
          success: true,
          data: response.data
        }
      } else if (response && response.success === false) {
        return {
          success: false,
          message: response.message || 'API调用失败',
          data: []
        }
      } else {
        return {
          success: false,
          message: 'API响应格式错误',
          data: []
        }
      }
    } catch (error) {
      console.error('执行结构化查询失败:', error)
      return {
        success: false,
        error: error.message,
        data: []
      }
    }
  }
}

// 创建数据库服务实例
const databaseService = new DatabaseService()

// 导出常用方法
export const getDatabaseTables = () => databaseService.getTables()
export const getTableDetails = (tableName: string) => databaseService.getTableDetails(tableName)
export const getTableData = (tableName: string, page?: number, size?: number) => databaseService.getTableData(tableName, page, size)
export const getTableFields = (tableName: string) => databaseService.getTableFields(tableName)
export const executeCustomQuery = (sql: string) => databaseService.executeCustomQuery(sql)
export const getInterfaceResources = (page?: number, size?: number) => databaseService.getInterfaceResources(page, size)
export const getInterfaceResourcesCount = () => databaseService.getInterfaceResourcesCount()
export const getAllInterfaceResources = () => databaseService.getAllInterfaceResources()

export default DatabaseService