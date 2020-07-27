<template>
  <div class="m-section m-section--users">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片主体 -->
    <el-card class="box-card cardTop">
      <el-row :gutter="24">
        <!-- 搜索部分 -->
        <el-col :span="6">
          <el-input placeholder="请输入内容" v-model="usersFrom.query" clearable @clear="reqUsers">
            <el-button slot="append" icon="el-icon-search" @click="reqUsers"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="info" @click="dialogFormVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 表格部分 -->
      <el-table :data="users" border style="width: 100%" class="cardTop">
        <el-table-column type="index" label="#" ></el-table-column>
        <el-table-column prop="username" width="150" label="姓名" ></el-table-column>
        <el-table-column prop="email" width="240" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column label="状态" width="70">
          <template v-slot="scope">
            <el-switch v-model="scope.row.mg_state" @change="editUserState(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="210">
          <template v-slot="scope">
            <el-button type="primary" size="min" icon="el-icon-edit" @click="editUser(scope.row.id)" ></el-button>
            <el-button type="danger" size="min" icon="el-icon-delete" @click="deleteUser(scope.row.id)"></el-button>
            <el-tooltip class="item" effect="dark" content="设置权限" placement="top" :enterable="false">
              <el-button type="warning" size="min" icon="el-icon-setting"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页组件 -->
      <el-pagination
        class="cardTop"
        @size-change="changePagesize"
        @current-change="changePagenum"
        :current-page="1"
        :page-sizes="[5, 10, 25, 40]"
        :page-size="5"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        >
      </el-pagination>
    </el-card>
    <!-- 添加用户弹窗 -->
    <el-dialog title="添加用户" :visible.sync="dialogFormVisible" width="40%" @close="closeDialog">
      <el-form ref="creatAccountRef" :model="creatUserFrom" label-width="100px" :rules="creatUserFromRule" status-icon>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="creatUserFrom.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="creatUserFrom.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="creatUserFrom.mobile" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item  label="邮箱" prop="email">
          <el-input v-model="creatUserFrom.email" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="creatUser">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 修改用户弹窗creatUser -->
    <el-dialog title="编辑用户" :visible.sync="dialogFormVisibleEdit" width="40%" @close="closeDialogEdit">
      <el-form ref="EditAccountRef" :model="currentUser" label-width="100px" :rules="creatUserFromRule" status-icon>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="currentUser.username" autocomplete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="currentUser.mobile" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item  label="邮箱" prop="email">
          <el-input v-model="currentUser.email" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      gi<div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
        <el-button type="primary" @click="saveUser">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  data() {
    var checkEmail = (rule, value, cb) => {
      // console.log(rule, value, '==> 自定义规则')
      const RegEmail = /^(\w+\.)?[0-9a-zA-Z_-]+@[0-9a-zA-Z]+(\.[a-zA-Z])+/
      // 正确走这里
      if (RegEmail.test(value)) { return cb() }
      // 错误走这里
      cb(new Error('请输入合法的邮箱格式'))
    }
    return {
      // 请求用户列表数据。
      usersFrom: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      total: 0,
      dialogFormVisible: false,
      dialogFormVisibleEdit: false,
      creatUserFrom: {
        username: '522203003',
        password: '123456',
        email: '12324@qq.com',
        mobile: '13149933332'
      },
      // 指定id用户获取当前用户信息
      currentUser: {
        id: 0,
        username: '',
        email: '',
        mobile: ''
      },
      // 创建添加用户注册表单
      creatUserFromRule:
      {
        username: [
          { required: true, message: '用户名不得为空', trigger: 'blur' },
          { max: 12, min: 5, message: '用户名在 5-12位字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不得为空', trigger: 'blur' },
          { max: 12, min: 6, message: '密码 6-12位字符', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '电话不得为空', trigger: 'blur' },
          { max: 11, min: 11, message: '电话号码必须11位数', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '邮箱不得为空', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapState('users', {
      users: (state) => state.users
    })
  },
  methods: {
    // 请求用户数据
    async reqUsers () {
      const { data: res } = await this.$http.get('users', { params: this.usersFrom })
      // 失败走这里
      if (res.meta.status !== 200) { return }
      // 成功走这里
      this.$store.dispatch('users/reqUsers', res.data.users)
      this.total = res.data.total
    },
    changePagenum(n) {
      this.usersFrom.pagenum = n
      this.reqUsers()
    },
    // 改变数量
    changePagesize(n) {
      this.usersFrom.pagesize = n
      this.reqUsers()
    },
    // 删除用户
    deleteUser (id) {
      this.$messageBox
        .confirm('是否确定删除用户?', '删除', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          showCancelButton: true,
          type: 'warning'
        }).then(async () => {
          const { data: res } = await this.$http.delete(`users/${id}`)
          // console.log(res, ' ==> 删除状态')
          if (res.meta.status === 200) {
            this.$message({
              type: 'success',
              message: '用户删除成功'
            })
          }
          this.reqUsers()
        })
        .catch((action) => {})
    },
    // 更新用户状态
    editUserState (row) {
      this.$http.put(`users/${row.id}/state/${row.mg_state}`).then(({ data: res }) => {
        // console.log('-->数据更新成功', res)
        if (res.meta.status !== 200) {
          // 更新状态失败重置修改
          row.mg_state = !row.mg_state
          return this.$message({
            type: 'error',
            message: res.meta.msg
          })
        }
        this.$message({
          type: row.mg_state ? 'success' : 'warning',
          message: row.mg_state ? '启用权限' : '关闭权限'
        })
      })
    },
    // 根据id获取用户信息
    async getUserById (id) {
      this.currentUser = {}
      const { data: res } = await this.$http.get(`users/${id}`)
      if (res.meta.status === 200) {
        this.currentUser = res.data
      } else {
        // 不存在则返回错误信息
        this.$message({
          type: 'error',
          message: res.meta.msg
        })
      }
    },
    // 重置添加用户表单信息
    closeDialog () {
      this.$refs.creatAccountRef.resetFields()
    },
    // 创建用户
    creatUser () {
      // console.log('添加新的用户')
      this.$refs.creatAccountRef.validate(async (va, b) => {
        if (!va) {
          return this.$message({
            type: 'error',
            message: '新用户的信息有误'
          })
        }
        const { data: res } = await this.$http.post('users', this.creatUserFrom)
        console.log(res)
        if (res.meta.status === 201) {
          this.reqUsers()
          this.dialogFormVisible = false
          return this.$message({
            type: 'success',
            message: '用户添加成功'
          })
        }
        // 注册失败走这里
        this.$message({
          type: 'error',
          message: res.meta.msg
        })
      })
    },
    // 重置 编辑用户表单
    closeDialogEdit () {
      this.$refs.EditAccountRef.resetFields()
    },
    // 编辑用户信息
    async editUser (id) {
      // 1 先请求用户信息
      this.dialogFormVisibleEdit = true
      this.currentUser = {}
      const { data: res } = await this.$http.get(`users/${id}`)
      if (res.meta.status === 200) {
        this.currentUser = res.data
      } else {
        // 不存在则返回错误信息
        this.$message({
          type: 'error',
          message: res.meta.msg
        })
      }
    },
    // 保存用户信息
    saveUser () {
      // 1 保存
      this.$refs.EditAccountRef.validate(async (va, b) => {
        // 格式验证通过走这里
        if (!va) {
          return this.$message({
            type: 'error',
            message: '信息格式不正确'
          })
        }
        const { id, mobile, email } = this.currentUser
        const { data: res } = await this.$http.put(`users/${id}`, {
          mobile,
          email
        })

        // 更新失败
        if (res.meta.status !== 200) {
          return this.$message({
            type: 'error',
            message: res.meta.msg
          })
        }
        this.$message({
          type: 'success',
          message: '信息更新成功'
        })
        this.reqUsers()
        this.dialogFormVisibleEdit = false
      })
    }
  },
  created () {
    // 请求用户数据
    this.reqUsers()
  }
}
</script>
