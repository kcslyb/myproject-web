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
  <div>
    <el-button @click="writeData">write</el-button>
  </div>
  <custom-drawer :defaultWith="true" :show.sync="show" @right-close="close">
    <custom-feedback size="small" :length="20" v-model="inputText" placeholder="自定义输入组件"></custom-feedback>
    <span>{{inputText}}</span>
    <el-button @click="downloadQr">生成二维码</el-button>
    <custom-address-city v-model="addressValue"></custom-address-city>
    <span>{{addressValue}}</span>
  </custom-drawer>
</div>
</template>

<script>

  import {debounce, throttle} from '@/utils/util';
  import {writeJson} from '@/utils/fileutil';

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
      percentage3: 0,
      addressValue: ''
    }
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
    },
    downloadQr() {
      this.download('/api/file/info?text=' + this.inputText + '&fileName=' + this.inputText, 'fileName');
    },
    download(src, fileName) {
      let $a = document.createElement('a');
      $a.setAttribute('href', src);
      $a.setAttribute('download', fileName);
      let fileLink = document.createElement('span');
      fileLink.setAttribute('style', 'cursor: pointer; -webkit-tap-highlight-color: transparent');
      $a.appendChild(fileLink);
      let body = document.getElementsByTagName('body')[0];
      body.appendChild($a);
      fileLink.click();
      body.removeChild($a);
    },
    writeData() {
      let params = {
        id: '123456',
        path: '12343454545',
        value: 'value'
      };
      writeJson(params, '/Users/kcs/Desktop/json.json');
    }
  }
};
</script>

<style scoped>

</style>
