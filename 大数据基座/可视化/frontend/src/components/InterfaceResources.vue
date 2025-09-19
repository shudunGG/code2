<template>
  <div class="interface-resources-container">


    <!-- 搜索区域 -->
    <div class="search-section">
      <div class="search-left">
        <span class="search-label">表名称/表编码:</span>
        <input 
          v-model="searchKeyword" 
          type="text" 
          placeholder="请输入表名称或表编码（支持中英文）"
          class="search-input"
        />
        <button @click="loadData" class="search-btn">查询</button>
        <button @click="clearSearch" class="reset-btn">重置</button>
      </div>
      
    </div>
    
    <!-- 数据表格 -->
    <div class="table-container">

      <div class="table-wrapper">
        <div v-if="loading" class="loading-overlay">
          <div class="loading-spinner">加载中...</div>
        </div>
        <table class="data-table" v-if="!loading && filteredData.length > 0">
          <thead>
            <tr>
              <th class="sequence-col">序号</th>
              <th class="table-code-col">表编码</th>
            <th class="table-name-col">表名称</th>
              <th class="source-system-col">来源系统</th>
              <th class="create-time-col">创建时间</th>
              <th class="action-col">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in paginatedData" :key="item.资源ID || index" class="table-row">
              <td class="sequence-cell">{{ (currentPage - 1) * pageSize + index + 1 }}</td>
              <td class="table-code-cell">{{ item.表编码 }}</td>
            <td class="table-name-cell">{{ item.资源名称 }}</td>
              <td class="source-system-cell">{{ item.来源系统名称 || '-' }}</td>
              <td class="create-time-cell">{{ formatDate(item.创建时间) || '-' }}</td>
              <td class="action-cell">
                <button class="action-btn view-btn" @click="viewTableDetails(item)">查看</button>
              </td>
            </tr>
          </tbody>
        </table>
        
        <div v-else-if="!loading && filteredData.length === 0" class="empty-state">
          <div class="empty-icon">📋</div>
          <p>暂无数据</p>
        </div>
      </div>
      
      <!-- 分页组件 -->
      <div class="pagination" v-if="filteredData.length > 0">
        <div class="pagination-info">
          共 {{ filteredData.length }} 条记录，第 {{ currentPage }} / {{ totalPages }} 页
        </div>
        <div class="pagination-controls">
          <button 
            @click="currentPage = Math.max(1, currentPage - 1)" 
            :disabled="currentPage === 1"
            class="page-btn"
          >
            上一页
          </button>
          
          <span class="page-numbers">
            <button 
              v-for="page in visiblePages" 
              :key="page"
              @click="currentPage = page"
              :class="['page-number', { active: page === currentPage }]"
            >
              {{ page }}
            </button>
          </span>
          
          <button 
            @click="currentPage = Math.min(totalPages, currentPage + 1)" 
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { getAllInterfaceResources } from '../services/database'

// 防抖函数
function debounce<T extends (...args: any[]) => any>(func: T, delay: number): T {
  let timeoutId: ReturnType<typeof setTimeout>
  return ((...args: any[]) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func.apply(null, args), delay)
  }) as T
}

const router = useRouter()

// 响应式数据
const searchKeyword = ref('')
const debouncedSearchKeyword = ref('')
const data = ref([])
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const jumpPage = ref(1)
const jumpPageInput = ref('')

// 缓存机制
const dataCache = new Map()
const CACHE_DURATION = 5 * 60 * 1000 // 5分钟缓存

// 防抖搜索处理
const debouncedSearch = debounce((keyword: string) => {
  debouncedSearchKeyword.value = keyword
  currentPage.value = 1 // 重置到第一页
}, 300)

// 监听搜索关键词变化
watch(searchKeyword, (newKeyword) => {
  debouncedSearch(newKeyword)
})

// 计算属性
const filteredData = computed(() => {
  let filtered = data.value
  
  // 按表名称或表编码筛选（支持中文表名和英文表名）
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    filtered = filtered.filter(item => 
      item.资源名称?.toLowerCase().includes(keyword) ||
      item.表编码?.toLowerCase().includes(keyword)
    )
  }
  
  return filtered
})

const totalPages = computed(() => Math.ceil(filteredData.value.length / pageSize.value))

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredData.value.slice(start, end)
})

const visiblePages = computed(() => {
  const total = totalPages.value
  const current = currentPage.value
  const pages = []
  
  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) pages.push(i)
      pages.push('...', total)
    } else if (current >= total - 3) {
      pages.push(1, '...')
      for (let i = total - 4; i <= total; i++) pages.push(i)
    } else {
      pages.push(1, '...', current - 1, current, current + 1, '...', total)
    }
  }
  
  return pages
})

