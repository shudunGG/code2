<template>
  <div class="table-details-container">
    <!-- 返回按钮和操作按钮 -->
    <div class="back-button-container">
      <button @click="goBack" class="back-btn">
        <span class="back-icon">←</span>
        返回首页
      </button>
      <button @click="goToTableQuery" class="query-btn">
        <span class="query-icon">🔍</span>
        表查询
      </button>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>正在加载表字段信息...</p>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="error-container">
      <div class="error-icon">⚠️</div>
      <p>{{ error }}</p>
      <button @click="() => loadTableData(true)" class="retry-btn">重试</button>
    </div>

    <!-- 数据预览区域 -->
    <div v-else-if="previewData.length > 0" class="data-preview-section">
      <div class="section-header">
        <h2>{{ tableName }} - 数据预览（前5条）</h2>
        <p class="table-info">共 {{ previewData.length }} 条记录</p>
      </div>
      
      <div class="preview-table-container" v-if="!previewLoading">
        <table class="preview-table">
          <thead>
             <tr>
               <th v-for="field in previewFields" :key="field.name">{{ field.name }}</th>
             </tr>
           </thead>
           <tbody>
             <tr v-for="(row, index) in previewData" :key="index">
               <td v-for="field in previewFields" :key="field.name">
                 {{ formatCellValue(row[field.name]) }}
               </td>
             </tr>
           </tbody>
        </table>
      </div>
      
      <div v-else class="loading-skeleton">
        <div class="skeleton-row" v-for="i in 3" :key="i">
          <div class="skeleton-cell" v-for="j in 4" :key="j"></div>
        </div>
      </div>
    </div>

    <!-- 字段信息表格 -->
    <div v-else class="table-container">
      <div class="table-header">
        <h2>{{ tableName }} - 字段信息</h2>
        <p class="table-info">共 {{ totalRecords }} 个字段</p>
      </div>
      
      <table class="details-table" v-if="paginatedTableFields.length > 0">
        <thead>
          <tr>
            <th>字段编号</th>
            <th>字段名称</th>
            <th>字段长度</th>
            <th>字段描述</th>
            <th>字段类型</th>
            <th>字段类型描述</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(field, index) in paginatedTableFields" :key="index">
            <td>{{ (currentPage - 1) * pageSize + index + 1 }}</td>
            <td>{{ field.name }}</td>
            <td>{{ field.length }}</td>
            <td>{{ field.description }}</td>
            <td>{{ field.type }}</td>
            <td>{{ field.typeDescription }}</td>
          </tr>
        </tbody>
      </table>
      
      <div v-else class="empty-state">
        <div class="empty-icon">📋</div>
        <p>该表暂无字段信息</p>
      </div>
    </div>

    <!-- 分页组件 -->
    <div class="pagination" v-if="totalRecords > 0 && totalPages > 0 && !loading">
      <div class="pagination-info">
        共 {{ totalRecords }} 条记录，第 {{ currentPage }} / {{ totalPages }} 页
      </div>
      <div class="pagination-controls">
        <button 
          @click="prevPage" 
          :disabled="currentPage === 1"
          class="page-btn"
        >
          上一页
        </button>
        
        <span class="page-numbers">
          <button 
            v-for="page in visiblePages" 
            :key="page"
            @click="goToPage(page)"
            :class="['page-number', { active: page === currentPage }]"
            :disabled="page === '...'"
          >
            {{ page }}
          </button>
        </span>
        
        <button 
          @click="nextPage" 
          :disabled="currentPage === totalPages"
          class="page-btn"
        >
          下一页
        </button>
        
        <div class="page-jump">
          <span class="page-jump-label">跳转到:</span>
          <input 
            v-model="jumpPageInput" 
            @keyup.enter="jumpToPage"
            type="number" 
            :min="1" 
            :max="totalPages"
            class="page-jump-input"
            placeholder="页码"
          >
          <button @click="jumpToPage" class="page-jump-btn">跳转</button>
        </div>
        
        <div class="page-size-selector">
          <span class="page-size-label">每页显示条数:</span>
          <select v-model="pageSize" @change="currentPage = 1" class="page-size-select">
            <option value="10">10 条</option>
            <option value="20">20 条</option>
            <option value="50">50 条</option>
            <option value="100">100 条</option>
          </select>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getTableFields, executeCustomQuery } from '../services/database'
import { DatabaseService } from '../services/database'

// 路由参数
const route = useRoute()
const router = useRouter()

// 数据库服务实例
const databaseService = new DatabaseService()

