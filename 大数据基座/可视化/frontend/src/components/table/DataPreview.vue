<template>
  <div class="data-preview-section" v-if="previewData.length > 0">
    <div class="section-header">
      <h2>{{ tableName }} - 数据预览（前{{ previewData.length }}条）</h2>
      <p class="table-info">共 {{ previewData.length }} 条记录</p>
    </div>
    
    <div class="preview-table-container">
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
  </div>
</template>

<script setup lang="ts">
interface Field {
  name: string
  type: string
  length?: string
  description?: string
  displayName?: string
}

interface Props {
  tableName: string
  previewData: any[]
  previewFields: Field[]
}

defineProps<Props>()

const formatCellValue = (value: any) => {
  if (value === null || value === undefined) {
    return '-'
  }
  if (typeof value === 'string' && value.length > 50) {
    return value.substring(0, 50) + '...'
  }
  return value
}
</script>

<style scoped>
.data-preview-section {
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

.section-header h2 {
  margin: 0 0 8px 0;
  color: #2c3e50;
}

.table-info {
  margin: 0;
  color: #6c757d;
  font-size: 14px;
}

.preview-table-container {
  overflow-x: auto;
}

.preview-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 16px;
}

.preview-table th,
.preview-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #dee2e6;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.preview-table th {
  background-color: #e3f2fd;
  font-weight: 600;
  color: #1976d2;
  position: sticky;
  top: 0;
}

.preview-table tr:hover {
  background-color: #f8f9fa;
}

.preview-table td {
  font-size: 14px;
  color: #495057;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .preview-table th,
  .preview-table td {
    max-width: 120px;
    font-size: 12px;
  }
}
</style>