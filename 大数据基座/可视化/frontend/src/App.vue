<script setup lang="ts">
import { RouterView, RouterLink } from 'vue-router'
</script>

<template>
  <div id="app">
    <nav class="main-nav">
      <div class="nav-container">
        <div class="nav-brand">
          <h1>库表可视化系统</h1>
        </div>
        <div class="nav-links">
          <a href="http://59.219.120.74:15110/#/web/webIndex" target="_blank" class="interface-resource-btn">接口资源</a>
        </div>
      </div>
    </nav>
    <main class="main-content">
      <RouterView v-slot="{ Component }">
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
      </RouterView>
    </main>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Microsoft YaHei', Arial, sans-serif;
  background-color: #f5f5f5;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-nav {
  background: #409eff;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.3);
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-container {
  padding: 0 20px 0 0;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 70px;
}

.nav-brand {
  margin-right: auto;
  margin-left: 20px;
}

.nav-brand h1 {
  color: #ffffff;
  font-size: 24px;
  font-weight: 700;
  margin: 0;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  letter-spacing: 1px;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 30px;
}

.interface-resource-btn {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  padding: 8px 16px;
  border-radius: 6px;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.interface-resource-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  color: #666;
  text-decoration: none;
  border-radius: 6px;
  transition: all 0.3s ease;
  font-size: 14px;
  font-weight: 500;
}

.nav-link:hover {
  color: #007bff;
  background: #f8f9fa;
}

.nav-link.router-link-active {
  color: #007bff;
  background: #e3f2fd;
}

.nav-icon {
  width: 18px;
  height: 18px;
}

.main-content {
  flex: 1;
  padding: 0;
}

@media (max-width: 768px) {
  .nav-container {
    padding: 0 15px;
    height: 56px;
  }
  
  .nav-brand h1 {
    font-size: 20px;
    color: #ffffff;
  }
  
  .nav-links {
    gap: 15px;
  }
  
  .nav-link {
    padding: 8px 12px;
    font-size: 13px;
  }
  
  .nav-icon {
    width: 16px;
    height: 16px;
  }
}
</style>
