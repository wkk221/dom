import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../pages/login/login.vue'
import Home from '../pages/home/home.vue'
import _404 from '../pages/404/404.vue'

// 二级路由
import Welcome from '../pages/home/welcome.vue'
import Users from '../pages/home/users/users.vue'
import Rights from '../pages/home/power/rights.vue'
import Roles from '../pages/home/power/roles.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login,
    name: 'login'
  },
  {
    path: '/home',
    component: Home,
    name: 'home',
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/users', component: Users },
      { path: '/roles', component: Roles }, // 角色
      { path: '/rights', component: Rights } // 权限
    ]
  },
  {
    path: '*',
    component: _404
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  // 检测token
  const token = sessionStorage.getItem('token')

  // 如果登录状态正确则条状回原页面.
  if (to.path === '/login') {
    return !token ? next() : next('/home')
  }
  if (!token) { return next('/login') } // 不存在则跳转到登录页面
  next()
})

export default router
