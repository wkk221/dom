<template>
  <div class="m-section m-section--rights">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card cardTop">
      <el-table :data="powers" border style="width: 100%" class="cardTop" stripe>
        <el-table-column prop="authName" label="权限名称" ></el-table-column>
        <el-table-column prop="path" label="路径" ></el-table-column>
        <el-table-column label="权限等级" >
          <template v-slot="scope">
            <el-button type="primary" plain v-if="scope.row.level == 0">一级</el-button>
            <el-button type="info" plain v-else-if="scope.row.level == 1">二级</el-button>
            <el-button type="danger" plain v-else>三级</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
export default {
  data () {
    return {
      powers: []
    }
  },
  methods: {
    async getPowers () {
      // rights/list
      const { data: res } = await this.$http.get('rights/list')
      console.log(res, '-=>')
      // 请求失败
      if (res.meta.status !== 200) {
        return this.message({
          type: 'error',
          message: res.meta.msg
        })
      }
      // 请求成功继续
      this.powers = res.data
    }
  },
  created () {
    this.getPowers()
  }
}
</script>
