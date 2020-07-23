import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../pages/login/login.vue'

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
  }
]

const router = new VueRouter({
  routes
})

export default router
