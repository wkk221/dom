// import Vue from 'vue'
import { SET_USERS } from '../mutation-types'

export default {
  namespaced: true, // 启用命名空间
  state: {
    users: []
  },
  mutations: {
    [SET_USERS] (state, users) {
      state.users = users
    }
  },
  actions: {
    // 接收用户列表
    reqUsers ({ commit }, users) {
      commit(SET_USERS, users)
    },
    // 添加用户
    async addUser ({ commit }, user) {
      const { data: res } = await window.$http.post('users', user)
      console.log(res, '-->返回状态码')
    },
    // 根据列表进行添加
    addUserList ({ commit, dispatch }, userList) {
      console.log('开始遍历数组')
      let INDEX = 0
      const timer = setInterval(() => {
        if (INDEX < userList.length) {
          dispatch('addUser', userList[INDEX])
          INDEX++
        } else {
          clearInterval(timer)
          console.log('数据添加完毕-->停止定时器')
        }
      }, 1500)
      console.log(window.$http, '???', INDEX)
    }
  },
  getters: {

  }
}
