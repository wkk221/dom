<template>
  <div class="m-section m-section--category">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card cardTop">
      <!-- 添加分类 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addCategory">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 列表去 -->
      <el-table :data="categories" border  class="cardTop" :tree-props="{children: 'children'}" row-key="cat_id">
        <el-table-column width="88" label="#">
        </el-table-column>
        <el-table-column prop="cat_name" label="分类名称"></el-table-column>
        <el-table-column label="是否有效" width="80">
          <template v-slot="scope">
            <div  style="text-align: center;">
              <i class="el-icon-circle-check" style="color:#55d655" v-if="!scope.row.cat_deleted"></i>
              <i class="el-icon-circle-close" style="color:red" v-else></i>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="cat_level" width="70" label="等级">
          <template v-slot="scope" >
            <el-tag :type="scope.row.cat_level === 0?'success':scope.row.cat_level === 1?'warning':'danger'">{{scope.row.cat_level === 0?'一级':scope.row.cat_level === 1?'二级':'三级' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template v-slot="scope">
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="editCategory(scope.row)">编辑</el-button>
            <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteCategory(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 页码区 -->
      <el-pagination class="cardTop"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page ="1"
        :page-size="categoriesQueryForm.pagesize"
        :page-sizes="[5, 10, 20, 30]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
    <!-- dialog#添加分类 -->
    <el-dialog title="编辑分类" :visible.sync="showAddCategoryForm" @close="closeAddCategory">
      <el-form ref="addForm" :model="addCategoryForm" label-width="80px" :rules="reles">
        <!-- 分类名称 -->
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCategoryForm.cat_name"></el-input>
        </el-form-item>
        <!-- 级联 -->
        <el-form-item label="父级分类">
          <el-cascader
            class="wfull"
            clearable
            filterable
            :options="pids"
            v-model="selecetKey"
            @change="changePid"
            :props="{ expandTrigger: 'hover',checkStrictly: true, label: 'cat_name', value: 'cat_id' }"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showAddCategoryForm = false">取 消</el-button>
        <el-button type="primary" @click="submitAddCategoryForm()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- dialog#编辑分类 -->
    <el-dialog title="添加分类" :visible.sync="showEditCategoryForm">
      <el-form ref="editForm" :model="currentCategory" label-width="80px" :rules="reles">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="currentCategory.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showEditCategoryForm = false">取 消</el-button>
        <el-button type="primary" @click="saveEditCategoryForm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      categories: [],
      pids: [], // 用于管理一级和二级的分类
      selecetKey: [],
      categoriesQueryForm: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      total: 0,
      currentCategory: {
        cat_name: ''
      }, // 更具id查询到的分类名称
      addCategoryForm: {
        cat_name: '',
        cat_level: 0,
        cat_pid: 0
      },
      showAddCategoryForm: false,
      showEditCategoryForm: false,
      reles: {
        cat_name: [{
          required: true,
          message: '分类名称不得为空',
          trigger: 'blur'
        },
        {
          min: 2,
          max: 14,
          message: '类目长度保持2~14位',
          trigger: 'blur'
        }]
      }
    }
  },
  methods: {
    // 显示条数
    handleSizeChange(n) {
      this.categoriesQueryForm.pagesize = n
      this.getCategories()
    },
    // 当前页码
    handleCurrentChange(n) {
      this.categoriesQueryForm.pagenum = n
      this.getCategories()
    },
    // 请求分类列表数据
    async getCategories() {
      const { data: res } = await this.$http.get('categories', {
        params: this.categoriesQueryForm
      })
      if(res.meta.status !== 200) {
        return this.$message.error('请求分类列表失败')
      }
      this.categories = res.data.result
      this.total = res.data.total
    },
    // 删除分类
    deleteCategory({ cat_id: cid }) {
      this.$messageBox.confirm('确认删除分类?', '删除分类').then(async () => {
        // console.log('确认修改', cid)
        const { data: res } = await this.$http.delete(`categories/${cid}`)
        if (res.meta.status !== 200) {
          return this.$message.error('分类删除失败:' + res.meta.msg )
        }
        this.$message.success('分类删除成功')
        this.getCategories()
      }).catch(() => {})
    },
    // 添加分类 #赋值组织表单数据
    async addCategory() {
      this.showAddCategoryForm = true
      const { data: res } = await this.$http.get('categories', { params: { type: 2 } })
      console.log('添加分类', '获得所有二级分类数据', res)
      if (res.meta.status !== 200) { return this.$message.error('获取父级分类列表失败') }
      this.pids = res.data
    },
    // 提交新分类
    submitAddCategoryForm () {
      console.log('-->发生改变', this.addCategoryForm)
      this.$refs.addForm.validate( async (va) => {
        console.log(!va, '格式通过验证')
        if(!va) {
          return this.$message.error('类目名称未通过')
        }

        const { data: res } = await this.$http.post('categories', this.addCategoryForm)
        if (res.meta.status !== 201) {
          return this.$message.error('分类添加失败原因:' + res.meta.msg)
        }
        this.$message.success('类目添加成功')
        this.getCategories()
        this.showAddCategoryForm = false
      })
    },
    // 添加用户后重置数据
    closeAddCategory () {
      // 重置验证数据
      this.$refs.addForm && this.$refs.addForm.resetFields()
      // 重置级联选择的数据
      this.selecetKey = []
      // 重置表达的数据
      this.addCategoryForm.cat_pid = 0
      this.addCategoryForm.cat_level = 0
    },
    // 级联选中状态的值
    changePid () {
      if (this.selecetKey.length > 0) {
        this.addCategoryForm.cat_pid = this.selecetKey[this.selecetKey.length - 1]
        this.addCategoryForm.cat_level = this.selecetKey.length
      } else {
        // 点击清除按钮会走这里
        this.addCategoryForm.cat_pid = 0
        this.addCategoryForm.cat_level = 0
      }
    },
    // 编辑分类
    async editCategory({ cat_id: cid }) {
      this.showEditCategoryForm = true
      // currentCategory
      // 根据id 查询
      const { data: res } = await this.$http.get(`categories/${cid}`)
      if (res.meta.status !== 200) {
        this.$message.error('查询错误:' + res.meta.msg)
      }
      this.currentCategory = res.data
    },
    // 提交编辑后的分类
    saveEditCategoryForm () {
      this.showEditCategoryForm = false
      this.$refs.editForm.validate(async va => {
        if(!va) { this.$message.error('验证未通过') }
        const { cat_id: cid, cat_name: cname } = this.currentCategory
        const { data: res } = await this.$http.put(`categories/${cid}`, {
          cat_name: cname
        })
        if (res.meta.status !== 200) {
          return this.$message.error('类名编辑失败')
        }
        this.$message.success('类名编辑成功')
        this.getCategories()
      })
    }
  },
  created () {
    this.getCategories()
  }
}
</script>
<style lang="less">

.m-section--category{
  .el-table__row--level-1{
    background: #f2fdf9 !important;
  }
  .el-table__row--level-2{
    background: #e4fbff !important;
  }
}
.el-cascader-menu{
  max-height: 200px;
}
.el-scrollbar__wrap{
  overflow-x: auto !important;
}
</style>
