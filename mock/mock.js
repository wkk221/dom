import Mock from 'mockjs'
// import { createNamespacedHelpers } from 'vuex'
window.Mock = Mock

Mock.mock('http://127.0.0.1:8888/api/private/v1/mock', 'get', {
  code: 0,
  'data|40': [{
    username: /(AAA|BBB|CCC|DDD|EEE|FFF|JJJ)[0-9A-Z]{3,5}/, // 用户名
    password: '123456', // 密码
    email: /^\w[0-9a-zA-Z]{6,8}@(gmail|qq|163|126|outlook)\.(com|cn|media|top|org)/, // 邮箱
    mobile: /(188|135|177|169)\d{8}/ // 电话号码
  }]
})
// Mock.mock('/mock', { code: 0, data: shops }
// Mock.mock('/mock', { code: 0, data: shops }) // 如何让名称正确?

// Mock.mock('/info', { code: 0, data: info }) // 商家信息
// Mock.mock('/goods', { code: 0, 'data|5-9': goods }) // 商家商品
// Mock.mock('/rating', { code: 0, 'data|10-50': ratings, code2: function () { return this.code } }) // 商家评价
