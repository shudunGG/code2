<template>
  <div class="status-banner" v-if="loading || error">
    <div v-if="loading" class="loading-banner">
      ⏳ {{ loadingText }}
    </div>
    <div v-if="error" class="error-banner">
      ❌ {{ error }}
      <button v-if="showRetry" @click="$emit('retry')" class="retry-btn">重试</button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  loading?: boolean
  error?: string
  loadingText?: string
  showRetry?: boolean
}

withDefaults(defineProps<Props>(), {
  loading: false,
  error: '',
  loadingText: '正在加载...',
  showRetry: true
})

defineEmits<{
  retry: []
}>()
</script>

<style scoped>
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
</style>