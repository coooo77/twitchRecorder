import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index'
import 'virtual:windi.css'

createApp(App)
  .use(router)
  .mount('#app')
  .$nextTick(window.removeLoading)

console.log('fs', window.fs)
console.log('ipcRenderer', window.ipcRenderer)
