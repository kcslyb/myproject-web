<template>
<div>
  <div style="padding: 20px; font-size: 1.3em">详情分析</div>
  <div style="padding: 20px;" align="right">
    <el-button type="success" plain @click="getDay()">按  次</el-button>
    <el-button type="success" plain @click="getWeek()">按  天</el-button>
    <el-button type="success" plain @click="getMonth()">按  月</el-button>
  </div>
  <div>
    <el-alert
      center
      :title="title"
      type="success"
      :closable="false" align="center">
    </el-alert>
  </div>
  <div class="charts">
    <div id="myChart" :style="'width: '+chartWidth+'px; height: '+ chartHeight +'px;'"></div>
  </div>
</div>
</template>

<script>
  // 引入基本模板
  let echarts = require('echarts/lib/echarts')
  // 引入柱状图组件
  require('echarts/lib/chart/bar')
  // 引入提示框和title组件
  require('echarts/lib/component/tooltip')
  require('echarts/lib/component/title')
  export default {
    props: ['searchList'],
    data() {
      return {
        title: '',
        priseList: [],
        xList: [],
        titleList: [
          {
            key: 1,
            value: '生活用品'
          },
          {
            key: 2,
            value: '水电房租'
          },
          {
            key: 3,
            value: '话费充值'
          },
          {
            key: 4,
            value: '日常出行'
          },
          {
            key: 5,
            value: '其它支出'
          }
        ]
      }
    },
    computed: {
      chartWidth () {
        let width = parseInt(this.$store.state.app.windowSize.width, 10);
        width = (width/2);
        return width;
      },
      chartHeight() {
        let height = parseInt(this.$store.state.app.windowSize.height, 10);
        height = (height - 230);
        return height;
      }
    },
    watch: {
      searchList() {
        this.getDay()
      },
    },
    mounted() {
    },
    methods: {
      getDay() {
        this.reset();
        let sum = 0;
        this.searchList.forEach(value => {
          this.priseList.push(value.accountPrise);
          this.xList.push(this.$dateFmt('MM-dd', value.accountCreattime));
          sum += value.accountPrise;
        });
        let length = this.xList.length;
        let avr = sum/length;
        this.title = '共' + length + '笔' + sum + '元，平均每次'+ avr + '元。';
        this.drawLine();
      },
      getWeek() {
        this.setValues('MM-dd','天')
      },
      getMonth() {
        this.setValues('MM','月');
      },
      setValues(formatStr,dataStr){
        this.reset();
        let tem = -1;
        this.searchList.forEach(value => {
          let dateTime = this.$dateFmt(formatStr, value.accountCreattime);
          if (this.xList.indexOf(dateTime) < 0){
            this.xList.push(dateTime);
            this.priseList.push(value.accountPrise);
            tem += 1;
          } else {
            this.priseList[tem] += value.accountPrise;
          }
        });
        let sum = 0;
        this.priseList.forEach(value => {
          sum += value;
        });
        let length = this.xList.length;
        let avr = sum/length;
        this.title = '共' + length + dataStr + sum + '元，平均每' + dataStr + avr + '元。';
        this.drawLine();
      },
      reset() {
        this.xList = [];
        this.priseList = [];
      },
      drawLine() {
        // 基于准备好的dom，初始化echarts实例
        let myChart = echarts.init(document.getElementById('myChart'));
        // 绘制图表
        myChart.setOption({
          title: {text: '数据图表'},
          tooltip: {},
          xAxis: {
            data: this.xList,
            axisLabel: {
              inside: true,
              textStyle: {
                color: '#fff'
              }
            },
            axisTick: {
              show: false
            },
            axisLine: {
              show: false
            },
            z: 10
          },
          yAxis: {
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              textStyle: {
                color: '#000'
              }
            }
          },
          series: [{
            name: '开销',
            type: 'bar',
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(
                  0, 0, 0, 1,
                  [
                    {offset: 0, color: '#83bff6'},
                    {offset: 0.5, color: '#188df0'},
                    {offset: 1, color: '#188df0'}
                  ]
                )
              },
              emphasis: {
                color: new echarts.graphic.LinearGradient(
                  0, 0, 0, 1,
                  [
                    {offset: 0, color: '#2378f7'},
                    {offset: 0.7, color: '#2378f7'},
                    {offset: 1, color: '#83bff6'}
                  ]
                )
              }
            },
            data: this.priseList
          }]
        });
      }
    }
  };
</script>

<style scoped>

</style>
