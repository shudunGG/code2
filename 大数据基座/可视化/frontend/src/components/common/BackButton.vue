<template>
  <div class="back-button-container">
    <button @click="handleBack" class="back-btn">
      <span class="back-icon">←</span>
      {{ text }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

interface Props {
  text?: string
  to?: string
}

const props = withDefaults(defineProps<Props>(), {
  text: '返回首页',
  to: '/'
})

const router = useRouter()

const handleBack = () => {
  router.push(props.to)
}
</script>

<style scoped>
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
</style>