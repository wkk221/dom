<template>
  <div class="m-section m-section--home">
    主页
    <el-button type="info" @click="logout">退出</el-button>
  </div>
</template>
<script>
export default {
  methods: {
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
    }
  }
}
</script>
