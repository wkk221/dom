<template>
  <div class="m-section m-section--rights">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card cardTop">
      <el-row :gutter="24">
        <!-- 搜索部分 -->
        <el-col :span="6">
          <el-input placeholder="请输入商品关键字" v-model="orderForm.query" clearable @clear="reqOrders">
            <el-button slot="append" icon="el-icon-search" @click="reqOrders()"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 表格部分 -->
      <el-table :data="orders" border style="width: 100%" class="cardTop">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="order_number" label="订单编号" ></el-table-column>
        <el-table-column prop="order_price" label="订单价格" ></el-table-column>
        <el-table-column label="是否付款" >
          <template v-slot="scope">
            <el-tag v-if="scope.row.order_pay === '0'" type="danger ">未付款</el-tag>
            <el-tag v-else type="success">已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货" ></el-table-column>
        <el-table-column prop="create_time" label="下单时间">
          <template v-slot="scope">
            {{scope.row.create_time|date-format}}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <el-button type="primary" size="mini" icon="el-icon-edit" circle @click="editAddress(scope.row)"></el-button>
            <el-button type="success" size="mini" icon="el-icon-s-flag" circle @click="showWULIIU(scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="cardTop"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageIdx"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="orderForm.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
      <!-- dialog#显示物流信息 -->
      <el-dialog
        title="物流信息"
        :visible.sync="dialogVisible"
        width="50%">
        <el-timeline :reverse="true">
          <el-timeline-item
            v-for="(item, index) in wulius"
            :key="index"
            :timestamp="item.time">
            {{item.context}}
          </el-timeline-item>
        </el-timeline>
      </el-dialog>
      <el-dialog title="修改地址" :visible.sync="dialogFormVisible" @close="dialogClose">
        <el-form ref="form" :model="addressForm" label-width="80px" :rules="rules" >
          <el-form-item label="省市区县" prop="location">
            <el-cascader
              v-model="addressForm.locationText"
              :options="addressForm.location"
              :props="{ expandTrigger: 'hover' }"
              @change="handleChange"></el-cascader>
          </el-form-item>
          <el-form-item label="详细地址" prop="address">
            <el-input v-model="addressForm.address"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
        </div>
      </el-dialog>
    </el-card>
</div>
</template>
<script>
import datas from './city_data2017_element'
export default {
  data () {
    return {
      orderForm: {
        query: '',
        pagesize: 10,
        pagenum: 1
      },
      addressForm: {
        location: datas,
        address: '',
        locationText: ''
      },
      orders: [],
      wulius: [],
      address: [],
      rules: {
        location: [{
          required: true,
          message: '地址不得为空',
          trigger: 'blur'
        }],
        address: [{
          required: true,
          message: '地址不得为空',
          trigger: 'blur'
        }]
      },
      total: 0,
      pageIdx: 1,
      dialogVisible: false,
      dialogFormVisible: false
    }
  },
  methods: {
    // 加载订单信息
    async reqOrders () {
      const { data: { meta, data: { total, goods } } } = await this.$http.get('orders', {
        params: this.orderForm
      })
      if ( meta.status !== 200 ) {
        return this.$message.error('订单列表加载失败')
      }
      this.total = total
      console.log(this.orderForm)
      this.orders = goods
      console.log('重新发送请求', goods)
    },
    handleSizeChange(n) {
      this.orderForm.pagesize = n
      this.reqOrders()
    },
    handleCurrentChange(n) {
      this.orderForm.pagenum = n
      this.reqOrders()
    },
    // 显示物流
    async showWULIIU (row) {
      this.dialogVisible = true
      this.wulius = []
      console.log('显示物流', row.order_id)
      const { data: res } = await this.$http.get('/kuaidi/1106975712662')
      if( res.meta.status !== 200 ) {
        return this.$message.error('物流信息请求失败')
      }
      this.wulius = res.data
      console.log(res)
    },
    // 编辑地址信息
    editAddress () {
      this.dialogFormVisible = true
      console.log('编辑地址')
    },
    // 级联组件触发 
    handleChange () {
      console.log(this.addressForm, '-->触发')
    },
    // 
    dialogClose () {
      console.log('模态框关闭')
      this.$refs.form.resetFields()
      this.addressForm.locationText = []
    }

  },
  created () {
    this.reqOrders()
  }
}
</script>
