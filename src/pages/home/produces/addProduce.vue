<template>
  <div class="m-section m-section--addProduce">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card cardTop">
      <!-- 提示 -->
      <el-alert title="添加商品信息" type="info" show-icon></el-alert>
      <!-- 步骤 -->
      <el-steps :active="+tabActive" finish-status="success" :space="200" align-center class="cardTop">
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- 选项卡 -->
      <el-form ref="form" 
        :model="addProduceForm" label-width="80px"
        :rules="produceRules" label-position="top"
        class="el-form--compact">
        <el-tabs class="cardTop"
          v-model="tabActive" tab-position="left" 
          :before-leave="beforeLeave" @tab-click="tabClicked">
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addProduceForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addProduceForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addProduceForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addProduceForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader 
              :options="categories" clearable 
              :props="{ expandTrigger: 'hover', label: 'cat_name', value: 'cat_id' }"
              v-model="addProduceForm.goods_cat" @change="handleChange"
            ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item :label="item.attr_name" v-for="item in attributes" :key="item.attr_id">
              {{item.attr_vals}}
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox  :label="ckbx" border size="medium" v-for="(ckbx, idx) in item.attr_vals" :key="idx"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">商品属性</el-tab-pane>
          <el-tab-pane label="商品图片" name="3">商品图片</el-tab-pane>
          <el-tab-pane label="商品内容" name="4">商品内容</el-tab-pane>
        </el-tabs>
      </el-form>
      {{addProduceForm}}
    </el-card>
    
  </div>
</template>
<script>
export default {
  data () {
    return {
      active: 0,
      tabActive: 0,
      categories: [],
      attributes: [], // 动态属性|静态属性
      // selecetKeys: [],
      addProduceForm: {
        goods_name: 'aaaab', // 商品名称
        goods_introduce: '', // 介绍
        goods_cat: [1, 3, 6], // 类目
        goods_price: 0, // 价格
        goods_number: 0, // 数量
        goods_weight: 0, // 重量
        pics: {}, // 图像# 大图中图小图
        attrs: [] // 商品的参数
      },
      produceRules: {
        goods_name: [{
          required: true,
          message: '商品名称不得为空',
          trigger: 'blur'
        }],
        goods_price: [{
          required: true,
          message: '价格不得为空',
          trigger: 'blur'
        }],
        goods_weight: [{
          required: true,
          message: '重量不得为空',
          trigger: 'blur'
        }],
        goods_number: [{
          required: true,
          message: '数量不得为空',
          trigger: 'blur'
        }],
        goods_cat: [{
          required: true,
          message: '必须选择三级目录',
          trigger: 'blur'
        }]
      }
    }
  },
  computed: {
    cid () {
      return this.addProduceForm.goods_cat.length === 3 ? this.addProduceForm.goods_cat[2] : null
    }
  },
  methods: {
    // 请求分类信息
    async getCategories() {
      const { data: res } = await this.$http.get('categories')
      if(res.meta.status !== 200) {
        return this.$message.error('请求分类列表失败')
      }
      this.categories = res.data
    },
    // 级联触发选中
    handleChange () {
      console.log('级联选择触发')
      if(this.addProduceForm.goods_cat.length < 3) {
        this.addProduceForm.goods_cat = []
        this.this.attributes = [] // 请求到的属性值清空
      }
    },
    // 选项卡发生切换
    beforeLeave(to, from) {
      // 阻断跳转逻辑
      if (from === '0' && this.addProduceForm.goods_cat.length !== 3) {
        this.$message.error('请选择分类')
        return false
      }
    },
    // 选项卡被点击事件#发送请求
    tabClicked() {
      if (this.tabActive === '1') {
        console.log('发送动态属性请求')
        this.getParams()
      } else if (this.tabActive === '2') {
        this.getParams('only')
      }
      // console.log('对应的索引', this.tabActive, typeof this.tabActive)
    },
    async getParams(sel = 'many') {
      console.log('刷新数据')
      const { data: res } = await this.$http.get(`categories/${this.cid}/attributes`, {
        params: { sel }
      })
      if (res.meta.status !== 200) {
        return this.$message.error('请求失败:' + res.meta.msg)
      }
      this.attributes = res.data
      this.attributes.forEach((item) => {
        item.attr_vals = 
        item.attr_vals.length === 0
          ? []
          : item.attr_vals.split(' ')
      })
      console.log('请求动态属性', this.attributes)
    }
  },
  created () {
    this.getCategories()
  }
}
</script>
