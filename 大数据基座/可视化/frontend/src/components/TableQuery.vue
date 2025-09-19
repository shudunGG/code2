<template>
  <div class="table-query-container">
    <!-- 返回按钮 -->
    <BackButton />
    
    <!-- 状态显示区域 -->
    <StatusBanner 
      :loading="loading" 
      :error="error" 
      loading-text="正在加载表字段信息..."
      @retry="loadTableFields"
    />



    <!-- 数据预览区域 -->
    <DataPreview 
      :table-name="tableName"
      :preview-data="previewData"
      :preview-fields="previewFields"
    />

    <!-- 可视化SQL查询区域 -->
    <div class="sql-query-section">
      <div class="section-header">
        <h3>可视化SQL查询</h3>
      </div>
      
      <div class="query-builder">
        <!-- 字段选择区域 -->
        <FieldSelection 
          :fields="tableFields"
          v-model:selected-fields="selectedFields"
        />

        <!-- 查询条件区域 -->
        <QueryConditions 
          :fields="tableFields"
          v-model:conditions="queryConditions"
        />
        <!-- 查询操作按钮 -->
        <QueryActions 
          :can-execute="selectedFields.length > 0"
          :show-s-q-l="showSQL"
          :generated-s-q-l="generatedSQL"
          @execute="executeQuery"
          @reset="resetQuery"
          @toggle-s-q-l="showGeneratedSQL"
          @view-all="viewAllData"
        />
      </div>
    </div>

    <!-- 查询结果展示区域 -->
    <QueryResults 
      :results="queryResults"
      :selected-fields="selectedFields"
      v-model:visible-fields="visibleFields"
      :loading="loading"
      :error="error"
      :current-page="currentPage"
      :page-size="pageSize"
      @retry="executeQuery"
    />

    <!-- 分页组件 -->
    <Pagination 
      v-if="queryResults.length > 0"
      :total="queryResults.length"
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onActivated, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getTableFields, executeCustomQuery } from '../services/database'
import { DatabaseService } from '../services/database'
import BackButton from './common/BackButton.vue'
import StatusBanner from './common/StatusBanner.vue'
import DataPreview from './table/DataPreview.vue'
import FieldSelection from './query/FieldSelection.vue'
import QueryConditions from './query/QueryConditions.vue'
import QueryActions from './query/QueryActions.vue'
import QueryResults from './query/QueryResults.vue'
import Pagination from './common/Pagination.vue'

// 路由相关
const route = useRoute()
const router = useRouter()

// 数据库服务实例
const databaseService = new DatabaseService()
const tableName = ref(decodeURIComponent(route.query.tableName as string || ''))

// 表结构数据
const tableFields = ref([])
const loading = ref(false)
const error = ref('')

// 查询构建器数据
const selectedFields = ref([])
const queryConditions = ref([])
const showSQL = ref(false)

// 查询结果数据
const queryResults = ref([])
const visibleFields = ref([])
const currentPage = ref(1)
const pageSize = ref(20)

// 数据预览数据
 const previewData = ref([])
 const previewFields = ref([])

// 计算属性

const generatedSQL = computed(() => {
  if (selectedFields.value.length === 0) return ''
  
  // 注意：这里仅用于显示，实际查询使用安全的API
  let sql = `SELECT ${selectedFields.value.join(', ')} FROM ${tableName.value}`
  
  const validConditions = queryConditions.value.filter(c => c.field && c.operator)
  if (validConditions.length > 0) {
    sql += ' WHERE '
    validConditions.forEach((condition, index) => {
      if (index > 0) {
        sql += ` ${condition.logic} `
      }
      
      if (condition.operator === 'IS NULL' || condition.operator === 'IS NOT NULL') {
        sql += `${condition.field} ${condition.operator}`
      } else {
        const value = condition.operator === 'LIKE' ? `'%${condition.value}%'` : `'${condition.value}'`
        sql += `${condition.field} ${condition.operator} ${value}`
      }
    })
  }
  
  return sql
})

// 方法
const goBack = () => {
  router.push('/')
}