// 方法
const loadData = async (forceRefresh = false) => {
  const cacheKey = 'interface_resources'
  const currentTime = Date.now()
  
  // 检查缓存
  if (!forceRefresh && dataCache.has(cacheKey)) {
    const cachedData = dataCache.get(cacheKey)
    if (currentTime - cachedData.timestamp < CACHE_DURATION) {
      data.value = cachedData.data
      console.log('从缓存加载接口资源数据，共', data.value.length, '条记录')
      return
    }
  }
  
  loading.value = true
  console.log('开始加载接口资源数据...')
  try {
    const response = await getAllInterfaceResources()
    console.log('API响应:', response)
    if (response && Array.isArray(response)) {
      // 将API返回的数据转换为前端期望的格式
      const formattedData = response.map(item => ({
        资源ID: item.资源ID || item.id,
        表编码: item.表编码 || item.tableCode || item.物理表名称 || item.physicalTableName,
        资源名称: item.资源名称 || item.tableName,
        物理表名称: item.物理表名称 || item.physicalTableName,
        来源系统名称: item.来源系统名称 || item.sourceSystem,
        创建时间: item.创建时间 || item.createTime,
        更新时间: item.更新时间 || item.updateTime
      }))
      
      data.value = formattedData
      
      // 缓存数据
      dataCache.set(cacheKey, {
        data: formattedData,
        timestamp: currentTime
      })
      
      console.log('成功加载数据:', data.value.length, '条记录')
    } else {
      console.error('API返回错误:', response)
      data.value = []
    }
  } catch (error) {
    console.error('加载接口资源数据失败:', error)
    // 使用模拟数据
    data.value = [
      {
        资源ID: '1',
        表编码: 'natural_resource_table',
        资源名称: '自然资源数据表',
        来源系统名称: '自然资源系统',
        创建时间: '2024/10/10 14:43:34',
        更新时间: '2024/10/10 14:43:34'
      },
      {
        资源ID: '2',
        表编码: 'natural_resource_table1', 
        资源名称: '自然资源数据表1',
        来源系统名称: '自然资源系统',
        创建时间: '2024/10/10 14:28:01',
        更新时间: ''
      },
      {
        资源ID: '3',
        表编码: 'natural_resource_table4',
        资源名称: '自然资源数据表4',
        来源系统名称: '自然资源系统', 
        创建时间: '2024/3/8 10:52:43',
        更新时间: ''
      },
      {
        资源ID: '4',
        表编码: 'daily_data_main',
        资源名称: '日常数据子数据主',
        来源系统名称: '产业系统',
        创建时间: '2023/12/4 12:01:27',
        更新时间: ''
      },
      {
        资源ID: '5',
        表编码: 'social_service_cert',
        资源名称: '社会办理证_设计编码_电子政务办理',
        来源系统名称: '社会办理平台',
        创建时间: '2022/6/20 15:36:07',
        更新时间: ''
      },
      {
        资源ID: '6',
        表编码: 'city_basic_info',
        资源名称: '全市基本信息',
        来源系统名称: '社会办理平台',
        创建时间: '2024/8/1 19:34:20',
        更新时间: '2024/8/20 09:09:34'
      },
      {
        资源ID: '7',
        表编码: 'social_personnel_info',
        资源名称: '社会办理证_设计编码_人员人员信息',
        来源系统名称: '社会办理平台',
        创建时间: '2022/3/5 15:16:43',
        更新时间: ''
      },
      {
        资源ID: '8',
        表编码: 'social_personnel_handle',
        资源名称: '社会办理证_设计编码_设计办理_人员办理',
        来源系统名称: '社会办理平台',
        创建时间: '2022/8/22 15:09:07',
        更新时间: '2024/8/20 07:37:14'
      },
      {
        资源ID: '9',
        表编码: 'data_center_business',
        资源名称: '包含数据中心_业务中心_办理数据_人员人员信息办理',
        来源系统名称: '社会办理平台',
        创建时间: '2022/7/13 15:15:46',
        更新时间: '2024/7/21 07:40:34'
      },
      {
        资源ID: '10',
        表编码: 'social_info_handle_dec',
        资源名称: '社会办理证_设计编码_设计办理_人员办理_信息办理_信息12月信息办理办理',
        来源系统名称: '社会办理平台',
        创建时间: '2022/6/14 11:29:39',
        更新时间: ''
      }
    ]
  } finally {
    loading.value = false
  }
}

const clearSearch = () => {
  searchKeyword.value = ''
  currentPage.value = 1
}

const forceRefresh = () => {
  loadData(true)
}

const getCacheStatus = () => {
  const cacheKey = 'interface_resources'
  if (dataCache.has(cacheKey)) {
    const cachedData = dataCache.get(cacheKey)
    const currentTime = Date.now()
    const cacheAge = Math.floor((currentTime - cachedData.timestamp) / 1000)
    const remainingTime = Math.max(0, Math.floor((CACHE_DURATION - (currentTime - cachedData.timestamp)) / 1000))
    
    if (remainingTime > 0) {
      return `缓存有效 (${Math.floor(remainingTime / 60)}分${remainingTime % 60}秒后过期)`
    } else {
      return '缓存已过期'
    }
  }
  return '无缓存数据'
}

