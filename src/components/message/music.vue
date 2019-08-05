<template>
  <el-container>
    <el-main>
      <!--<audio ref="audio"-->
             <!--loop="loop"-->
             <!--:volume="0.2"-->
             <!--@timeupdate="onTimeUpdate"-->
             <!--@ended="forList"-->
             <!--:src="src">-->
      <!--</audio>-->
      <!--<div id="Audio">-->
        <!--<el-row :gutter="24">-->
          <!--<el-col :span="6"><div class="grid-content">-->
            <!--<div>-->
              <!--<el-button type="text" @click="prev"><i class="el-icon-caret-left"></i>上一曲</el-button>-->
              <!--<el-button type="text" @click="play">暂停/播放</el-button>-->
              <!--<el-button type="text" @click="next">下一曲<i class="el-icon-caret-right"></i></el-button>-->
            <!--</div>-->
          <!--</div></el-col>-->
          <!--<el-col :span="10"><div class="grid-content">-->
            <!--<div style="margin-top: 10px">-->
              <!--<el-progress :text-inside="true" :stroke-width=6 :percentage="cTime"></el-progress>-->
            <!--</div>-->
          <!--</div></el-col>-->
          <!--<el-col :span="4"><div class="grid-content">-->
            <!--<div style="margin-top: -10px">-->
              <!--<el-progress type="circle" :width=60 :percentage="cTime"></el-progress>-->
            <!--</div>-->
          <!--</div></el-col>-->
          <!--<el-col :span="4" align="center">-->
            <!--<el-button type="primary" @click="rightClose()">关闭</el-button>-->
          <!--</el-col>-->
        <!--</el-row>-->
      <!--</div>-->
    </el-main>
  </el-container>
</template>

<script>
  export default {
    name: 'music',
  data () {
    return {
      list: [
        'https://music.163.com/song/media/outer/url?id=450424527.mp3',
        'https://music.163.com/song/media/outer/url?id=557581284.mp3',
        'https://music.163.com/song/media/outer/url?id=452986458.mp3',
        'https://music.163.com/song/media/outer/url?id=1324667958.mp3'
      ],//歌曲数组
      index: 3,//当前歌曲下标
      audio: {
        // 该字段是音频是否处于播放状态的属性
        playing: false,
        // 音频当前播放时长
        currentTime: 0,
        // 音频最大播放时长
        maxTime: 0
      },
      value10: 0
    }
  },
  computed: {
    src() {
      return this.list[this.index] // 当前播放歌曲
    },
    cTime () {
      let temp = 0;
      if (this.audio.currentTime && this.audio.maxTime) {
        temp = this.audio.currentTime*100/this.audio.maxTime;
        if (temp < 0){
          temp = 0;
        }
        return temp >100 ? 100 : temp;
      } else {
        return temp = 0;
      }
    }
  },
  // 组件的生命周期
  beforeCreate(){ //在实例创建之后，在数据初始化之前被调用
    console.info('1-beforeCreate');
  },
  created(){  // 在数据初始化之后被调用，如果你的页面进来的时候就调用接口,那么created是第一选择
    console.info('2-created');
  },
  beforeMount(){ //在组建渲染之前被调用，也就是说数据渲染之前，比如要色彩渲染可以在这里写
    console.info('3-beforeMount');
  },
  mounted(){//整个实例被创建完成后被调用,比如：实例创建完成、数据初始化、渲染页面数据后，才被调用，这个时候就可以在mounted这个生命周期里面写Dom操作了,注意：生命周期用的最多的就是mounted
    console.info('4-mounted');
  },
  beforeUpdate(){ //在数据改变时被调用，比如: total = 0 , 然后手动把num++; 就会执行此方法
    console.info('5-beforeUpdate');
  },
  updated(){ //数据被更新之后,  比如：total值改变之后，再被执行
    console.info('6-updated');
  },
  activated(){ //keep-alive 组件激活时调用，也就是说在路由切换时被调用，注意要配合keep-alive使用才会被调用
    console.info('7-activated');
  },
  deactivated(){//keep-alive 组件停用时调用，也可以理解成在路由切换的会自动停用组件，
    console.info('8-deactivated');
  },
  beforeDestroy(){//实例销毁之前被调用，这个方法适用于 把new Vue({})赋值给一个变量时，如： var vm = new Vue({})，然后用vm.$destroy() 方法销毁这个实例
    console.info('9-beforeDestroy');
  },
  destroyed(){//实例销毁之后被调用，一般情况下，在页面切换路由时，会自动销毁组件，
    console.info('10-destroyed');
  },
  methods: {
    prev() {//上一曲
      let index = this.index - 1;
      if (index < 0) {
        index = this.list.length - 1
      }
      this.index = index;
      this.$nextTick(() => this.$refs.audio.play())
    },
    play() {//暂停/播放
      this.$nextTick(() => this.$refs.audio.paused ? this.$refs.audio.play() : this.$refs.audio.pause())
    },
    next() {//下一曲
      let index = this.index + 1;
      if (index === this.list.length) {
        index = 0
      }
      this.index = index;
      this.$nextTick(() => this.$refs.audio.play())
    },
    onTimeUpdate(res) {
      if (this.audio.maxTime === 0){
        this.audio.maxTime = res.target.duration
      }
      this.audio.currentTime = res.target.currentTime
    },
    rightClose() {
      this.$refs.audio.pause();
      this.$refs.audio.load();
      this.$emit('rightClose');
    },
    forList () {
      this.next();
    }
  }
};
</script>

<style scoped>
  .bg-purple {
    background: aliceblue;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }

</style>