// 获取表名
const tableName = computed(() => {
  const name = route.query.tableName as string
  return name ? decodeURIComponent(name) : ''
})

// 响应式数据
const currentPage = ref(1)
const pageSize = ref(10)
const totalRecords = ref(0)
const loading = ref(false)
const tableFields = ref([])
const allTableData = ref([]) // 存储所有数据
const error = ref('')
const jumpPageInput = ref('')

// 数据预览相关
const previewData = ref([])
const previewFields = ref([])
const previewLoading = ref(false)

// 缓存机制 - 移到组件内部，避免全局缓存污染
const tableDataCache = ref(new Map())
const previewDataCache = ref(new Map())
const CACHE_DURATION = 5 * 60 * 1000 // 5分钟缓存

// 计算属性
const totalPages = computed(() => {
  const records = totalRecords.value
  const size = pageSize.value
  
  // 严格的数据类型和边界条件检查
  if (typeof records !== 'number' || typeof size !== 'number' ||
      !Number.isFinite(records) || !Number.isFinite(size) ||
      records <= 0 || size <= 0) {
    return 0
  }
  
  const result = Math.ceil(records / size)
  return Number.isFinite(result) ? result : 0
})

const visiblePages = computed(() => {
  const pages = []
  const total = totalPages.value
  const current = currentPage.value
  
  // 严格的数据类型和边界条件检查
  if (typeof total !== 'number' || typeof current !== 'number' || 
      !Number.isFinite(total) || !Number.isFinite(current) ||
      total <= 0 || current <= 0 || current > total) {
    return pages
  }
  
  if (total <= 7) {
    // 如果总页数小于等于7，显示所有页码
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    // 总页数大于7时，使用省略号
    if (current <= 4) {
      // 当前页在前面时：1 2 3 4 5 ... 总页数
      for (let i = 1; i <= 5; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(total)
    } else if (current >= total - 3) {
      // 当前页在后面时：1 ... 总页数-4 总页数-3 总页数-2 总页数-1 总页数
      pages.push(1)
      pages.push('...')
      for (let i = Math.max(1, total - 4); i <= total; i++) {
        pages.push(i)
      }
    } else {
      // 当前页在中间时：1 ... 当前页-1 当前页 当前页+1 ... 总页数
      pages.push(1)
      pages.push('...')
      for (let i = current - 1; i <= current + 1; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(total)
    }
  }
  
  return pages
})

// 计算当前页显示的字段
const paginatedTableFields = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return allTableData.value.slice(start, end)
})

// 获取表字段信息
const loadTableData = async (forceRefresh = false) => {
  if (!tableName.value) {
    error.value = '表名不能为空'
    return
  }
  
  const cacheKey = tableName.value
  
  // 如果强制刷新，清空缓存
  if (forceRefresh) {
    tableDataCache.value.delete(cacheKey)
    console.log(`强制刷新：清空表 ${tableName.value} 的字段缓存`)
  }
  
  // 检查缓存
  if (!forceRefresh && tableDataCache.value.has(cacheKey)) {
    const cachedData = tableDataCache.value.get(cacheKey)
    const currentTime = Date.now()
    if (currentTime - cachedData.timestamp < CACHE_DURATION) {
      allTableData.value = cachedData.fieldList
      totalRecords.value = cachedData.totalRecords
      console.log(`从缓存加载表 ${tableName.value} 的字段信息，共 ${totalRecords.value} 个字段`)
      return
    } else {
      // 缓存过期，删除旧缓存
      tableDataCache.value.delete(cacheKey)
      console.log(`表 ${tableName.value} 的字段缓存已过期，重新获取数据`)
    }
  }
  
  loading.value = true
  error.value = ''
  
  try {
    // 获取表字段信息
    const response = await getTableFields(tableName.value)
    
    if (response.success && response.data) {
      const fields = response.data
      
      if (fields && fields.length > 0) {
        // 处理MySQL DESCRIBE命令返回的字段信息
        const fieldList = fields.map((field, index) => {
          // MySQL DESCRIBE返回的字段：Field, Type, Null, Key, Default, Extra
          const fieldName = field.Field || field.field || '未知字段'
          const fieldType = field.Type || field.type || 'unknown'
          const isNullable = field.Null || field.null || 'NO'
          const defaultValue = field.Default || field.default || null
          const extra = field.Extra || field.extra || ''
          
          // 解析字段长度
          let fieldLength = '--'
          const lengthMatch = fieldType.match(/\((\d+)\)/)
          if (lengthMatch) {
            fieldLength = lengthMatch[1]
          }
          
          // 转换字段类型为中文描述
          let typeDescription = '字符串型'
          if (fieldType.toLowerCase().includes('int') || fieldType.toLowerCase().includes('decimal') || fieldType.toLowerCase().includes('float') || fieldType.toLowerCase().includes('double')) {
            typeDescription = '数值型'
          } else if (fieldType.toLowerCase().includes('date') || fieldType.toLowerCase().includes('time')) {
            typeDescription = '日期型'
          } else if (fieldType.toLowerCase().includes('text') || fieldType.toLowerCase().includes('varchar') || fieldType.toLowerCase().includes('char')) {
            typeDescription = '字符串型'
          } else if (fieldType.toLowerCase().includes('bool') || fieldType.toLowerCase().includes('bit')) {
            typeDescription = '布尔型'
          }
          
          // 获取字段注释，优先使用Comment字段，如果没有则使用默认格式
          const fieldComment = field.Comment || field.comment || ''
          const fieldDescription = fieldComment && fieldComment.trim() !== '' 
            ? fieldComment 
            : `${tableName.value}表的${fieldName}字段`
          
          return {
            name: fieldName,
            length: fieldLength,
            description: fieldDescription,
            type: typeDescription,
            typeDescription: fieldType,
            nullable: isNullable === 'YES' ? '是' : '否',
            defaultValue: defaultValue || '--',
            extra: extra || '--'
          }
        })
        
        allTableData.value = fieldList
        totalRecords.value = fieldList.length
        
        // 缓存数据
        tableDataCache.value.set(cacheKey, {
          fieldList,
          totalRecords: fieldList.length,
          timestamp: Date.now()
        })
        
        console.log(`成功加载表 ${tableName.value} 的字段信息，共 ${totalRecords.value} 个字段`)
      } else {
        error.value = '该表没有字段信息'
        console.error('表字段信息为空')
      }
    } else {
      error.value = response.message || '获取表字段信息失败'
      console.error('获取表字段信息失败:', response.message)
    }
  } catch (err: any) {
    error.value = err.message || '获取表字段信息失败'
    console.error('获取表字段信息失败:', err)
  } finally {
    loading.value = false
  }
}

