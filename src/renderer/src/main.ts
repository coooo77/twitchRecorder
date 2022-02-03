import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index'
import 'virtual:windi.css'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'vue-global-api'
import { createPinia } from 'pinia'

createApp(App)
  .use(router)
  .use(ElementPlus)
  .use(createPinia())
  .mount('#app')
  .$nextTick(window.removeLoading)

console.log('fs', window.fs)
console.log('ipcRenderer', window.ipcRenderer)
