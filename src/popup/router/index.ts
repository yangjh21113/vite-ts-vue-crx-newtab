import { createRouter, createWebHashHistory } from 'vue-router'
import App from '@/popup/popup.vue'

const routes = [
  { path: '/login', component: App, exact: true },
  {
    path: '/',
    component: App
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
