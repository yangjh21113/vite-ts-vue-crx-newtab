import { createRouter, createWebHashHistory } from 'vue-router'
import APP from '@/offscreen/newtab/index.vue'
import Home from '@/offscreen/newtab/views/home.vue'
import Setting from '@/offscreen/newtab/views/setting/index.vue'
const routes = [
  {
    path: '/',
    component: APP,
    redirect: 'home',
    children: [
      {
        path: 'home',
        component: Home
      },
      {
        path: 'setting',
        component: Setting
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
