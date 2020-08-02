<template>
  <div class="m-section m-section--params">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card cardTop">
      <!-- 提示 -->
      <el-alert title="注意:只允许为第三级分类设置相关参数" type="warning" show-icon></el-alert>
      <!-- 级联组件 -->
      <el-row class="cardTop">
        <el-col :span="6">
          <el-cascader
            class="wfull"
            v-model="selecetKey"
            clearable
            :options="categories"
            :props="{ expandTrigger: 'hover', label: 'cat_name', value: 'cat_id' }"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- 选项卡 -->
      <el-tabs class="cardTop" v-model="sel" @tab-click="handleTabClick">
        <el-tab-pane label="动态属性" name="many">
          <el-row>
            <el-col>
              <el-button type="primary" :disabled="isDisabled"  @click="addAttribute">添加参数</el-button>
            </el-col>
          </el-row>
          <!-- 表格部分 -->
          <el-table class="cardTop" :data="attributes" border>
            <el-table-column type="expand">
              <template v-slot="scope">
                <!-- 循环展示 -->
                <el-tag
                  @close="removeAttributeValue(scope.row)"
                  class="e-tag--6px"
                  v-for="(item, index) in scope.row.attr_vals"
                  :key="index"
                  closable
                  type="success">
                  {{item}}
                </el-tag>
                <!-- 值的输入 -->
                <el-input
                  class="input-new-tag w120"
                  v-if="inputVisible"
                  v-model="inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column label="#" type="index"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称"></el-table-column>
            <el-table-column label="操作">
              <template v-slot="scope">
                <el-button type="primary" size="mini" icon="el-icon-edit" @click="editAttribute(scope.row)">编辑</el-button>
                <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteAttribute(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-row>
            <el-col>
              <el-button type="primary" :disabled="isDisabled" @click="addAttribute">添加属性</el-button>
            </el-col>
          </el-row>
          <!-- 表格部分 -->
          <el-table class="cardTop" :data="attributes" border>
            <el-table-column type="expand">
              <template v-slot="scope">
                <el-tag
                  class="e-tag--6px"
                  v-for="(item, index) in scope.row.attr_vals"
                  :key="index"
                  closable
                  type="success">
                  {{item}}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="#" type="index"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称"></el-table-column>
            <el-table-column label="操作">
              <template v-slot="scope">
                <el-button type="primary" size="mini" icon="el-icon-edit" @click="editAttribute(scope.row)">编辑</el-button>
                <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteAttribute(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <!-- dialog#编辑属性 -->
      <el-dialog :title="'编辑'+ AttributeTypeText" :visible.sync="showEditAttributeForm" @close="editDialogClose">
        <el-form ref="editForm" :model="currentAttribute" label-width="80px"  :rules="rules">
          <el-form-item :label="AttributeTypeText" prop="attr_name">
            <el-input v-model="currentAttribute.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="showEditAttributeForm = false">取 消</el-button>
          <el-button type="primary" @click="saveEditAttribute">确 定</el-button>
        </div>
      </el-dialog>
      <!-- dialog#添加属性 -->
      <el-dialog :title="'添加' + AttributeTypeText" :visible.sync="showAddAttributeForm" @close="attributeFormDialogClose">
        <el-form ref="addForm" :model="attribute" label-width="80px" :rules="rules">
          <el-form-item :label="AttributeTypeText" prop="name">
            <el-input v-model="attribute.name"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="showAddAttributeForm = false">取 消</el-button>
          <el-button type="primary" @click="saveAddAttribute">确 定</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>
<script>
export default {
  data () {
    return {
      categories: [],
      selecetKey: [],
      attributes: [],
      cid: 0,
      sel: 'many',
      currentAttribute: {
        attr_name: ''
      },
      attribute: {
        name: ''
      },
      showEditAttributeForm: false,
      showAddAttributeForm: false,
      inputVisible: false,
      inputValue: '',
      rules: {
        name: [{
          required: true, message: '属性名称不得为空', tigger: 'blur'
        }],
        attr_name: [{
          required: true, message: '属性名称不得为空', tigger: 'blur'
        }]
      }
    }
  },
  methods: {
    // 级联发生切换
    handleChange () {
      // console.log(this.selecetKey)
      if (this.selecetKey.length < 3) {
        // console.log('点击清除按钮')
        this.attributes = []
        this.selecetKey = []
        this.cid = -1
        return true
      }
      this.cid = this.selecetKey[2]
      this.getParams()
    },
    // 选修卡切换
    handleTabClick() {
      this.getParams()
      console.log(this.sel, '?!')
    },
    // 请求分类信息
    async getCategories() {
      const { data: res } = await this.$http.get('categories')
      if(res.meta.status !== 200) {
        return this.$message.error('请求分类列表失败')
      }
      this.categories = res.data
    },
    // 请求属性
    async getParams() {
      this.attributes = []
      const { cid, sel } = this
      if (this.selecetKey.length < 3) {
        this.attributes = []
        return
      }

      const { data: res } = await this.$http.get(`categories/${cid}/attributes`, {
        params: { sel }
      })
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('请求失败:' + res.meta.msg)
      }
      // 每次请求属性后都要对属性进行切割
      res.data.forEach((d) => {
        d.attr_vals = !d.attr_vals ? [] : d.attr_vals.split(' ')
      })

      this.attributes = res.data
    },
    // 删除属性
    deleteAttribute ({ attr_id: aid }) {
      const { cid } = this
      this.$messageBox.confirm(`确定删除${this.AttributeTypeText}属性?`, '删除属性').then(async () => {
        // console.log('确认删除')
        const { data: res } = await this.$http.delete(`categories/${cid}/attributes/${aid}`)
        if (res.meta.status !== 200) {
          return this.$message.error('删除失败:' + res.meta.msg)
        }
        this.$message.success('删除成功')
        this.getParams()
      }).catch(() => { })
    },
    // 编辑属性
    async editAttribute(row) {
      this.showEditAttributeForm = true
      // 重置为空
      const { attr_id, attr_name, cat_id } = row
      // this.currentAttribute = {}
      // const { cid } = this
      const { data: res } = await this.$http.get(`categories/${cat_id}/attributes/${attr_id}`)
      if (res.meta.status !== 200) {
        this.$message.error('获取信息失败:' + res.meta.msg)
      }
      // 接受数据 #这部分没有必要#有必要! 编辑的时候需要请求数据? ==> attr_name这个属性就够了
      this.currentAttribute = res.data
    },
    // 保存编辑
    saveEditAttribute () {
      this.$refs.editForm.validate(async (va) => {
        if(!va) { return this.$message.error('属性名称不得为空,') }
        const { sel } = this
        const { cat_id: cid, attr_id: aid, attr_name: aname } = this.currentAttribute
        const { data: res } = await this.$http.put(`categories/${cid}/attributes/${aid}`, {
          attr_name: aname,
          attr_sel: sel
        })
        if (res.meta.status !== 200) {
          return this.$message.error('编辑失败:' + res.meta.msg)
        }
        this.$message.success('属性修改成功')
        this.getParams()
        this.showEditAttributeForm = false
      })
    },
    // 关闭属性编辑
    editDialogClose() {
      this.$refs.editForm.resetFields()
    },
    // 增加属性# 有点多余
    addAttribute () {
      this.showAddAttributeForm = true
    },
    // 提交添加
    saveAddAttribute () {
      this.$refs.addForm.validate(async va => {
        // console.log('验证结果', va)
        if (!va) {
          return this.$message.error('表格验证未通过,请检查输入')
        }
        // 属性名称
        const { cid } = this
        const { data: res } = await this.$http.post(`categories/${cid}/attributes`, {
          attr_name: this.attribute.name,
          attr_sel: this.sel
        })
        if (res.meta.status !== 201) {
          return this.$message.error('添加属性失败:' + res.meta.msg)
        }
        this.$message.success('添加属性成功')
        this.showAddAttributeForm = false
        this.attribute.name = ''
        this.getParams()
      })
    },
    // dialog 关闭
    attributeFormDialogClose () {
      this.$refs.addForm.resetFields()
    },




    // 删除属性值
    removeAttributeValue (row) {
      console.log('删除值')
      this.updataAttributeValue(row)
    },
    // 显示表单
    showInput() {
      this.inputVisible = true
    },
    // 保存数据
    handleInputConfirm(row) {
      // 数据的请求应该在这里完成
      this.inputVisible = false
      this.inputValue = '' // 清空
      console.log('添加新的值')
      this.updataAttributeValue(row)
    },
    // 更新数据 每次发生数据增加删除 都需要出现提交一下请求。
    async updataAttributeValue(row) {
      const { attr_id, attr_name, attr_sel, cat_id, attr_vals } = row
      const { data: res } = await this.$http.put(`categories/${cat_id}/attributes/${attr_id}`, {
        attr_name,
        attr_sel,
        attr_vals: 'abc 123 456'
      })
      this.getParams()
      console.log('--->添加值成功了吗?', res)
    }
  },
  computed: {
    isDisabled () {
      return this.selecetKey.length < 3
    },
    AttributeTypeText () {
      return this.sel === 'many' ? '动态属性' : '静态属性'
    }
  },
  created () {
    this.getCategories()
  }
}
</script>
