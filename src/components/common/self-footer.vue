<template>
  <el-footer align="center" style="background-color: #fff">
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="current"
      :page-sizes="[10, 20, 100]"
      :page-size="size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </el-footer>
</template>

<script>
  import {getPager} from '../../utils/pager';

  export default {
    name: 'CustomFooter',
    props :['current', 'size', 'total', 'dataList'],
    data(){
      return {
        pager: {
          size: this.size,
          current: this.current,
          total: this.total
        },
        resultList: []
      }
    },
    methods: {
      handleSizeChange(val) {
        this.pager.size = val;
        this.resultList = getPager(this.current,val,this.dataList);
        this.$emit('result-list',this.pager,this.resultList);
      },
      handleCurrentChange(val) {
        this.pager.current = val;
        this.resultList = getPager(val,this.size,this.dataList);
        this.$emit('result-list',this.pager,this.resultList);
      }
    }
  };
</script>

<style scoped>

</style>