// 方法
const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const goToPage = (page: number | string) => {
  if (page !== '...' && typeof page === 'number' && page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

const jumpToPage = () => {
  const pageNum = parseInt(jumpPageInput.value)
  if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages.value) {
    currentPage.value = pageNum
    jumpPageInput.value = '' // 清空输入框
  } else {
    // 如果输入无效，可以给用户提示
    alert(`请输入1到${totalPages.value}之间的有效页码`)
  }
}

const goBack = () => {
  window.history.back()
}

const goToTableQuery = () => {
  router.push({
    path: '/table-query',
    query: { tableName: tableName.value }
  })
}

// 加载数据预览（使用安全的结构化查询）
const loadPreviewData = async (forceRefresh = false) => {
  if (!tableName.value) {
    error.value = '表名不能为空'
    return
  }

  const cacheKey = `preview_${tableName.value}`
  
  // 强制清空所有预览缓存，确保不会显示错误的数据
  if (forceRefresh) {
    previewDataCache.value.clear()
    console.log(`强制刷新：清空所有预览数据缓存`)
  }
  
  // 检查缓存
  if (!forceRefresh && previewDataCache.value.has(cacheKey)) {
    const cachedData = previewDataCache.value.get(cacheKey)
    const currentTime = Date.now()
    if (currentTime - cachedData.timestamp < CACHE_DURATION) {
      previewData.value = cachedData.data
      previewFields.value = cachedData.fields
      console.log(`从缓存加载表 ${tableName.value} 的预览数据，共 ${previewData.value.length} 条记录`)
      return
    } else {
      // 缓存过期，删除旧缓存
      previewDataCache.value.delete(cacheKey)
      console.log(`表 ${tableName.value} 的预览数据缓存已过期，重新获取数据`)
    }
  }

  previewLoading.value = true
  error.value = ''
  
  // 清空当前显示的数据，防止显示旧数据
  previewData.value = []
  previewFields.value = []
  
  try {
    console.log(`[${new Date().toLocaleTimeString()}] 执行预览查询: ${tableName.value}`)
    
    // 使用安全的结构化查询API
    const response = await databaseService.executeStructuredQuery(
      tableName.value,
      ['*'], // 查询所有字段
      [], // 无条件
      5 // 限制5条记录
    )
    
    if (response.success && response.data) {
      previewData.value = response.data || []
      
      // 从数据中提取字段信息
      if (previewData.value.length > 0) {
        const firstRow = previewData.value[0]
        previewFields.value = Object.keys(firstRow).map(key => ({ name: key }))
      }
      
      // 缓存数据
      previewDataCache.value.set(cacheKey, {
        data: previewData.value,
        fields: previewFields.value,
        timestamp: Date.now()
      })
      
      console.log(`[${new Date().toLocaleTimeString()}] 成功加载表 ${tableName.value} 的预览数据，共 ${previewData.value.length} 条记录`)
      console.log(`[${new Date().toLocaleTimeString()}] 预览数据示例:`, previewData.value.slice(0, 1))
    } else {
      error.value = response.message || '获取数据预览失败'
      console.error(`[${new Date().toLocaleTimeString()}] 获取预览数据失败:`, response.message)
    }
  } catch (err) {
    console.error(`[${new Date().toLocaleTimeString()}] 获取数据预览失败:`, err)
    error.value = '网络错误，请稍后重试'
  } finally {
    previewLoading.value = false
  }
}

// 格式化单元格值
const formatCellValue = (value) => {
  if (value === null || value === undefined) {
    return '-'
  }
  if (typeof value === 'string' && value.trim() === '') {
    return '-'
  }
  return value
}

// 监听页面大小变化，重置到第一页
watch(pageSize, () => {
  currentPage.value = 1
})

// 监听表名变化
watch(tableName, async (newTableName, oldTableName) => {
  if (newTableName && newTableName !== oldTableName) {
    console.log(`[${new Date().toLocaleTimeString()}] 表名变化: ${oldTableName} -> ${newTableName}`)
    
    // 清空之前的数据
    allTableData.value = []
    previewData.value = []
    previewFields.value = []
    error.value = ''
    currentPage.value = 1
    
    // 强制清空所有缓存，确保不会显示错误的数据
    tableDataCache.value.clear()
    previewDataCache.value.clear()
    console.log(`[${new Date().toLocaleTimeString()}] 强制清空所有缓存`)
    
    // 重新加载数据（强制从服务器获取）
    await loadTableData(true)
    // 字段数据加载完成后，自动加载预览数据
    if (!error.value) {
      loadPreviewData(true) // 强制刷新预览数据
    }
  }
})

// 组件挂载时加载数据
onMounted(async () => {
  if (tableName.value) {
    // 清空所有缓存，确保获取最新数据
    tableDataCache.value.clear()
    previewDataCache.value.clear()
    console.log('组件挂载：清空所有缓存')
    
    await loadTableData()
    // 字段数据加载完成后，自动加载预览数据
    if (!error.value) {
      loadPreviewData()
    }
  }
})
</script>

<style scoped>
.table-details-container {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: 100vh;
  font-family: 'Microsoft YaHei', Arial, sans-serif;
}

/* 返回按钮容器 */
.back-button-container {
  margin-bottom: 20px;
  display: flex;
  gap: 12px;
  align-items: center;
}

/* 加载状态 */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #409eff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-container p {
  color: #666;
  font-size: 14px;
  margin: 0;
}

