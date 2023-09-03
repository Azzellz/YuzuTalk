import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import App from './App.vue'
import router from './router'
import plugin from './plugin'


const app = createApp(App)

app.use(createPinia())
app.use(ElementPlus)
app.use(router)
app.use(plugin)

import * as ElementPlusIconsVue from '@element-plus/icons-vue'
//!引入全部图标,后续可以优化引入部分
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.mount('#app')
