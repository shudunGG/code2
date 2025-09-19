<template>
  <div class="field-selection">
    <h4>选择查询字段</h4>
    <div class="field-checkboxes">
      <label v-for="field in fields" :key="field.name" class="field-checkbox">
        <input 
          type="checkbox" 
          :value="field.name"
          :checked="selectedFields.includes(field.name)"
          @change="handleFieldChange(field.name, $event)"
        >
        <span>{{ field.name }} ({{ field.type }})</span>
      </label>
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
  fields: Field[]
  selectedFields: string[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:selectedFields': [fields: string[]]
}>()

const handleFieldChange = (fieldName: string, event: Event) => {
  const target = event.target as HTMLInputElement
  const currentFields = [...props.selectedFields]
  
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
  
  emit('update:selectedFields', currentFields)
}
</script>

<style scoped>
.field-selection h4 {
  margin: 0 0 12px 0;
  color: #495057;
  font-size: 16px;
}

.field-checkboxes {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 12px;
  max-height: 200px;
  overflow-y: auto;
  padding: 12px;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  background-color: #f8f9fa;
}

.field-checkbox {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 6px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.field-checkbox:hover {
  background-color: #e9ecef;
}

.field-checkbox input[type="checkbox"] {
  margin: 0;
}
</style>