/* 错误状态 */
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.error-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.error-container p {
  color: #f56c6c;
  font-size: 14px;
  margin: 0 0 16px 0;
  text-align: center;
}

.retry-btn {
  padding: 8px 16px;
  background: #409eff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s ease;
}

.retry-btn:hover {
  background: #337ecc;
}

/* 表头信息 */
.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 20px;
  border-radius: 8px 8px 0 0;
  border-bottom: 1px solid #e4e7ed;
}

.table-header h2 {
  margin: 0 0 8px 0;
  font-size: 20px;
  font-weight: 600;
  color: #333;
}

.table-info {
  margin: 0;
  font-size: 14px;
  color: #666;
}

.table-header .preview-btn {
  padding: 8px 16px;
  background: #409eff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
}

.table-header .preview-btn:hover {
  background: #337ecc;
  transform: translateY(-1px);
}

.table-header .preview-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  background: white;
  border-radius: 0 0 8px 8px;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-state p {
  color: #999;
  font-size: 14px;
  margin: 0;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: #409eff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(64, 158, 255, 0.3);
}

.back-btn:hover {
  background: #337ecc;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(64, 158, 255, 0.4);
}

.back-icon {
  font-size: 16px;
  font-weight: bold;
}

.query-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: #67c23a;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(103, 194, 58, 0.3);
}

.query-btn:hover {
  background: #529b2e;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(103, 194, 58, 0.4);
}

.query-icon {
  font-size: 16px;
}

.header-left {
  display: flex;
  flex-direction: column;
}

.table-title {
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 8px 0;
}

.table-subtitle {
  font-size: 14px;
  opacity: 0.9;
}

