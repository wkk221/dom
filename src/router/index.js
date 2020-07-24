import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../pages/login/login.vue'
import Home from '../pages/home/home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login,
    name: 'login',
    beforeEnter (to, from, next) {
      console.log('进入login的私有路由')
      next()
    }
  },
  {
    path: '/home',
    component: Home,
    name: 'home',
    beforeEnter (to, from, next) {
      console.log('进入home的私有路由')
      next()
    }
  }
]

const router = new VueRouter({
  routes
})

router.beforeResolve((to, from, next) => {
  // 全局守卫
  console.log('-->beforeResolve')
  next()
})
router.beforeEach((to, from, next) => {
  // 全局守卫1
  console.log('-->beforeEach')
  next()
})
router.afterEach((to, from) => {
  // 全局守卫2
  console.log('--->afterEach')
})

router.onError((a, b, c) => {
  console.log(a, b, c, '----> 错误会走这里')
})
export default router
