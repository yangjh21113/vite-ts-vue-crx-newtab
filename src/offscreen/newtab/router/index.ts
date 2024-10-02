import { createRouter, createWebHashHistory } from 'vue-router'
import APP from '@/offscreen/newtab/index.vue'
import Home from '@/offscreen/newtab/views/home.vue'
import Setting from '@/offscreen/newtab/views/setting/index.vue'
import TechStudy from '@/offscreen/newtab/views/techStudy/index.vue'
import TechAnimateDetail from '@/offscreen/newtab/views/techDetail/animate.vue'
import TechDragDetail from '@/offscreen/newtab/views/techDetail/drag.vue'
import SelfControl from '@/offscreen/newtab/views/selfControl/index.vue'
const routes = [
  {
    path: '/',
    component: APP,
    redirect: 'home',
    children: [
      {
        name: 'home',
        path: '/home',
        component: Home
      },
      {
        path: '/techStudy',
        name: 'techStudy',
        component: TechStudy,
        children: [
          {
            name: 'techAnimateDetail',
            path: '/techAnimateDetail',
            component: TechAnimateDetail
          },
          {
            name: 'techDragDetail',
            path: '/techDragDetail',
            component: TechDragDetail
          }
        ]
      },
      {
        name: 'selfControl',
        path: '/selfControl',
        component: SelfControl
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