const loadTableFields = async () => {
  loading.value = true
  error.value = ''
  
  console.log('=== 开始加载表字段 ===')
  console.log('表名:', tableName.value)
  console.log('当前时间:', new Date().toISOString())
  
  // 验证表名
  if (!tableName.value || tableName.value.trim() === '') {
    error.value = '请提供有效的表名参数'
    loading.value = false
    return
  }
  
  // 验证表名格式（只允许字母、数字、下划线）
  if (!/^[a-zA-Z0-9_]+$/.test(tableName.value)) {
    error.value = `表名格式无效：${tableName.value}。表名只能包含字母、数字和下划线`
    loading.value = false
    return
  }
  
  try {
    console.log('调用getTableFields API...')
    const response = await getTableFields(tableName.value)
    console.log('=== API响应详情 ===')
    console.log('完整响应:', response)
    console.log('响应类型:', typeof response)
    console.log('响应success字段:', response?.success)
    
    if (response.success) {
      console.log('=== API调用成功 ===')
      console.log('原始字段数据:', response.data)
      console.log('字段数据类型:', typeof response.data)
      console.log('字段数据长度:', response.data?.length)
      
      // 转换后端返回的字段格式
      const rawFields = response.data || []
      console.log('准备转换的原始字段:', rawFields)
      
      tableFields.value = rawFields.map((field, index) => {
        console.log(`处理第${index + 1}个字段:`, field)
        // 处理MySQL DESCRIBE命令返回的字段格式
        const fieldName = field.Field || field.field || field.name || '未知字段'
        const fieldType = field.Type || field.type || 'unknown'
        const comment = field.Comment || field.comment || field.description || ''
        
        // 解析字段长度
        let fieldLength = ''
        const lengthMatch = fieldType.match(/\((\d+)\)/)
        if (lengthMatch) {
          fieldLength = lengthMatch[1]
        }
        
        const convertedField = {
          name: fieldName,
          type: fieldType.replace(/\(\d+\)/, ''), // 移除长度信息
          length: fieldLength,
          description: comment,
          displayName: comment || fieldName
        }
        console.log(`转换后的字段${index + 1}:`, convertedField)
        return convertedField
      })
      
      console.log('=== 字段转换完成 ===')
      console.log('转换后的字段总数:', tableFields.value.length)
      console.log('最终字段数据:', tableFields.value)
      
      // 清除错误状态
      error.value = ''
      
      // 加载字段信息后，自动加载前5条数据预览
      await loadPreviewData()
    } else {
      console.log('API调用失败')
      error.value = response.message || '获取表字段信息失败'
      tableFields.value = []
    }
    
    console.log('最终字段数据:', tableFields.value)
  } catch (err) {
    console.error('加载表字段失败:', err)
    error.value = '网络连接失败，请检查后端服务是否正常运行'
    tableFields.value = []
  } finally {
    loading.value = false
  }
}

const loadPreviewData = async () => {
  if (tableFields.value.length === 0) {
    console.log('没有字段信息，跳过预览数据加载')
    return
  }
  
  try {
     console.log(`=== 开始加载表 ${tableName.value} 的预览数据 ===`)
     
     // 先清空当前预览数据，避免显示旧数据
     previewData.value = []
     previewFields.value = []
     
     // 过滤掉包含危险关键字的字段（后端已处理，但前端也保留检查）
     const dangerousKeywords = ['CREATE', 'DROP', 'DELETE', 'UPDATE', 'INSERT', 'ALTER', 'TRUNCATE']
     const safeFields = tableFields.value.filter(field => {
       const upperFieldName = field.name.toUpperCase()
       return !dangerousKeywords.some(keyword => upperFieldName.includes(keyword))
     })
     
     console.log('原始字段数量:', tableFields.value.length)
     console.log('安全字段数量:', safeFields.length)
     
     // 使用所有安全字段，如果没有安全字段则使用所有字段
     const fieldsToUse = safeFields.length > 0 ? safeFields : tableFields.value
     const fieldNames = fieldsToUse.map(field => field.name)
     
     console.log('执行预览查询，字段:', fieldNames)
     
     // 使用安全的结构化查询API
     const response = await databaseService.executeStructuredQuery(
       tableName.value,
       fieldNames,
       [], // 无条件
       5 // 限制5条记录
     )
     
     console.log('预览数据响应:', response)
    
    if (response && response.success) {
       previewData.value = response.data || []
       // 更新预览字段列表，显示所有实际查询的字段
       previewFields.value = fieldsToUse
       console.log(`表 ${tableName.value} 预览数据加载成功:`, previewData.value.length, '条记录')
       console.log('预览字段:', previewFields.value.map(f => f.name))
     } else {
       console.error('预览数据加载失败:', response)
       previewData.value = []
       previewFields.value = []
     }
  } catch (error) {
    console.error('加载预览数据失败:', error)
    // 预览数据加载失败不影响主要功能，只记录错误
    previewData.value = []
    previewFields.value = []
  }
}

