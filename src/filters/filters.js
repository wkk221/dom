import Vue from 'vue'
import format from 'date-fns/format'

// 时间格式化过滤器
Vue.filter('date-format', (value) => {
  return format(value, 'yyyy-MM-dd HH:mm:ss')
})
