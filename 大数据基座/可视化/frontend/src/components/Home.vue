<template>
  <div class="home-container">
    <div class="welcome-section">
      <h1 class="welcome-title">欢迎使用数据库管理系统</h1>
      <p class="welcome-description">
        这是一个功能强大的数据库管理平台，为您提供便捷的数据库操作和管理功能。
      </p>
    </div>
    
    <!-- 数据库表信息区域 -->
    <div class="tables-section">
      <h2 class="section-title">数据库表信息</h2>
      <div class="tables-container">
        <div v-if="loading" class="loading-container">
          <div class="loading-spinner"></div>
          <p>正在加载表信息...</p>
        </div>
        <div v-else-if="error" class="error-container">
          <p class="error-message">{{ error }}</p>
          <button @click="loadTables" class="retry-btn">重试</button>
        </div>
        <div v-else class="table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th>序号</th>
                <th>表名</th>
                <th>类型</th>
                <th>业务用途</th>
                <th>创建时间</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(table, index) in paginatedTables" :key="table.tableName">
                <td>{{ (currentPage - 1) * pageSize + index + 1 }}</td>
                <td class="table-name-cell">{{ table.tableName }}</td>
                <td>
                  <span class="table-type-tag">{{ table.tableType || '表' }}</span>
                </td>
                <td class="business-purpose">{{ table.tableComment || '暂无说明' }}</td>
                <td class="create-time">{{ formatDate(table.createTime) }}</td>
                <td class="actions-cell">
                  <router-link :to="`/table-details/${table.tableName}`" class="action-link view-link">
                    查看
                  </router-link>
                </td>
              </tr>
            </tbody>
          </table>
          
          <!-- 分页组件 -->
          <div class="pagination-wrapper">
            <div class="pagination-info">
              共 {{ totalTables }} 条记录，每页 {{ pageSize }} 条
            </div>
            <div class="pagination-controls">
              <button 
                @click="goToPage(1)" 
                :disabled="currentPage === 1"
                class="page-btn"
              >
                首页
              </button>
              <button 
                @click="goToPage(currentPage - 1)" 
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
                >
                  {{ page }}
                </button>
              </span>
              
              <button 
                @click="goToPage(currentPage + 1)" 
                :disabled="currentPage === totalPages"
                class="page-btn"
              >
                下一页
              </button>
              <button 
                @click="goToPage(totalPages)" 
                :disabled="currentPage === totalPages"
                class="page-btn"
              >
                尾页
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="features-section">
      <h2 class="section-title">系统功能</h2>
      <div class="features-grid">
        <div class="feature-card">
          <div class="feature-icon">🗄️</div>
          <h3>数据库连接</h3>
          <p>支持多种数据库类型的连接和管理</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">📊</div>
          <h3>数据分析</h3>
          <p>提供强大的数据分析和统计功能</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">🔧</div>
          <h3>系统管理</h3>
          <p>完善的系统配置和管理工具</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">📈</div>
          <h3>性能监控</h3>
          <p>实时监控数据库性能和状态</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { DatabaseService } from '../services/database'

// 响应式数据
const tables = ref<any[]>([])
const loading = ref(false)
const error = ref('')
const currentPage = ref(1)
const pageSize = ref(10)

// 数据库服务实例
const databaseService = new DatabaseService()

// 计算属性
const totalTables = computed(() => tables.value.length)
const totalPages = computed(() => Math.ceil(totalTables.value / pageSize.value))

// 分页数据
const paginatedTables = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return tables.value.slice(start, end)
})

// 可见页码
const visiblePages = computed(() => {
  const pages = []
  const total = totalPages.value
  const current = currentPage.value
  
  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) {
        pages.push(i)
      }
      pages.push('...', total)
    } else if (current >= total - 3) {
      pages.push(1, '...')
      for (let i = total - 4; i <= total; i++) {
        pages.push(i)
      }
    } else {
      pages.push(1, '...')
      for (let i = current - 1; i <= current + 1; i++) {
        pages.push(i)
      }
      pages.push('...', total)
    }
  }
  
  return pages.filter(page => page !== '...' || pages.indexOf(page) === pages.lastIndexOf(page))
})

// 跳转到指定页面
const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