const formatCellValue = (value) => {
  if (value === null || value === undefined) {
    return '-'
  }
  if (typeof value === 'string' && value.length > 50) {
    return value.substring(0, 50) + '...'
  }
  return value
}





const executeQuery = async () => {
  if (selectedFields.value.length === 0) {
    error.value = '请至少选择一个查询字段'
    return
  }
  
  loading.value = true
  error.value = ''
  
  try {
    // 构建结构化查询参数
    const fields = selectedFields.value
    const conditions = queryConditions.value
      .filter(condition => condition.field && condition.operator)
      .map(condition => ({
        field: condition.field,
        operator: condition.operator,
        value: condition.value,
        logic: condition.logic
      }))
    
    console.log('执行结构化查询:', { table: tableName.value, fields, conditions })
    
    // 使用结构化查询API替代直接SQL执行
    const response = await executeCustomQuery(generatedSQL.value)
    console.log('API响应:', response)
    console.log('响应类型:', typeof response)
    console.log('响应success:', response?.success)
    console.log('响应data:', response?.data)
    console.log('响应data类型:', typeof response?.data)
    console.log('响应data长度:', Array.isArray(response?.data) ? response.data.length : 'not array')
    
    if (response && response.success) {
      queryResults.value = response.data || []
      visibleFields.value = [...selectedFields.value]
      console.log('设置查询结果:', queryResults.value)
      console.log('查询结果长度:', queryResults.value.length)
      
      if (queryResults.value.length === 0) {
        error.value = '查询成功，但没有找到符合条件的数据'
      } else {
        error.value = ''
      }
    } else {
      console.error('API响应失败:', response)
      if (response && response.error) {
        error.value = `API调用失败: ${response.error}`
      } else if (response && response.message) {
        error.value = `API调用失败: ${response.message}`
      } else {
        error.value = 'API调用失败，请检查后端服务'
      }
      queryResults.value = []
      visibleFields.value = []
    }
    
    currentPage.value = 1
  } catch (err) {
    console.error('查询执行失败:', err)
    error.value = '查询执行失败，请检查查询条件'
  } finally {
    loading.value = false
  }
}

const resetQuery = () => {
  selectedFields.value = []
  queryConditions.value = []
  queryResults.value = []
  visibleFields.value = []
  showSQL.value = false
  currentPage.value = 1
  error.value = ''
}

const viewAllData = async () => {
  // 使用安全的结构化查询，无需手动过滤危险关键字（后端已处理）
  const safeFields = tableFields.value.filter(field => {
    const upperFieldName = field.name.toUpperCase()
    const dangerousKeywords = ['CREATE', 'DROP', 'DELETE', 'UPDATE', 'INSERT', 'ALTER', 'TRUNCATE']
    return !dangerousKeywords.some(keyword => upperFieldName.includes(keyword))
  })
  
  console.log('原始字段数量:', tableFields.value.length)
  console.log('安全字段数量:', safeFields.length)
  
  // 自动选择安全字段
  selectedFields.value = safeFields.map(field => field.name)
  // 清空查询条件
  queryConditions.value = []
  // 执行查询
  await executeQuery()
}

const testDirectAPI = async () => {
  console.log('=== 开始直接API测试 ===')
  console.log('当前表字段:', tableFields.value)
  console.log('字段名列表:', tableFields.value.map(f => f.name))
  
  // 检查字段名中是否包含CREATE
  const fieldsWithCreate = tableFields.value.filter(f => f.name.toUpperCase().includes('CREATE'))
  console.log('包含CREATE的字段:', fieldsWithCreate)
  
  try {
    const response = await fetch('/api/database/executeCustomSQL', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        sql: 'SELECT * FROM up_pro_base LIMIT 3'
      })
    })
    
    console.log('Fetch响应状态:', response.status)
    console.log('Fetch响应OK:', response.ok)
    
    const data = await response.json()
    console.log('Fetch响应数据:', data)
    console.log('数据类型:', typeof data)
    console.log('数据结构:', Object.keys(data))
    
    if (data && data.data) {
      console.log('实际数据:', data.data)
      console.log('数据条数:', data.data.length)
      // 直接设置到查询结果中
      queryResults.value = data.data
      visibleFields.value = tableFields.value.map(field => field.name)
      selectedFields.value = tableFields.value.map(field => field.name)
      console.log('已设置查询结果:', queryResults.value)
    }
  } catch (error) {
    console.error('直接API测试失败:', error)
  }
  console.log('=== 直接API测试结束 ===')
}

