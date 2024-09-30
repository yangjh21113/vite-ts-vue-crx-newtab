import { createApp } from 'vue'
import '@/common/assets/styles/global.scss'
import '@/common/assets/styles/reset.scss'
import App from './index.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'virtual:svg-icons-register'
import router from '@/offscreen/newtab/router/index'
const app = createApp(App)
app.use(router)
app.use(ElementPlus)
app.mount('#app')
