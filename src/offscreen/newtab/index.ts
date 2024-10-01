import { createApp } from 'vue'
import '@/common/assets/styles/global.scss'
import '@/common/assets/styles/reset.scss'
import App from './index.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'virtual:svg-icons-register'
import router from '@/offscreen/newtab/router/index'
import zhCn from 'element-plus/es/locale/lang/zh-cn'

const app = createApp(App)
app.use(router)
app.use(ElementPlus, {
  locale: zhCn
})
app.mount('#app')
