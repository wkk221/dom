<template>
  <div class="m-section m-section--login">
    <div class="m-login m-login--box">
      <div class="m-login__avatar"><img src="" alt=""></div>
      {{ arr }}
      <button @click="ax">push</button>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
export default {
  computed: {
    ...mapState('login', {
      arr: ({ arr }) => arr, // 命名空间形式的映射
      admin: ({ admin }) => admin // 管理员
    })
  },
  methods: {
    ...mapActions(''), // reqLogin
    ax () {
      this.$store.dispatch('login/reqLogin', Math.random())
    }
  }
}
</script>
<style lang="less">
  .m-login--box{
    position: absolute;
    width: 300px;
    height: 300px;
    left: 50%;
    top: 50%;
    transform:translate(-50%,-50%);

    background: #e1e1e1;
  }
</style>