const showGeneratedSQL = () => {
  showSQL.value = !showSQL.value
}



// 监听路由参数变化，更新表名
watch(() => route.query.tableName, (newTableName) => {
  if (newTableName && newTableName !== tableName.value) {
    const decodedTableName = decodeURIComponent(newTableName as string)
    console.log(`路由参数变化：表名从 ${tableName.value} 变更为 ${decodedTableName}`)
    tableName.value = decodedTableName
  }
})

// 监听表名变化，清空预览数据
watch(tableName, (newTableName, oldTableName) => {
  if (newTableName !== oldTableName) {
    console.log(`表名从 ${oldTableName} 变更为 ${newTableName}，清空预览数据`)
    previewData.value = []
    previewFields.value = []
    queryResults.value = []
    visibleFields.value = []
    selectedFields.value = []
    queryConditions.value = []
    error.value = ''
    
    // 重新加载表字段
    if (newTableName && newTableName !== '未知表名') {
      loadTableFields()
    }
  }
})

// 生命周期
onMounted(() => {
  console.log(`TableQuery组件挂载，当前表名: ${tableName.value}`)
  // 清空所有数据，确保干净的初始状态
  previewData.value = []
  previewFields.value = []
  queryResults.value = []
  visibleFields.value = []
  selectedFields.value = []
  queryConditions.value = []
  error.value = ''
  
  loadTableFields()
})

// 处理keep-alive缓存激活时的数据刷新
onActivated(() => {
  console.log('TableQuery组件被激活（从keep-alive缓存中恢复）')
  const currentTableName = decodeURIComponent(route.query.tableName as string || '未知表名')
  if (currentTableName !== tableName.value) {
    console.log(`检测到表名变化：${tableName.value} -> ${currentTableName}`)
    tableName.value = currentTableName
  }
})
</script>

<style scoped>
.table-query-container {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
  background-color: #f8f9fa;
  min-height: 100vh;
}

/* 状态横幅样式 */
.status-banner {
  margin-bottom: 20px;
}

.loading-banner {
  background: #d1ecf1;
  color: #0c5460;
  padding: 12px 16px;
  border-radius: 4px;
  border-left: 4px solid #bee5eb;
  font-size: 14px;
}

.error-banner {
  background: #f8d7da;
  color: #721c24;
  padding: 12px 16px;
  border-radius: 4px;
  border-left: 4px solid #f5c6cb;
  font-size: 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.error-banner .retry-btn {
  background: #dc3545;
  color: white;
  border: none;
  padding: 4px 8px;
  border-radius: 3px;
  cursor: pointer;
  font-size: 12px;
  margin-left: 10px;
}

.error-banner .retry-btn:hover {
  background: #c82333;
}

/* 返回按钮样式 */
.back-button-container {
  margin-bottom: 20px;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: #6c757d;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
}

.back-btn:hover {
  background: #5a6268;
}

.back-icon {
  font-size: 16px;
}

/* 通用区域样式 */
.table-structure-section,
.sql-query-section,
.query-results-section {
  background: white;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  border-bottom: 2px solid #e9ecef;
  padding-bottom: 12px;
}

.refresh-btn {
  background: #007bff;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.refresh-btn:hover:not(:disabled) {
  background: #0056b3;
}

.refresh-btn:disabled {
  background: #6c757d;
  cursor: not-allowed;
}

.section-header h2,
.section-header h3 {
  margin: 0 0 8px 0;
  color: #2c3e50;
}

.table-info,
.results-info {
  margin: 0;
  color: #6c757d;
  font-size: 14px;
}

/* 表结构展示样式 */
.structure-table-container {
  overflow-x: auto;
}

.structure-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 16px;
}

.structure-table th,
.structure-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #dee2e6;
}

.structure-table th {
  background-color: #f8f9fa;
  font-weight: 600;
  color: #495057;
}

.structure-table tr:hover {
  background-color: #f8f9fa;
}





/* 响应式设计 */
@media (max-width: 768px) {
  .table-query-container {
    padding: 12px;
  }
  
  .condition-row {
    flex-direction: column;
    align-items: stretch;
  }
  
  .query-actions {
    flex-direction: column;
  }
  
  .results-header {
    flex-direction: column;
    gap: 16px;
  }
  
  .pagination {
    flex-direction: column;
    gap: 12px;
  }
  
  .pagination-controls {
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .preview-table th,
  .preview-table td {
    max-width: 120px;
    font-size: 12px;
  }
}
</style>