<template>
  <div class="m-section m-section--roles">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card cardTop">
      <el-button icon="el-icon-plus" @click="showcreatRole = true">添加角色</el-button>
      <el-table :data="roles" border style="width: 100%" class="cardTop">
        <!-- 被折叠起来的内容 -->
        <el-table-column type="expand">
          <template v-slot="scope">
              <div class="warp" v-if="scope.row.children.length">
                <el-row v-for="(item1, i1) in scope.row.children" :key="item1.id" :class="['bottomBorder', 'flex--vc', {topBorder: i1 === 0 }]">
                  <!-- 一级 -->
                  <el-col :span="5">
                    <el-tag class="e-tag--6px" closable @close="deleteRolePower(scope,item1.id)">{{ item1.authName }}{{item1.id}}</el-tag>
                    <i class="el-icon-right"></i>
                  </el-col>
                  <el-col :span="19">
                    <!-- 二级!-->
                    <el-row  v-for="(item2, i2) in item1.children" :key="item2.id" :class="[ {topBorder: i2 !== 0 }, 'flex--vc']">
                      <el-col :span="6">
                        <el-tag class="e-tag--6px" type="success" closable  @close="deleteRolePower(scope,item2.id)">{{ item2.authName }}{{item2.id}}</el-tag>
                        <i class="el-icon-right"></i>
                      </el-col>
                      <!-- 三级 -->
                      <el-col :span="18">
                        <el-row>
                          <div class="el-col">
                            <el-tag type="warning"  @close="deleteRolePower(scope,item3.id)" closable v-for="(item3) in item2.children" :key="item3.id" class="e-tag--6px">{{ item3.authName }}{{item3.id}}</el-tag>
                          </div>
                        </el-row>
                      </el-col>
                    </el-row>
                  </el-col>
                </el-row>
              </div>
              <div v-else>
                该角色暂时没有任何权限
              </div>
          </template>
        </el-table-column>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc" ></el-table-column>
        <el-table-column label="#" width="290">
          <template v-slot="scope">
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="editRoleById(scope.row.id)">编辑</el-button>
            <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteRoleById(scope.row.id)">删除</el-button>
            <el-button type="warning" size="mini" icon="el-icon-setting" @click="editPowersTree(scope)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
      {{powersChecked}}
    </el-card>
    <!-- dialog:添加 -->
    <el-dialog
      title="添加新角色"
      :visible.sync="showcreatRole"
      close-on-click-modal
      close-on-press-escape
      width="30%"
      @close="handlecreatRoleClose">
      <el-form :model="creatRoleForm" label-width="80px" ref="creatRoleRef" :rules="creatRoleRule">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="creatRoleForm.roleName" maxlength="10" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input type="textarea" v-model="creatRoleForm.roleDesc" maxlength="40" show-word-limit></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showcreatRole = false">取 消</el-button>
        <el-button type="primary" @click="creatRole">确 定</el-button>
      </span>
    </el-dialog>
    <!-- dialog:修改 -->
    <el-dialog
      title="修改角色信息"
      :visible.sync="showeditRole"
      close-on-click-modal
      close-on-press-escape
      width="30%"
      @close="handleeditRoleClose">
      <el-form :model="editRoleForm" label-width="80px" ref="editRoleRef" :rules="creatRoleRule">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRoleForm.roleName" maxlength="10" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input type="textarea" v-model="editRoleForm.roleDesc" maxlength="40" show-word-limit></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showeditRole = false">取 消</el-button>
        <el-button type="primary" @click="saveRole">确 定</el-button>
      </span>
    </el-dialog>
    <!-- dialog:分配权限  -->
    <el-dialog
      ref="gg2"
      title="分配权限"
      :visible.sync="showPowerTree"
      close-on-click-modal
      close-on-press-escape
      width="60%"
      @close="handlsetPowersClose">
      <el-tree
        ref="tree"
        :data="powerTree"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="powersChecked"
        :props="powerMap">
      </el-tree>
      <!-- :default-expanded-keys="powersChecked" -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="showPowerTree = false">取 消</el-button>
        <el-button type="primary" @click="savePowers">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      roles: [],
      powerTree: [],
      powersChecked: [], // 选中状态的id列表
      showcreatRole: false,
      showeditRole: false,
      showPowerTree: false,
      powerMap: { children: 'children', label: 'id' },
      // 创建角色
      creatRoleForm: {
        roleName: '',
        roleDesc: ''
      },
      // 编辑角色
      editRoleForm: {
        roleName: '',
        roleDesc: '',
        id: 0
      },
      // 表单验证规则
      creatRoleRule: {
        roleName: [{
          required: true,
          message: '角色名称不得为空',
          trigger: 'blur'
        },
        {
          max: 10,
          min: 2,
          trigger: 'blur',
          message: '角色名称在2-10位'
        }]
      }
    }
  },
  methods: {
    // 获取角色列表
    async getRoles () {
      const { data: res } = await this.$http.get('roles')
      // console.log(res)
      if (res.meta.status !== 200) {
        return this.$message({
          type: 'error',
          message: '错误信息' + res.meta.msg
        })
      }
      this.roles = res.data
    },
    // 创建新角色
    creatRole () {
      // 通过验证
      this.$refs.creatRoleRef.validate(async va => {
        if(!va) { return console.log('格式未通过验证') }
        const { data: res } = await this.$http.post('roles', this.creatRoleForm)
        // console.log(res)
        if( res.meta.status !== 201 ) {
          return this.$message.error('角色添加失败')
        }
        this.$message.success('角色添加成功')
        // 刷新角色列表
        this.getRoles()
        // 关闭会话框
        this.showcreatRole = false
      })
    },
    // 关闭创建新角色,清空表单
    handlecreatRoleClose () {
      this.$refs.creatRoleRef.resetFields()
      this.creatRoleForm.roleDesc = ''
      // 重置事件不会关闭没有验证规则的表单
    },
    // 删除角色
    deleteRoleById (id) {
      this.$messageBox.confirm('是否永久删除该角色?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$http.delete(`roles/${id}`)
        if (res.meta.status !== 200) {
          return this.$message.error('角色删除失败原因:' + res.meta.msg)
        }
        this.$message.success('角色删除成功')
        this.getRoles()
      }).catch(() => {})
    },
    // 编辑角色数据
    async editRoleById (id) {
      this.editRoleForm = {}
      const { data: res } = await this.$http.get(`roles/${id}`)
      console.log(res, '当前的角色')
      if (res.meta.status !== 200) {
        return this.$message.error('错误信息:' + res.meta.msg)
      }
      this.editRoleForm = {
        ...res.data,
        id
      }
      this.showeditRole = true
    },
    // 提交修改
    saveRole () {
      // console.log('保存修改')
      // 必要的表单验证 this.$refs.editRoleRef
      this.$refs.editRoleRef.validate(async va => {
        if(!va) { return this.$message.error('数据不合法') }
        const { id, roleName, roleDesc } = this.editRoleForm
        // console.log(roleDesc, '-->', typeof roleDesc)
        const { data: res } = await this.$http.put(`roles/${id}`, {
          roleName,
          roleDesc
        })
        if (res.meta.status !== 200) {
          return this.$message.error('修改失败')
        }
        this.$message.success('修改成功')
        this.getRoles()
        this.showeditRole = false
      })
    },
    // 编辑表单关闭事件
    handleeditRoleClose () {
      this.$refs.editRoleRef.resetFields()
      this.editRoleForm.roleDesc = ''
    },
    // 删除指定角色的权限
    deleteRolePower ({ row, $index }, pid) {
      // console.log(row, pid, $index, '--???')
      this.$messageBox.confirm('是否删除权限?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$http.delete(`roles/${row.id}/rights/${pid}`)
        console.log(res, '---> 删除成功之后返回数据')
        if (res.meta.status !== 200) {
          return this.$message.info('删除失败:' + res.meta.msg)
        }
        this.$message.success('权限删除成功')
        // this.getRoles()
        // 更新数据
        // row.children = res.data
        this.roles[$index].children = res.data
      }).catch(() => {
        this.$message.info('取消删除')
      })
    },
    // 分配权限
    editPowersTree (scope) {
      this.getPowersTree().then(() => {
        this.powersChecked = this.getChecked(scope.row.children, this.powersChecked)
        console.log(this.$refs)
        this.showPowerTree = true
      })
      // 提取第三级id
      /*
        this.$refs.treeRef.getCheckedKeys()
      */
    },
    // 加载权限树
    async getPowersTree () {
      const { data: res } = await this.$http.get('rights/tree')
      // 请求失败
      console.log(res)
      if (res.meta.status !== 200) {
        return this.message({
          type: 'error',
          message: res.meta.msg
        })
      }
      this.powerTree = res.data
    },
    // 保存权限
    savePowers () {
      console.log('保存权限')
      // this.showPowerTree = false
      this.$refs.tree.setCheckedKeys([]) // 重置为未选中状态。

      // eca14f8c870 setCheckedKeys
    },
    // 权限树关闭,重置选中状态
    handlsetPowersClose() {
      console.log('重置选中状态')
      // this.powersChecked = []
      this.$refs.tree.setCheckedKeys([])
    },
    // 递归提取id
    getChecked (cld, arr) {
      // 列表
      if (cld) {
        cld.forEach(e => {
          if (e.children) {
            // 有子项则继续递归
            this.getChecked(e.children, arr)
          } else {
            // 没有子项 = 3级菜单, 推入数组。
            arr.push(e.id)
          }
        })
      }
      return arr
    }
  },
  computed: {
  },
  created () {
    this.getRoles()
    // this.getPowersTree() // 取得所有权限列表
  }
}
</script>
