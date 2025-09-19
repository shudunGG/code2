import { createRouter, createWebHistory } from 'vue-router'
import Home from '../components/Home.vue'
import InterfaceResources from '../components/InterfaceResources.vue'
import TableDetails from '../components/TableDetails.vue'
import TableQuery from '../components/TableQuery.vue'
import TestPage from '../components/TestPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/interface-resources',
      name: 'interface-resources',
      component: InterfaceResources
    },
    {
      path: '/table-details/:id',
      name: 'TableDetails',
      component: TableDetails
    },
    {
      path: '/table-query',
      name: 'TableQuery',
      component: TableQuery
    },
    {
      path: '/test',
      name: 'TestPage',
      component: TestPage
    }
    // 移除了对不存在组件的路由配置
  ],
})

export default router
