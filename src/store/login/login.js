
// import Vue from 'vue'
import { SET_ADMIN } from '../mutation-types'

export default {
  namespaced: true, // 启用命名空间
  state: {
    arr: [1, 2, 3, 4, 5, 6],
    admin: {}
  },
  mutations: {
    [SET_ADMIN] (state, n) {
      state.arr.push(n)
    }
  },
  actions: {
    reqLogin ({ commit }, n) {
      // 登录逻辑处理
      commit(SET_ADMIN, n)
    }
  },
  getters: {

  }
}
