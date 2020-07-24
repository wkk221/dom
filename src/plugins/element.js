import Vue from 'vue'
import {
  Button,
  Form,
  FormItem,
  Input,

  Message,
  MessageBox
} from 'element-ui'

// 组件式调用
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)

// API 方式调用
Vue.prototype.$message = Message
Vue.prototype.$messageBox = MessageBox