const goToPage = () => {
  if (jumpPage.value >= 1 && jumpPage.value <= totalPages.value) {
    currentPage.value = jumpPage.value
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

const formatDate = (dateString: string) => {
  if (!dateString) return '-'
  try {
    const date = new Date(dateString)
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return dateString
  }
}

const viewTableDetails = (item: any) => {
  // 跳转到表格详情页面，使用表编码（英文表名）而不是资源名称（中文表名）
  router.push({
    name: 'TableDetails',
    params: { id: item.资源ID || 'default' },
    query: { tableName: item.表编码 || item.资源名称 || '未知表名' }
  })
}



onMounted(() => {
  loadData()
})
</script>

<style scoped>
.interface-resources-container {
  padding: 0;
  background: #f5f7fa;
  min-height: 100vh;
}



/* 搜索区域样式 */
.search-section {
  background: white;
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e4e7ed;
}

.search-left {
  display: flex;
  align-items: center;
  gap: 12px;
}



.search-label {
  font-size: 14px;
  color: #606266;
  white-space: nowrap;
}

.search-input {
  padding: 8px 12px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 14px;
  width: 200px;
  transition: border-color 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #409eff;
}

.search-btn {
  padding: 8px 16px;
  background: #409eff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s ease;
}

.search-btn:hover {
  background: #66b1ff;
}

.reset-btn {
  padding: 8px 16px;
  background: white;
  color: #606266;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}

.reset-btn:hover {
  color: #409eff;
  border-color: #409eff;
}

.refresh-btn {
  padding: 8px 16px;
  background: #67c23a;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s ease;
}

.refresh-btn:hover:not(:disabled) {
  background: #85ce61;
}

.refresh-btn:disabled {
  background: #c0c4cc;
  cursor: not-allowed;
}

.cache-status {
  display: flex;
  align-items: center;
}

.cache-info {
  font-size: 12px;
  color: #909399;
  background: #f4f4f5;
  padding: 4px 8px;
  border-radius: 4px;
  border: 1px solid #e4e7ed;
}



/* 表格样式 */
.table-container {
  background: white;
  margin: 0;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
}

.table-wrapper {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
  background: white;
}

.data-table th {
  background: #f8f9fa;
  padding: 12px 16px;
  text-align: center;
  font-weight: 500;
  color: #333;
  border-bottom: 1px solid #e4e7ed;
  border-right: 1px solid #e4e7ed;
  white-space: nowrap;
}

.data-table th:last-child {
  border-right: none;
}

.data-table td {
  padding: 12px 16px;
  border-bottom: 1px solid #e4e7ed;
  border-right: 1px solid #e4e7ed;
  color: #333;
  text-align: center;
  white-space: nowrap;
}

.data-table td:last-child {
  border-right: none;
}

.table-row:hover {
  background-color: #f0f9ff;
}

.table-row:nth-child(even) {
  background-color: #fafafa;
}

.table-row:nth-child(even):hover {
  background-color: #f0f9ff;
}

/* 列宽设置 */
.sequence-col, .sequence-cell {
  width: 80px;
  min-width: 80px;
}



.table-code-col, .table-code-cell {
  width: 150px;
  min-width: 120px;
}

.table-name-col, .table-name-cell {
  width: 300px;
  min-width: 200px;
  text-align: left !important;
}

.source-system-col, .source-system-cell {
  width: 150px;
  min-width: 120px;
}

.create-time-col, .create-time-cell {
  width: 180px;
  min-width: 150px;
}

.action-col, .action-cell {
  width: 100px;
  min-width: 80px;
}

.table-name-cell {
  color: #1890ff;
  font-weight: 500;
  text-align: left;
  padding-left: 16px;
}

.view-btn {
  padding: 4px 12px;
  background: #1890ff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: background-color 0.3s ease;
}

.view-btn:hover {
  background: #40a9ff;
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

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #909399;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 15px;
}

/* Loading 样式 */
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.loading-spinner {
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  color: #409eff;
  font-size: 16px;
}

.table-wrapper {
  position: relative;
}

@media (max-width: 768px) {
  .search-section {
    flex-direction: column;
    gap: 15px;
    align-items: flex-start;
  }
  
  .search-left {
    flex-wrap: wrap;
    width: 100%;
  }
  
  .search-input {
    width: 100%;
    max-width: none;
  }
  
  .pagination {
    flex-direction: column;
    gap: 10px;
  }
  
  .pagination-controls {
    flex-wrap: wrap;
    justify-content: center;
  }
}
</style>