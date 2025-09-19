<template>
  <div class="query-actions">
    <button @click="$emit('execute')" class="execute-btn" :disabled="!canExecute">
      执行查询
    </button>
    <button @click="$emit('reset')" class="reset-btn">
      重置
    </button>
    <button @click="$emit('toggleSQL')" class="show-sql-btn">
      {{ showSQL ? '隐藏SQL' : '查看SQL' }}
    </button>
    <button v-if="showViewAll" @click="$emit('viewAll')" class="view-all-btn">
      查看全部数据
    </button>
  </div>
  
  <!-- 生成的SQL显示 -->
  <div v-if="showSQL && generatedSQL" class="generated-sql">
    <h4>生成的SQL语句</h4>
    <pre class="sql-code">{{ generatedSQL }}</pre>
  </div>
</template>

<script setup lang="ts">
interface Props {
  canExecute: boolean
  showSQL: boolean
  generatedSQL: string
  showViewAll?: boolean
}

withDefaults(defineProps<Props>(), {
  showViewAll: true
})

defineEmits<{
  execute: []
  reset: []
  toggleSQL: []
  viewAll: []
}>()
</script>

<style scoped>
.query-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.execute-btn {
  padding: 12px 24px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
}

.execute-btn:hover:not(:disabled) {
  background: #0056b3;
}

.execute-btn:disabled {
  background: #6c757d;
  cursor: not-allowed;
}

.reset-btn,
.show-sql-btn {
  padding: 12px 24px;
  background: #6c757d;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}

.reset-btn:hover,
.show-sql-btn:hover {
  background: #5a6268;
}

.view-all-btn {
  padding: 12px 24px;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
}

.view-all-btn:hover {
  background: #218838;
}

.generated-sql {
  margin-top: 16px;
  padding: 16px;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  background-color: #f8f9fa;
}

.generated-sql h4 {
  margin: 0 0 12px 0;
  color: #495057;
}

.sql-code {
  background: #2d3748;
  color: #e2e8f0;
  padding: 16px;
  border-radius: 6px;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.5;
  overflow-x: auto;
  margin: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .query-actions {
    flex-direction: column;
  }
}
</style>