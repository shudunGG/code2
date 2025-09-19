<template>
  <div class="test-page">
    <h1>测试页面</h1>
    <p>如果你能看到这个页面，说明Vue应用正常运行</p>
    <div class="api-test">
      <h2>API测试</h2>
      <button @click="testApi">测试API调用</button>
      <div v-if="apiResult" class="api-result">
        <h3>API结果:</h3>
        <pre>{{ JSON.stringify(apiResult, null, 2) }}</pre>
      </div>
      <div v-if="apiError" class="api-error">
        <h3>API错误:</h3>
        <pre>{{ apiError }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { getAllInterfaceResources } from '../services/database'

const apiResult = ref(null)
const apiError = ref('')

const testApi = async () => {
  try {
    apiError.value = ''
    console.log('开始测试API调用...')
    const result = await getAllInterfaceResources()
    console.log('API调用成功:', result)
    apiResult.value = result
  } catch (error) {
    console.error('API调用失败:', error)
    apiError.value = error.message || error.toString()
  }
}
</script>

<style scoped>
.test-page {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.api-test {
  margin-top: 20px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.api-result, .api-error {
  margin-top: 10px;
  padding: 10px;
  border-radius: 4px;
}

.api-result {
  background-color: #f0f9ff;
  border: 1px solid #0ea5e9;
}

.api-error {
  background-color: #fef2f2;
  border: 1px solid #ef4444;
}

pre {
  white-space: pre-wrap;
  word-wrap: break-word;
}

button {
  padding: 8px 16px;
  background-color: #409eff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #337ecc;
}
</style>