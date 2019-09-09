<template>
  <el-table :data="scheduleList" style="width: 100%">
    <el-table-column label="日期" prop="scheduleCreateTime" width="180"></el-table-column>
    <el-table-column label="事件名" prop="scheduleTitle" width="180"></el-table-column>
    <el-table-column label="备注" prop="scheduleRemake"></el-table-column>
  </el-table>
</template>

<script>
  import {SCHEDULE} from '@/api/resources';

  export default {
    name: 'detail',
    props: {
      time: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        scheduleList: []
      };
    },
    watch: {
      time() {
        this.getSchedule();
      }
    },
    methods: {
      getSchedule() {
        SCHEDULE.query({time: this.time}).then(res => {
          this.scheduleList = res;
        });
      }
    }
  };
</script>

<style scoped>

</style>
