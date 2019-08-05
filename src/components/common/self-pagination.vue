<template>
  <el-footer align="center" style="background-color: #fff">
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pager.current"
      :page-sizes="[10, 20, 100]"
      :page-size="size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="pager.total">
    </el-pagination>
  </el-footer>
</template>

<script>
  export default {
    name: 'CustomPagination',
    props :['pager', 'dataList'],
    data(){
      return {
        resultList: []
      }
    },
    methods: {
      handleSizeChange(val) {
        this.pager.size = val;
        this.$emit('result',this.pager);
      },
      handleCurrentChange(val) {
        this.pager.current = val;
        this.$emit('result',this.pager);
      }
    }
  };
</script>

<style scoped>

</style>