.detail-label {
  color: #e3f2fd;
  font-weight: 500;
}



/* 数据预览区域样式 */
.data-preview-section {
  margin-bottom: 30px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  color: white;
}

.section-header h2 {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
}

.refresh-btn, .preview-btn {
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
}

.refresh-btn:hover, .preview-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-1px);
}

.refresh-btn:disabled, .preview-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.preview-table-container {
  overflow-x: auto;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.preview-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  min-width: 600px;
}

.preview-table th,
.preview-table td {
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid #e8e8e8;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
}

.preview-table th {
  background: #f8f9fa;
  font-weight: 600;
  color: #333;
  position: sticky;
  top: 0;
  z-index: 10;
}

.preview-table tbody tr:hover {
  background: #f9f9f9;
}

/* 表格容器 */
.table-container {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.table-container .details-table {
  border-radius: 0 0 8px 8px;
}

.details-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.details-table th {
  background: #f8f9fa;
  padding: 12px 16px;
  text-align: center;
  font-weight: 500;
  color: #333;
  border-bottom: 1px solid #e4e7ed;
  border-right: 1px solid #e4e7ed;
  white-space: nowrap;
}

.details-table th:last-child {
  border-right: none;
}

.details-table td {
  padding: 12px 16px;
  border-bottom: 1px solid #e4e7ed;
  border-right: 1px solid #e4e7ed;
  color: #333;
  text-align: center;
  white-space: nowrap;
}

.details-table td:last-child {
  border-right: none;
}

.details-table tbody tr:hover {
  background-color: #f0f9ff;
}

.details-table tbody tr:nth-child(even) {
  background-color: #fafafa;
}

.details-table tbody tr:nth-child(even):hover {
  background-color: #f0f9ff;
}

.details-table tbody tr:last-child td {
  border-bottom: none;
}

/* 分页样式 */
.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: white;
  border-top: 1px solid #e4e7ed;
}

.pagination-info {
  color: #666;
  font-size: 14px;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 12px;
}

.page-btn {
  padding: 6px 12px;
  background: white;
  color: #666;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}

.page-btn:hover:not(:disabled) {
  color: #1890ff;
  border-color: #1890ff;
}

.page-btn:disabled {
  background: #f5f5f5;
  color: #bfbfbf;
  cursor: not-allowed;
  border-color: #d9d9d9;
}

.page-numbers {
  display: flex;
  gap: 4px;
}

.page-number {
  padding: 6px 10px;
  background: white;
  color: #666;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  min-width: 32px;
  text-align: center;
  transition: all 0.3s ease;
}

.page-number:hover {
  color: #1890ff;
  border-color: #1890ff;
}

.page-number.active {
  background: #1890ff;
  color: white;
  border-color: #1890ff;
}

.page-size-selector {
  display: flex;
  align-items: center;
  gap: 8px;
}

.page-size-label {
  color: #666;
  font-size: 14px;
  white-space: nowrap;
}

.page-size-select {
  padding: 4px 8px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
  background: white;
  color: #666;
  cursor: pointer;
  transition: border-color 0.3s ease;
}

.page-size-select:focus {
  outline: none;
  border-color: #1890ff;
}

/* 页码跳转样式 */
.page-jump {
  display: flex;
  align-items: center;
  gap: 8px;
}

.page-jump-label {
  font-size: 14px;
  color: #666;
  white-space: nowrap;
}

.page-jump-input {
  width: 60px;
  padding: 4px 8px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
  text-align: center;
  transition: border-color 0.3s ease;
}

.page-jump-input:focus {
  outline: none;
  border-color: #1890ff;
}

.page-jump-btn {
  padding: 4px 12px;
  background: #1890ff;
  color: white;
  border: 1px solid #1890ff;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}

.page-jump-btn:hover {
  background: #40a9ff;
  border-color: #40a9ff;
}

.page-jump-btn:active {
  background: #096dd9;
  border-color: #096dd9;
}

/* 骨架屏样式 */
.loading-skeleton {
  margin-top: 20px;
}

.skeleton-row {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.skeleton-cell {
  height: 40px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 4px;
  flex: 1;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.no-data {
  text-align: center;
  padding: 40px;
  color: #666;
  font-size: 14px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .table-details-container {
    padding: 10px;
  }
  
  .header {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }
  
  .pagination {
    flex-direction: column;
    gap: 10px;
  }
  
  .pagination-controls {
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .details-table {
    font-size: 12px;
  }
  
  .details-table th,
  .details-table td {
    padding: 8px 6px;
  }
}
</style>