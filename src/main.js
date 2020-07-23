import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/styles/clear.css' // 全局样式重置
import './assets/styles/mdf-elementUI.css' // 对elementUI 进行部分样式修改
import 'element-ui/lib/theme-chalk/index.css' // elementUi 样式

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
