<template>
  <div>
    <div>
      <selfcearch :datalist="logData" :strList="['logUsed','logOperate']" @search-result="setResultList"></selfcearch>
      <el-table
        v-loading="loading"
        :data="logData"
        align="center"
        :row-class-name="tableRowClassName"
        style="width: 100%">
        <el-table-column type="index" :index="updateIndex" label="序号" width="50" align="center"></el-table-column>
        <!--<el-table-column prop="logId" label="编号" width="200" align="center"></el-table-column>-->
        <el-table-column prop="logAccessUserName" label="操作者" width="180" align="center"></el-table-column>
        <el-table-column prop="logAccessTime" label="时间" width="200" :formatter="setTime"></el-table-column>
        <el-table-column prop="logAccessType" label="操作类型" show-overflow-tooltip></el-table-column>
        <el-table-column prop="logAccessIp" label="访问IP"></el-table-column>
        <el-table-column prop="logAccessUrl" label="访问路径" show-overflow-tooltip></el-table-column>
      </el-table>
    </div>
    <el-footer align="center" style="background-color: #fff">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentnum"
        :page-sizes="[10, 20, 100]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="count">
      </el-pagination>
    </el-footer>
  </div>
</template>

<script>
  import {PermMenu} from '@/api/resources'
  import Selfcearch from '../common/self-cearch';
  export default {
    name: 'log',
    components: {Selfcearch},
    data () {
      return {
        logData: [],
        currentPage1: 5,
        currentPage2: 5,
        currentPage3: 5,
        currentPage4: 4,
        currentnum: 1,
        pagesizenum: 10,
        count: 0,
        loading: true
      }
    },
    mounted() {
      this.getLogList();
    },
    methods: {
      tableRowClassName({row, rowIndex}) {
        if (rowIndex%2 === 0) {
          return 'warning-row';
        } else if (rowIndex%2 === 1) {
          return 'success-row';
        }
        return '';
      },
      getLogList () {
        this.loading = true;
        let url = this.$HOST + '/logger/query' + '?offset=' + this.currentnum + '&limit=' + this.pagesizenum;
        this.$api.get(url).then((res) => {
          this.logData = res.list;
          this.count = res.total;
          this.loading = false;
        }).catch(() => {
        });
      },
      handleSizeChange(val) {
        this.pagesizenum = val;
        this.getLogList();
      },
      handleCurrentChange(val) {
        this.currentnum = val;
        this.getLogList();
      },
      updateIndex(index) {
        return index + (this.currentnum - 1) * this.pagesizenum + 1;
      },
      setTime (row) {
        return this.$dateFmt('yyyy-MM-dd hh:mm:ss',row.logAccessTime );
      },
      setResultList (resultList) {
        this.logData = resultList;
      }
    }
  };
</script>

<style scoped>
  .el-table .warning-row {
    background: oldlace;
  }

  .el-table .success-row {
    background: #f0f9eb;
  }
</style>
