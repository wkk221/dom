<template>
  <div class="m-section m-section--login">
    <div class="m-login m-login--box">
      <!-- 头像 -->
      <div class="m-login__avatar"><img src="../../assets/logo.png" alt=""></div>
      <!-- 登录主体 -->
      <el-form label-width="0" class="m-login__from" :model="loginForm" :rules="rules" ref="logingFormRef">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input prefix-icon="iconfont icon-ic_user_a" v-model="loginForm.username"  placeholder="用户名"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input prefix-icon="iconfont icon-ic_keyboard" v-model="loginForm.password" placeholder="密码" v-if="showPassword">
            <i slot="suffix" class="iconfont icon-icon-test" style="cursor:pointer;" @click="toggleShowPassword"></i>
          </el-input>
          <el-input prefix-icon="iconfont icon-ic_keyboard"  type="password" v-model="loginForm.password" placeholder="密码"  v-else>
            <i slot="suffix" class="iconfont icon-icon-test1" style="cursor:pointer;" @click="toggleShowPassword"></i>
          </el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="m-login__btns">
          <el-button type="primary" @click="login" :loading="isLoding">登录</el-button>
          <el-button type="info" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
export default {
  data () {
    return {
      loginForm: {
        username: 'admin',
        password: '123456'
      }, // 登录所提交的表单
      showPassword: false,
      isLoding: false,
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 5, max: 12, message: '长度在 5 到 12 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ] // 密码格式验证
      }
    }
  },
  computed: {
    ...mapState('login', {
      admin: ({ admin }) => admin // 管理员
    })
  },
  methods: {
    ...mapActions('', {

    }),
    ax () {
      this.$message({
        type: 'error',
        message: '错误'
      })
      // this.$store.dispatch('login/reqLogin', Math.random())
    },
    // 切换密码的显示和隐藏
    toggleShowPassword () {
      this.showPassword = !this.showPassword
    },
    // 登录逻辑
    login () {
      this.setLoginBtn(true)
      this.$refs.logingFormRef.validate(async (va, b) => {
        // 验证失败走这里
        if (!va) { return this.$message({ type: 'error', message: '登录信息有误' }) }
        // 成功继续走这里
        const { data: res } = await this.$http.post('login', this.loginForm)
        // 登录失败
        if (res.meta.status !== 200) {
          this.setLoginBtn(false)
          this.$message({ type: 'error', message: res.meta.msg })
          return
        }
        // 登录成功
        this.$message({ type: 'success', message: '登录成功' })
        // 储存到浏览器。
        window.sessionStorage.setItem('token', res.data.token)
        // 路由跳转是怎么实现的?
        this.$router.push('/home')
      })
    },
    // 重置逻辑
    reset () {
      // 移除表单验证逻辑
      // this.$refs.logingFormRef.resetFields()
      this.$refs.logingFormRef.clearValidate()
    },
    // 设置登录按钮登陆中的逻辑
    setLoginBtn (isloding) {
      this.isLoding = isloding
    }
  },
  /*
    账户密码登录
    后台验证 ==> 这里由dispatch 来完成 ==>
    登录通过 ==> 跳转到主页
    登录失败 ==> 提示错误
  */
  beforeRouteLeave (to, from, next) {
    console.log('离开登录组件页面')
    next()
  },
  beforeRouteEnter (to, from, next) {
    console.log('进入登录组件触发')
    next()
  }
}
</script>
<style lang="less">
  .m-section--login{
    height: 100%;
    width: 100%;
    background-color: rgb(39, 74, 108);

    // 登录框
    .m-login--box{
      position: absolute;
      width: 450px;
      height: 300px;
      left: 50%;
      top: 50%;
      transform:translate(-50%,-50%);

      background: #ffffff;
      border-radius: 3px;
      //
      .m-login__avatar{
        position: absolute;
        left: 50%;
        transform: translate(-50%,-50%);
        width: 100px;
        height: 100px;
        border-radius: 50%;
        background: #ffffff;
        // border: solid 1px #333333;
        padding: 10px;
        box-shadow: 0 0 10px #ddd;
        img{
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: #dddddd;
        }
      }
      .m-login__from{
        position: absolute;
        bottom: 0;
        width: 100%;
        padding: 0 15px;
        box-sizing: border-box;
        .m-login__btns{
          display: flex;
          justify-content: flex-end;
        }
        // 修正图标位置
        .el-input__prefix{
          left: 10px;
        }
        .el-input__suffix{
          right: 10px;
        }
      }
    }
  }
</style>
