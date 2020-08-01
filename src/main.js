import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/styles/clear.css' // 全局样式重置
import './assets/styles/mdf-elementUI.css' // 对elementUI 进行部分样式修改
import 'element-ui/lib/theme-chalk/index.css' // elementUi 样式
import './plugins/element.js' // element UI组件的注册都在这个文件里面
import './assets/styles/font/iconfont.css' // 自定义图标
import axios from 'axios'
import './mock/mock' // 导入mock 模拟一些数据
import ZkTable from 'vue-table-with-tree-grid'

Vue.component(ZkTable.name, ZkTable)

axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/' // 配置基本的请求路径
// axios.defaults.baseURL = 'http://127.0.0.1:8888/' // 配置基本的请求路径
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})

Vue.prototype.$http = axios // 挂载到Vue对象
Vue.config.productionTip = false
window.store = store
window.$http = axios
const vm = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
window.vm = vm
