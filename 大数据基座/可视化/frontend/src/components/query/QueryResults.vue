<template>
  <div class="query-results-section">
    <div class="results-header">
      <div class="section-header">
        <h3>查询结果</h3>
        <p v-if="results.length > 0" class="results-info">共 {{ results.length }} 条记录</p>
      </div>
      
      <!-- 字段筛选功能 -->
      <div class="field-filter" v-if="selectedFields.length > 0">
        <h4>字段筛选</h4>
        <div class="filter-checkboxes">
          <label v-for="field in selectedFields" :key="field" class="filter-checkbox">
            <input 
              type="checkbox" 
              :value="field"
              :checked="visibleFields.includes(field)"
              @change="handleFieldVisibilityChange(field, $event)"
            >
            <span>{{ field }}</span>
          </label>
        </div>
      </div>
    </div>

    <!-- 结果表格 -->
    <div class="results-table-container">
      <div v-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
        <p>正在查询数据...</p>
      </div>
      
      <div v-else-if="error" class="error-container">
        <div class="error-icon">⚠️</div>
        <p>{{ error }}</p>
        <button @click="$emit('retry')" class="retry-btn">重试</button>
      </div>
      
      <div v-else-if="results.length === 0" class="empty-state">
        <div class="empty-icon">📊</div>
        <p>暂无查询结果，请执行查询</p>
      </div>
      
      <div v-else class="results-grid">
        <!-- 表头 -->
        <div class="grid-header">
          <div v-for="field in visibleFields" :key="field" class="grid-header-cell">
            {{ field }}
          </div>
        </div>
        
        <!-- 数据行 -->
        <div v-for="(row, index) in paginatedResults" :key="index" class="grid-row">
          <div v-for="field in visibleFields" :key="field" class="grid-cell">
            {{ row[field] || '-' }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  results: any[]
  selectedFields: string[]
  visibleFields: string[]
  loading?: boolean
  error?: string
  currentPage: number
  pageSize: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:visibleFields': [fields: string[]]
  retry: []
}>()

const paginatedResults = computed(() => {
  const start = (props.currentPage - 1) * props.pageSize
  const end = start + props.pageSize
  return props.results.slice(start, end)
})

const handleFieldVisibilityChange = (fieldName: string, event: Event) => {
  const target = event.target as HTMLInputElement
  const currentFields = [...props.visibleFields]
  
  if (target.checked) {
    if (!currentFields.includes(fieldName)) {
      currentFields.push(fieldName)
    }
  } else {
    const index = currentFields.indexOf(fieldName)
    if (index > -1) {
      currentFields.splice(index, 1)
    }
  }
  
  emit('update:visibleFields', currentFields)
}
</script>

<style scoped>
.query-results-section {
  background: white;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  border-bottom: 2px solid #e9ecef;
  padding-bottom: 12px;
}

.section-header h3 {
  margin: 0 0 8px 0;
  color: #2c3e50;
}

.results-info {
  margin: 0;
  color: #6c757d;
  font-size: 14px;
}

.field-filter {
  min-width: 200px;
}

.field-filter h4 {
  margin: 0 0 12px 0;
  color: #495057;
  font-size: 14px;
}

.filter-checkboxes {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filter-checkbox {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  font-size: 14px;
}

.results-table-container {
  overflow-x: auto;
  margin-bottom: 20px;
}

.results-grid {
  width: 100%;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  overflow: hidden;
}

.grid-header {
  display: flex;
  background-color: #f8f9fa;
  border-bottom: 2px solid #dee2e6;
}

.grid-header-cell {
  flex: 1;
  padding: 12px;
  font-weight: 600;
  color: #495057;
  border-right: 1px solid #dee2e6;
  min-width: 120px;
  text-align: left;
}

.grid-header-cell:last-child {
  border-right: none;
}

.grid-row {
  display: flex;
  border-bottom: 1px solid #dee2e6;
}

.grid-row:last-child {
  border-bottom: none;
}

.grid-row:hover {
  background-color: #f8f9fa;
}

.grid-cell {
  flex: 1;
  padding: 12px;
  border-right: 1px solid #dee2e6;
  min-width: 120px;
  text-align: left;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.grid-cell:last-child {
  border-right: none;
}

/* 加载和错误状态样式 */
.loading-container,
.error-container,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  text-align: center;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-icon,
.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.retry-btn {
  padding: 10px 20px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  margin-top: 12px;
}

.retry-btn:hover {
  background: #0056b3;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .results-header {
    flex-direction: column;
    gap: 16px;
  }
}
</style>