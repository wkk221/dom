// import Vue from 'vue'
import { SET_ADMIN } from '../mutation-types'

export default {
  namespaced: true, // 启用命名空间
  state: {
    admin: {}
  },
  mutations: {
    [SET_ADMIN] (state, user) {
      console.log(user)
      state.admin = user
    }
  },
  actions: {
    // 登录逻辑
    login ({ commit }, { cb, data }) {
      window.sessionStorage.setItem('token', data.token)
      commit(SET_ADMIN, data)
      cb && cb()
    },
    // 退出登录逻辑
    logout ({ commit }, { cb }) {
      // 删除登录状态
      window.sessionStorage.removeItem('token')
      commit(SET_ADMIN, {})
      cb && cb()
    }
  },
  getters: {

  }
}
