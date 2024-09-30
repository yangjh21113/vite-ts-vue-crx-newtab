import { createRouter, createWebHashHistory } from 'vue-router'
import APP from '@/offscreen/newtab/index.vue'
import Home from '@/offscreen/newtab/views/home.vue'
import Setting from '@/offscreen/newtab/views/setting/index.vue'
import TechStudy from '@/offscreen/newtab/views/techStudy/index.vue'
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
        path: 'techStudy',
        component: TechStudy
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
