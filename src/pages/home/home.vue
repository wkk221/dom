<template>
  <el-container class="m-section m-section--home">
    <!-- 头部 -->
    <el-header class="bg-hd">
      <div class="m-section__brand">
        <img src="../../assets/logo.png" alt />
        <span>XX后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <!-- 侧边菜单 -->
      <el-aside width="200px" class="bg-aside" :class="{'is-open':unfold}">
        <el-menu
          :collapse="unfold"
          unique-opened
          router
          background-color="#333744"
          text-color="#fff"
          active-text-color="red"
          :default-active="currentMenu"
          :collapse-transition="false"
          class="resetBorder"
        >
          <el-submenu :index="item.path" v-for="item in newMenus" :key="item.id">
            <!-- 一级标题 -->
            <template slot="title">
              <i class="iconfont iconSize" :class="item.icon"></i>
              <span slot="title" class="iconSpace">{{ item.authName }}</span>
            </template>
            <!-- 二级结构 -->
            <el-menu-item :index="cld.path" v-for="cld in item.children" :key="cld.id" @click="saveNavState(cld.path)">
              <template slot="title">
                <i class="iconfont iconSize" :class="cld.icon"></i>
                <span slot="title" class="iconSpace">{{ cld.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 主体.子路由展示 -->
      <el-main class="bg-main">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
import { mapState, mapGetters } from 'vuex'
export default {
  data() {
    return {
      screenWidth: 0,
      screenHeight: 0,
      scltimer: null,
      currentMenu: 'users'
    }
  },
  computed: {
    ...mapState('menus', {
      menus: (state) => state.menus // 请求到的菜单信息
    }),
    // mapGetters 的映射方式有点奇葩。
    ...mapGetters('menus', {
      newMenus: 'newMenus'
    }),
    unfold () {
      // 计算宽度是否达到限制
      return this.screenWidth <= 1200
    }
  },
  methods: {
    // 退出登录逻辑
    logout() {
      // 提示是否需要退出登录?
      this.$messageBox
        .confirm('是否确定退出登录?', '退出登录', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          showCancelButton: true,
          type: 'warning'
        })
        .then(() => {
          // 确定走这里
          this.$store.dispatch('login/logout', {
            cb: () => {
              this.$message({
                type: 'warning',
                message: '退出成功'
              })
              this.$router.push('/login')
            }
          })
        })
        .catch((action) => {})
    },
    // 请求侧边菜单列表
    async reqMenus() {
      const { data: res } = await this.$http.get('menus')

      // 请求失败走这里
      if (!res.meta.status === 200) {
        return this.$message({
          type: 'error',
          message: res.meta.msg
        })
      }

      // 成功则继续往下走
      this.$store.dispatch('menus/reqMenu', {
        data: res.data
      })
    },
    // 将登录展开状态保存到会话。
    saveNavState(path) {
      // 存储到会话
      window.sessionStorage.setItem('path', path)
      this.currentMenu = path
    },
    // 还原点击项
    resetNavState() {
      this.currentMenu = window.sessionStorage.getItem('path')
    }
  },
  mounted() {
    // 还原菜单默认展开项
    this.resetNavState()
    // 获取浏览器当前宽度
    this.screenWidth = document.body.clientWidth
    this.screenHeight = document.body.clientHeight
    window.onresize = () => {
      return (() => {
        clearTimeout(this.scltimer)
        this.scltimer = setTimeout(() => {
          this.screenWidth = document.body.clientWidth
          this.screenHeight = document.body.clientHeight
        }, 300)
      })()
    }
  },
  created() {
    this.reqMenus() // 请求菜单信息
  }
}
</script>
<style lang="less" scope>
.m-section--home {
  height: 100%;
  .el-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .m-section__brand {
      height: 100%;
      display: flex;
      align-items: center;
      img {
        height: 100%;
      }
      span {
        font-size: 25px;
        color: #ffffff;
        padding-left: 0.5em;
      }
    }
  }
  .el-aside {
    &.is-open {
      width: 64px !important;
    }
  }
  .el-main {
  }
}
</style>
