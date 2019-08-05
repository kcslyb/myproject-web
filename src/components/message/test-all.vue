<template>
<div>
  <custom-feedback size="small" :length="20" placeholder="自定义输入组件"></custom-feedback>
  <div class="el-main">
    <div>
      不做处理：<input ref="input" v-on:input ="inputFunc3"/>
      <el-progress :text-inside="true" :stroke-width="18" :percentage="percentage3" status="success"></el-progress>
    </div>
    <div>
      防抖：<input ref="input" v-on:input ="inputFunc1"/>
      <el-progress :text-inside="true" :stroke-width="18" :percentage="percentage1"></el-progress>
    </div>
    <div>
      节流：<input ref="input" v-on:input ="inputFunc2"/>
    </div>
    <el-progress :text-inside="true" :stroke-width="18" :percentage="percentage2" color="rgba(142, 113, 199, 0.7)"></el-progress>
  </div>
  <div>
    <el-button @click="show = !show" size="small">custom-drawer</el-button>
  </div>
  <custom-drawer :defaultWith="true" :show.sync="show" @right-close="close">
    <custom-feedback size="small" :length="20" v-model="inputText" placeholder="自定义输入组件"></custom-feedback>
    <span>{{inputText}}</span><el-button @click="prShow = !prShow">{{prShow ? 'notShow' : 'show'}}</el-button>
    <img v-if="prShow" style="position: absolute; width: 100px; height: 100px;" src="http://qr.liantu.com/api.php?text=789079797"/>
  </custom-drawer>
</div>
</template>

<script>

import {debounce, throttle} from '@/utils/util'

export default {
  name: 'socket',
  data() {
    return {
      inputText: '',
      valueString: '',
      options: [],
      value: [],
      list: [],
      loading: false,
      show: false,
      prShow: false,
      strokeWidth1: 0,
      percentage1: 0,
      strokeWidth2: 0,
      percentage2: 0,
      strokeWidth3: 0,
      percentage3: 0
    }
  },
  mounted() {
  },
  created() {
  },
  destroyed() {
  },
  methods: {
    inputFunc1: debounce(function () {
      this.strokeWidth1 = this.strokeWidth1 + 5 < 100 ? this.strokeWidth1 + 5 : 0;
      this.percentage1 = this.strokeWidth1 === 100 ? 100 : this.strokeWidth1 % 100;
    }, 1000),
    inputFunc2: throttle(function () {
      this.strokeWidth2 = this.strokeWidth2 + 5 < 100 ? this.strokeWidth2 + 5 : 0;
      this.percentage2 = this.strokeWidth2 === 100 ? 100 : this.strokeWidth2 % 100;
    }, 2000),
    inputFunc3() {
      this.strokeWidth3 = this.strokeWidth3 + 5 < 100 ? this.strokeWidth3 + 5 : 0;
      this.percentage3 = this.strokeWidth3 + 5 === 100 ? 100 : this.strokeWidth3 % 100;
    },
    close() {
      this.show = false;
    }
  }
};
</script>

<style scoped>

</style>
