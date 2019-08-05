<template>
  <div style="padding: 10px 100px;">
    <div style="display: inline-block; float: right">
      <el-input
        @keyup.enter.native="filterPerm"
        size="small"
        style="width: 200px"
        placeholder="请输入内容"
        prefix-icon="el-icon-search"
        v-model="filterStr">
      </el-input>
      <el-button size="small" type="primary" @click="filterPerm">查询</el-button>
      <el-button size="small" type="info" @click="filterPermReset">重置</el-button>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'CustomSearch',
    props:['datalist','strList'],
    data () {
      return {
        filterStr: '',
        datalistCopy: [],
        filterList: [],
        conditions: [],
        pager: {
          size: 0,
          current: 1,
          total: this.datalist
        }
      }
    },
    methods: {
      filterPerm() {
        if (this.filterStr) {
          this.conditions = this.strList;
          this.datalistCopy = this.datalist.slice(0);
          this.filterList = this.datalist.filter(val => {
            let filterVal = '';
            this.conditions.forEach(value => {
              filterVal += val[value];
            });
            return filterVal.indexOf(this.filterStr) > -1;
          });
          this.filterStr ='';
          this.$emit('search-result',this.filterList);
        }
      },
      filterPermReset () {
        if (this.datalistCopy.length > 0) {
          this.$emit('search-result',this.datalistCopy);
        }
      }
    }
  };
</script>

<style scoped>

</style>
