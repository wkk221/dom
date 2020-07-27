import Vue from 'vue'
import Vuex from 'vuex'
import login from './login/login'
import menus from './sidemenus/sidemenus'
import users from './users/users'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    login,
    menus,
    users
  }
})