// 格式化日期
const formatDate = (dateString: string) => {
  if (!dateString) return '未知'
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('zh-CN', {
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

// 加载表信息
const loadTables = async () => {
  try {
    loading.value = true
    error.value = ''
    const response = await databaseService.getTables()
    if (response.success) {
      tables.value = response.data || []
      currentPage.value = 1 // 重置到第一页
    } else {
      error.value = response.message || '获取表信息失败'
    }
  } catch (err: any) {
    console.error('加载表信息失败:', err)
    error.value = err.message || '网络错误，请稍后重试'
  } finally {
    loading.value = false
  }
}

// 组件挂载时加载数据
onMounted(() => {
  loadTables()
})
</script>

<style scoped>
.home-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.welcome-section {
  text-align: center;
  margin-bottom: 60px;
}

.welcome-title {
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 20px;
  font-weight: 600;
}

.welcome-description {
  font-size: 1.2rem;
  color: #666;
  line-height: 1.6;
  max-width: 600px;
  margin: 0 auto;
}

.features-section {
  margin-top: 40px;
}

.section-title {
  font-size: 2rem;
  color: #333;
  text-align: center;
  margin-bottom: 40px;
  font-weight: 600;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 30px;
  margin-top: 40px;
}

.feature-card {
  background: #fff;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 20px;
}

.feature-card h3 {
  font-size: 1.3rem;
  color: #333;
  margin-bottom: 15px;
  font-weight: 600;
}

.feature-card p {
  color: #666;
  line-height: 1.6;
  font-size: 1rem;
}

/* 表信息区域样式 */
.tables-section {
  margin: 60px 0;
}

.tables-container {
  margin-top: 30px;
}

.loading-container {
  text-align: center;
  padding: 60px 20px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #409eff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-container {
  text-align: center;
  padding: 40px 20px;
}

.error-message {
  color: #f56c6c;
  font-size: 1.1rem;
  margin-bottom: 20px;
}

.retry-btn {
  background: #409eff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s ease;
}

.retry-btn:hover {
  background: #337ecc;
}

/* 表格样式 */
.table-wrapper {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.data-table th {
  background: #f8f9fa;
  color: #333;
  font-weight: 600;
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid #e9ecef;
  white-space: nowrap;
}

.data-table td {
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
  color: #666;
  vertical-align: middle;
}

.data-table tbody tr:hover {
  background-color: #f8f9fa;
}

.data-table tbody tr:last-child td {
  border-bottom: none;
}

.table-name-cell {
  font-weight: 600;
  color: #333;
}

.table-type-tag {
  background: #e3f2fd;
  color: #1976d2;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  display: inline-block;
}

.business-purpose {
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.create-time {
  color: #999;
  font-size: 13px;
}

.actions-cell {
  text-align: center;
}

.action-link {
  color: #409eff;
  text-decoration: none;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 13px;
  transition: all 0.3s ease;
}

.action-link:hover {
  background: #e3f2fd;
  color: #1976d2;
}

/* 分页样式 */
.pagination-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: #fafafa;
  border-top: 1px solid #e9ecef;
}

.pagination-info {
  color: #666;
  font-size: 14px;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.page-btn {
  padding: 6px 12px;
  border: 1px solid #ddd;
  background: #fff;
  color: #666;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.3s ease;
}

.page-btn:hover:not(:disabled) {
  background: #409eff;
  color: white;
  border-color: #409eff;
}

.page-btn:disabled {
  background: #f5f5f5;
  color: #ccc;
  cursor: not-allowed;
  border-color: #e9ecef;
}

.page-numbers {
  display: flex;
  gap: 4px;
  margin: 0 8px;
}

.page-number {
  padding: 6px 10px;
  border: 1px solid #ddd;
  background: #fff;
  color: #666;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  min-width: 32px;
  text-align: center;
  transition: all 0.3s ease;
}

.page-number:hover {
  background: #409eff;
  color: white;
  border-color: #409eff;
}

.page-number.active {
  background: #409eff;
  color: white;
  border-color: #409eff;
}

@media (max-width: 768px) {
  .welcome-title {
    font-size: 2rem;
  }
  
  .welcome-description {
    font-size: 1.1rem;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .feature-card {
    padding: 25px;
  }
  
  /* 移动端表格样式 */
  .table-wrapper {
    overflow-x: auto;
  }
  
  .data-table {
    min-width: 600px;
  }
  
  .data-table th,
  .data-table td {
    padding: 8px 12px;
    font-size: 13px;
  }
  
  .business-purpose {
    max-width: 150px;
  }
  
  .pagination-wrapper {
    flex-direction: column;
    gap: 12px;
    padding: 12px 16px;
  }
  
  .pagination-controls {
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .page-numbers {
    margin: 0 4px;
  }
  
  .page-btn,
  .page-number {
    padding: 4px 8px;
    font-size: 12px;
    min-width: 28px;
  }
}
</style>