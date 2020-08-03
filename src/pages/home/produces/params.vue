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
      <el-tabs class="cardTop" v-model="addAttributeForm.attr_sel" @tab-click="getParams">
        <!-- 动态区 -->
        <el-tab-pane label="动态属性" name="many">
          <el-row>
            <el-col>
              <el-button type="primary" :disabled="isDisabled"  @click="show('showAddAttributeForm')">添加参数</el-button>
            </el-col>
          </el-row>
          <!-- 表格部分 -->
          <el-table class="cardTop" :data="attributes" border>
            <el-table-column type="expand">
              <template v-slot="scope">
                <!-- 循环展示 -->
                <!-- 拖拽组件? -->
                <draggable
                  :list="scope.row.attr_vals"
                  :disabled="!enabled"
                  ghost-class="ghost"
                  @start="dragging = true"
                  @end="dragging = false"
                  @sort="MoveEnd(scope.row)"
                >
                  <transition-group>
                    <el-tag
                      @close="removeAttributeValue(scope.row, index)"
                      class="e-tag--6px"
                      v-for="(item, index) in scope.row.attr_vals"
                      :key="index"
                      closable
                      type="success">
                      {{item}}
                    </el-tag>
                  </transition-group>
                </draggable>
                {{scope.row.attr_vals}}
                
                <!-- 值的输入 -->
                <el-input
                  class="input-new-tag w120"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
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
        <!-- 静态区 -->
        <el-tab-pane label="静态属性" name="only">
          <el-row>
            <el-col>
              <el-button type="primary" :disabled="isDisabled" @click="show('showAddAttributeForm')">添加属性</el-button>
            </el-col>
          </el-row>
          <!-- 表格部分 -->
          <el-table class="cardTop" :data="attributes" border>
            <el-table-column type="expand">
              <template v-slot="scope">
                <!-- 循环展示 -->
                <!-- 拖拽组件? -->
                <draggable
                  :list="scope.row.attr_vals"
                  :disabled="!enabled"
                  ghost-class="ghost"
                  @start="dragging = true"
                  @end="dragging = false"
                  @sort="MoveEnd(scope.row)"
                >
                  <transition-group>
                    <el-tag
                      @close="removeAttributeValue(scope.row, index)"
                      class="e-tag--6px"
                      v-for="(item, index) in scope.row.attr_vals"
                      :key="index"
                      closable
                      type="success">
                      {{item}}
                    </el-tag>
                  </transition-group>
                </draggable>
                {{scope.row.attr_vals}}
                
                <!-- 值的输入 -->
                <el-input
                  class="input-new-tag w120"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
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
      <el-dialog :title="'编辑'+ AttributeTypeText" :visible.sync="showEditAttributeForm"  @close="dialogCloseEvent('editForm')">
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
      <el-dialog :title="'添加' + AttributeTypeText" :visible.sync="showAddAttributeForm" @close="dialogCloseEvent('addForm')">
        <el-form ref="addForm" :model="addAttributeForm" label-width="80px" :rules="rules">
          <el-form-item :label="AttributeTypeText" prop="attr_name">
            <el-input v-model="addAttributeForm.attr_name"></el-input>
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
      categories: [], // 三联组件数据
      selecetKey: [], // 选中后的数据
      attributes: [], // 根据分类id请求到的属性列表
      // cid: 0,
      // sel: 'many',
      currentAttribute: {}, // 查询到的属性#用于保存查询到的属性
      addAttributeForm: {
        attr_name: '',
        attr_sel: 'many',
        cat_id: 0
      }, // 管理一些通用数据
      showEditAttributeForm: false,
      showAddAttributeForm: false,
      inputVisible: false,
      inputValue: '',
      rules: {
        attr_name: [{
          required: true, message: '属性名称不得为空', tigger: 'blur'
        }]
      },
      enabled: true,
      dragging: false
    }
  },
  methods: {
    // 级联发生切换
    handleChange () {
      if (this.selecetKey.length < 3) {
        this.attributes = []
        this.selecetKey = []
        this.addAttributeForm.cat_id = -1
        return
      }
      this.addAttributeForm.cat_id = this.selecetKey[2]
      // console.log(this.addAttributeForm, '三联')
      this.getParams()
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
      const { attr_sel, cat_id } = this.addAttributeForm
      if (this.selecetKey.length < 3) {
        this.attributes = []
        return
      }
      console.log('刷新数据')
      const { data: res } = await this.$http.get(`categories/${cat_id}/attributes`, {
        params: { sel: attr_sel }
      })

      if (res.meta.status !== 200) {
        return this.$message.error('请求失败:' + res.meta.msg)
      }
      // 每次请求属性后都要对属性进行切割
      res.data.forEach((d) => {
        d.attr_vals = !d.attr_vals ? [] : d.attr_vals.split(' ')
        d.inputVisible = false
        d.inputValue = ''
      })

      this.attributes = res.data
    },
    // 删除属性
    deleteAttribute (row) {
      const { attr_id, attr_name, cat_id } = row
      this.$messageBox.confirm(`确定删除${this.AttributeTypeText}属性?`, '删除属性').then(async () => {
        const { data: res } = await this.$http.delete(`categories/${cat_id}/attributes/${attr_id}`)
        if (res.meta.status !== 200) {
          return this.$message.error('删除失败:' + res.meta.msg)
        }
        this.$message.success('删除成功')
        this.getParams()
      }).catch(() => { })
    },
    // 编辑属性
    async editAttribute(row) {
      this.show('showEditAttributeForm')
      const { attr_id, attr_name, cat_id } = row
      const { data: res } = await this.$http.get(`categories/${cat_id}/attributes/${attr_id}`)
      if (res.meta.status !== 200) {
        this.$message.error('获取信息失败:' + res.meta.msg)
      }
      this.currentAttribute = res.data
      console.log('-->请求信息保存到本地', this.currentAttribute)
    },
    // 保存编辑
    saveEditAttribute () {
      this.$refs.editForm.validate(async (va) => {
        if(!va) { return this.$message.error('属性名称不得为空,') }
        const { cat_id, attr_id, attr_name, attr_sel } = this.currentAttribute
        const { data: res } = await this.$http.put(`categories/${cat_id}/attributes/${attr_id}`, {
          attr_name,
          attr_sel
        })
        if (res.meta.status !== 200) {
          return this.$message.error('编辑失败:' + res.meta.msg)
        }
        this.$message.success('属性修改成功')
        this.getParams()
        this.hide('showEditAttributeForm')
      })
    },
    
    // 提交添加
    saveAddAttribute () {
      this.$refs.addForm.validate(async va => {
        if (!va) {
          return this.$message.error('表格验证未通过,请检查输入')
        }
        const { cat_id, attr_name, attr_sel } = this.addAttributeForm
        const { data: res } = await this.$http.post(`categories/${cat_id}/attributes`, {
          attr_name,
          attr_sel
        })
        if (res.meta.status !== 201) {
          return this.$message.error('添加属性失败:' + res.meta.msg)
        }
        this.$message.success('添加属性成功')
        this.hide('showAddAttributeForm')
        this.getParams()
      })
    },
    

    /*
      添加属性值的行为。
    */
    // 删除属性值
    removeAttributeValue (row, index) {
      console.log('删除值索引:', index)

      row.attr_vals.splice(index, 1) // 删除源数据
      this.updataAttributeValue(row, '删除成功')

      /*
        删除后数组坍塌怎么办?
      */
    },
    // 显示表单
    showInput(row) {
      console.log('执行showinput', row)
      row.inputVisible = true
      // this.$refs.saveTagInput.focus()
      console.log('AAA', this.$refs.saveTagInput)
      this.$nextTick(e => {
        console.log('BBB', this.$refs.saveTagInput)
        this.$refs.saveTagInput.$refs.input.focus()
      })
      /*
        ===> 要获得输入框的焦点。
        刚刚想在这里做什么来着?
      */
    },
    // 保存数据
    handleInputConfirm(row) {
      // 推入数组
      if (row.inputValue.trim()) {
        row.attr_vals.push(row.inputValue.trim())
      }
      // 重置数据#数据添加到数组成功之后
      row.inputVisible = false
      row.inputValue = '' // 清空
      console.log('添加新的值,', row)
      this.updataAttributeValue(row, '数据添加成功')
    },
    // 核心提交原有的数据
    async updataAttributeValue(row, msg = '操作成功') {
      const { attr_id, attr_name, attr_sel, cat_id, attr_vals } = row
      const { data: res } = await this.$http.put(`categories/${cat_id}/attributes/${attr_id}`, {
        attr_name,
        attr_sel,
        attr_vals: attr_vals.join(' ')
      })
      if (res.meta.status !== 200) {
        return this.$message.error('添加失败:' + res.meta.msg)
      }
      this.$message.success(msg)

      // this.getParams() // 刷新有问题。 不需要从新请求数据。
      console.log('--->添加值成功了吗?', res)
    },
    // 扩展拖拽组件
    MoveEnd (row) {
      console.log('拖拽结束')
      this.updataAttributeValue(row, '重新排序成功')
    },



    /*
      优化后通用的代码。
    */ 
    show(t) {
      console.log('执行show行为:' + t)
      this[t] = true
    },
    hide(t) {
      console.log('执行hide行为:' + t)
      this[t] = false
    },
    // 模态框关闭事件优化#整合,以参数形式来控制#清空表单行为
    dialogCloseEvent(ref) {
      console.log('关闭的模态框是:' + ref)
      this.$refs[ref].resetFields()
    }
  },
  computed: {
    isDisabled () {
      return this.selecetKey.length < 3
    },
    AttributeTypeText () {
      return this.addAttributeForm.attr_sel === 'many' ? '动态属性' : '静态属性'
    }
  },
  created () {
    this.getCategories()
  }
}
</script>
