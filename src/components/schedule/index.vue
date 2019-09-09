<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div>
    <el-calendar>
      <template v-slot:dateCell="{data}">
        <div @click="change(data)" style="height: 100%">
          <div align="right">
            <el-button @click="showSchedule(data.day)" circle icon="el-icon-search" size="mini" type="primary"
                       v-if="data.isSelected"></el-button>
            <el-button @click="addSchedule(data.day)" circle icon="el-icon-circle-plus-outline" size="mini"
                       style="margin-left: 10px" type="primary" v-if="data.isSelected"></el-button>
            <el-badge :type=" false ? 'warning' : 'primary'" :value="2" class="item"></el-badge>
          </div>
          <p :class="data.isSelected ? 'is-selected' : ''">
            {{data.day.split('-').slice(2).join('') }}
          </p>
        </div>
      </template>
    </el-calendar>
    <custom-drawer :css="{'width': '500px'}" :show="showForm" @close="close" title="添加事件">
      <schedule-form :time="time" @close="close"></schedule-form>
    </custom-drawer>
    <custom-drawer :css="{'width': '600px'}" :show="showInfo" @close="close" title="事件列表">
      <schedule-detail :time="time" @close="close"></schedule-detail>
    </custom-drawer>
  </div>
</template>

<script>
  import ScheduleForm from './form.vue';
  import ScheduleDetail from './detail.vue';

  export default {
    name: 'index',
    components: {
      ScheduleForm,
      ScheduleDetail
    },
    data() {
      return {
        showForm: false,
        showInfo: false,
        time: '',
        dateValue: '',
        timeData: {
          date: '',
          data: {
            type: '',
            isSelected: true,
            day: ''
          }
        }
      };
    },
    mounted() {
      this.getScheduleCount();
    },
    watch: {},
    methods: {
      getScheduleCount() {

      },
      change(val) {
        console.info(val);
      },
      addSchedule() {
        this.showForm = true;
      },
      showSchedule(value) {
        this.time = value;
        this.showInfo = true;
      },
      close() {
        this.showForm = false;
        this.showInfo = false;
      }
    }
  };
</script>

<style scoped>
  .is-selected {
    margin: 0;
    color: #1989FA;
    text-align: center;
    font-size: 23px;
  }
</style>
