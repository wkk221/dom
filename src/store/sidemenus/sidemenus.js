import { SET_MENUS } from '../mutation-types'

export default {
  namespaced: true, // 启用命名空间
  state: {
    menus: [],
    icons: {
      125: 'icon-certified-supplier-fill', // 用户管理
      110: 'icon-Customermanagement-fill', // 用户列表

      103: 'icon-security-fill', // 权限管理
      111: 'icon-office-supplies-fill', // 角色列表
      112: 'icon-wuliudingdan', // 权限列表

      101: 'icon-product', // 商品管理
      104: 'icon-Similarproducts-fill', // 商品列表
      115: 'icon-order-fill', // 分类参数
      121: 'icon-salescenter-fill', // 商品分类

      102: 'icon-pic-fill', // 订单管理
      107: 'icon-order-fill', // 订单列表

      145: 'icon-tradingvolume', // 数据报表
      146: 'icon-topsales' // 数据列表
    }
  },
  mutations: {
    [SET_MENUS](state, list) {
      state.menus = list
    }
  },
  actions: {
    reqMenu({ commit }, { data }) {
      commit(SET_MENUS, data)
    }
  },
  getters: {
    newMenus(state) {
      return state.menus.map(e => {
        e.children = e.children.map(cld => {
          return { ...cld, icon: state.icons[cld.id] }
        })
        return {
          ...e,
          icon: state.icons[e.id]
        }
      })
    }
  }
}
