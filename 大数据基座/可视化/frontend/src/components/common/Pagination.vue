<template>
  <div class="pagination" v-if="totalItems > 0">
    <div class="pagination-info">
      共 {{ totalItems }} 条记录，第 {{ currentPage }} / {{ totalPages }} 页
    </div>
    <div class="pagination-controls">
      <button 
        @click="$emit('prevPage')" 
        :disabled="currentPage === 1"
        class="page-btn"
      >
        上一页
      </button>
      
      <span class="page-numbers">
        <button 
          v-for="page in visiblePages" 
          :key="page"
          @click="handlePageClick(page)"
          :class="['page-number', { active: page === currentPage }]"
          :disabled="page === '...'"
        >
          {{ page }}
        </button>
      </span>
      
      <button 
        @click="$emit('nextPage')" 
        :disabled="currentPage === totalPages"
        class="page-btn"
      >
        下一页
      </button>
      
      <div class="page-size-selector">
        <span class="page-size-label">每页显示:</span>
        <select :value="pageSize" @change="handlePageSizeChange" class="page-size-select">
          <option value="10">10 条</option>
          <option value="20">20 条</option>
          <option value="50">50 条</option>
          <option value="100">100 条</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  currentPage: number
  pageSize: number
  totalItems: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  prevPage: []
  nextPage: []
  goToPage: [page: number]
  updatePageSize: [size: number]
}>()

const totalPages = computed(() => Math.ceil(props.totalItems / props.pageSize))

const visiblePages = computed(() => {
  const pages: (number | string)[] = []
  const start = Math.max(1, props.currentPage - 2)
  const end = Math.min(totalPages.value, props.currentPage + 2)
  
  // 添加第一页
  if (start > 1) {
    pages.push(1)
    if (start > 2) {
      pages.push('...')
    }
  }
  
  // 添加中间页码
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  // 添加最后一页
  if (end < totalPages.value) {
    if (end < totalPages.value - 1) {
      pages.push('...')
    }
    pages.push(totalPages.value)
  }
  
  return pages
})

const handlePageClick = (page: number | string) => {
  if (typeof page === 'number' && page !== props.currentPage) {
    emit('goToPage', page)
  }
}

const handlePageSizeChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  const newSize = parseInt(target.value)
  emit('updatePageSize', newSize)
}
</script>

<style scoped>
.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  padding: 16px;
  background-color: #f8f9fa;
  border-radius: 6px;
}

.pagination-info {
  color: #6c757d;
  font-size: 14px;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 12px;
}

.page-btn {
  padding: 8px 16px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.page-btn:hover:not(:disabled) {
  background: #0056b3;
}

.page-btn:disabled {
  background: #6c757d;
  cursor: not-allowed;
}

.page-numbers {
  display: flex;
  gap: 4px;
}

.page-number {
  padding: 8px 12px;
  background: #f8f9fa;
  color: #495057;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.page-number:hover:not(:disabled) {
  background: #e9ecef;
}

.page-number.active {
  background: #007bff;
  color: white;
  border-color: #007bff;
}

.page-number:disabled {
  cursor: default;
  background: transparent;
  border: none;
}

.page-size-selector {
  display: flex;
  align-items: center;
  gap: 8px;
}

.page-size-label {
  font-size: 14px;
  color: #6c757d;
}

.page-size-select {
  padding: 6px 10px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  background-color: white;
  font-size: 14px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .pagination {
    flex-direction: column;
    gap: 12px;
  }
  
  .pagination-controls {
    flex-wrap: wrap;
    justify-content: center;
  }
}
</style>