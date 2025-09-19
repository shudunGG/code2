<template>
  <div class="query-conditions">
    <h4>查询条件</h4>
    <div class="conditions-list">
      <div v-for="(condition, index) in conditions" :key="index" class="condition-row">
        <!-- 逻辑连接符 -->
        <select v-if="index > 0" v-model="condition.logic" class="logic-select" @change="updateConditions">
          <option value="AND">AND</option>
          <option value="OR">OR</option>
        </select>
        
        <!-- 字段选择 -->
        <select v-model="condition.field" class="field-select" @change="updateConditions">
          <option value="">选择字段</option>
          <option v-for="field in fields" :key="field.name" :value="field.name">
            {{ field.name }}
          </option>
        </select>
        
        <!-- 操作符选择 -->
        <select v-model="condition.operator" class="operator-select" @change="updateConditions">
          <option value="=">=</option>
          <option value="!=">!=</option>
          <option value=">">></option>
          <option value="<"><</option>
          <option value=">=">>=</option>
          <option value="<="><=</option>
          <option value="LIKE">LIKE</option>
          <option value="IN">IN</option>
          <option value="IS NULL">IS NULL</option>
          <option value="IS NOT NULL">IS NOT NULL</option>
        </select>
        
        <!-- 值输入 -->
        <input 
          v-if="condition.operator !== 'IS NULL' && condition.operator !== 'IS NOT NULL'"
          v-model="condition.value" 
          type="text" 
          placeholder="输入值"
          class="value-input"
          @input="updateConditions"
        >
        
        <!-- 删除条件按钮 -->
        <button @click="removeCondition(index)" class="remove-condition-btn">×</button>
      </div>
    </div>
    
    <button @click="addCondition" class="add-condition-btn">+ 添加条件</button>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

interface Field {
  name: string
  type: string
  length?: string
  description?: string
  displayName?: string
}

interface QueryCondition {
  field: string
  operator: string
  value: string
  logic: string
}

interface Props {
  fields: Field[]
  conditions: QueryCondition[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:conditions': [conditions: QueryCondition[]]
}>()

const addCondition = () => {
  const newConditions = [...props.conditions]
  newConditions.push({ field: '', operator: '=', value: '', logic: 'AND' })
  emit('update:conditions', newConditions)
}

const removeCondition = (index: number) => {
  const newConditions = [...props.conditions]
  newConditions.splice(index, 1)
  emit('update:conditions', newConditions)
}

const updateConditions = () => {
  emit('update:conditions', [...props.conditions])
}
</script>

<style scoped>
.query-conditions h4 {
  margin: 0 0 12px 0;
  color: #495057;
  font-size: 16px;
}

.conditions-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.condition-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  background-color: #f8f9fa;
}

.logic-select,
.field-select,
.operator-select {
  padding: 8px 12px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  background-color: white;
  min-width: 120px;
}

.value-input {
  padding: 8px 12px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  flex: 1;
  min-width: 150px;
}

.remove-condition-btn {
  padding: 6px 10px;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  line-height: 1;
}

.remove-condition-btn:hover {
  background: #c82333;
}

.add-condition-btn {
  align-self: flex-start;
  padding: 10px 16px;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}

.add-condition-btn:hover {
  background: #218838;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .condition-row {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>