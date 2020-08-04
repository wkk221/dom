<template>
  <div class="m-section m-section--goods">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card cardTop">
      <!-- 主体部分 -->
      <el-row :gutter="24">
        <!-- 搜索部分 -->
        <el-col :span="6">
          <el-input placeholder="请输入商品关键字" v-model="procudeForm.goods_name" clearable @clear="reqProduces">
            <el-button slot="append" icon="el-icon-search" @click="reqProduces(procudeForm.goods_name)"></el-button>
          </el-input>
        </el-col>
        <!-- 按钮部分 -->
        <el-col :span="4">
          <el-button type="primary" @click="goAddPage">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 表格区 -->
      <el-table :data="produces" style="width: 100%" class="cardTop" border>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称"></el-table-column>
        <el-table-column prop="goods_price" label="商品价格(元)" width="110"></el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="110"></el-table-column>
        <el-table-column label="创建时间" width="166">
          <template v-slot="scope">
            {{scope.row.add_time|date-format}}
          </template>
        </el-table-column>
        <el-table-column prop="name" label="操作" width="120">
          <template v-slot="scope">
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="editProduce(scope.row)"></el-button>
            <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeProduce(scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区 -->
      <el-pagination
      class="cardTop"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagination.currentPage"
      :page-sizes="pagination.sizes"
      :page-size="pagination.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="pagination.total">
    </el-pagination>
    </el-card>
  </div>
</template>
<script>
export default {
  data () {
    return {
      produces: [],
      procudeForm: {
        goods_name: '', // 商品名称
        goods_introduce: '', // 介绍
        goods_cat: 0, // 类目
        goods_price: 0, // 价格
        goods_number: 0, // 数量
        goods_weight: 0, // 重量
        pics: {}, // 图像# 大图中图小图
        attrs: [] // 商品的参数
      },
      pagination: {
        currentPage: 1,
        sizes: [5, 10, 20, 30],
        pagesize: 5,
        total: 0
      }
    }
  },
  methods: {
    // 请求商品列表数据
    async reqProduces (query = '') {
      const { pagesize, currentPage: pagenum } = this.pagination
      // 多层结构数据
      const { data: { meta, data: { total, goods } } } = await this.$http.get('goods', {
        params: {
          query,
          pagesize,
          pagenum
        }
      })
      if (meta.status !== 200) {
        return this.$message.error('请求商品列表失败:' + meta.msg)
      }
      this.produces = goods
      this.pagination.total = total
      // console.log('??', meta, res)
    },
    // 修改显示数量
    handleSizeChange(size) {
      this.pagination.pagesize = size
      this.reqProduces()
    },
    // 页码切换
    handleCurrentChange(n) {
      this.pagination.currentPage = n
      this.reqProduces()
    },
    // 编辑产品
    editProduce(row) {
      console.log('编辑商品')
    },
    // 删除商品
    removeProduce({ goods_id }) {
      console.log('移除商品', goods_id)
      this.$messageBox.confirm('提示文本', '标题', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        // 确认走这里
        const { data: res } = await this.$http.delete(`goods/${goods_id}`)
        if( res.meta.status !== 200 ) {
          return this.$message.error('删除失败：' + res.meta.msg)
        }
        this.$message.success('删除成功')
        this.reqProduces()
      }).catch(() => {
        // 报错走这里
      })
    },
    // 跳转到添加商品页面
    goAddPage () {
      console.log('路由跳转')
      this.$router.push('/goods/add')
    }
  },
  created () {
    this.reqProduces()
  }
}
</script>
