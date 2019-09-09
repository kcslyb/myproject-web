<template>
<div style="background-color: #e6e6e6">
  <el-main>
    <div align="center">
      <el-row>
        <el-col :span="1">
          <el-tooltip class="item" effect="dark" content="返回" placement="top">
            <el-button type="primary" size="small" circle plain @click="goBack"><i class="el-icon-caret-left"></i></el-button>
          </el-tooltip>
        </el-col>
        <el-col :offset="3" :span="2"><el-button type="text" size="small" style="color: #000">粘贴路径：</el-button></el-col>
        <el-col :span="8">
          <el-input size="small" @focus="focus($event)" v-model="url" placeholder="请输入路径"></el-input>
        </el-col>
        <el-col :span="5">
          <el-button size="small" type="primary" plain @click="switchURL" :loading="switchLoading">切换</el-button>
          <el-button size="small" type="primary" plain @click="paly" :loading="switchLoading">播放</el-button>
        </el-col>
      </el-row>
    </div>
    <div style="position:relative;z-index:1000; width: 68%; margin: 20px 16% 0 16%; border: 1px solid #e6e6e6">
      <iframe :src="srcURL" width="100%" :height="playHeight" allowfullscreen="" allowtransparency="" frameborder="0"></iframe>
    </div>
  </el-main>
</div>
</template>

<script>
  export default {
    name: 'playpage',
    components: {
    },
    data() {
      return {
        url: 'https://v.qq.com/x/page/d0029at1z3n.html',
        srcURL: '',
        pathTypes: [],
        menuList: [],
        switchLoading: false,
        pathIndex: 0,
        playHeight: window.innerHeight - 100,
        playWidth: 0,
      }
    },
    mounted() {
      this.getPathType();
      this.paly();
    },
    methods: {
      focus(event) {
        event.currentTarget.select();
      },
      goBack() {
        this.$router.go(-1)
      },
      getPathType() {

        this.$getDictionaryByGroup('interfaceType').then((res) => {
          this.pathTypes = res;
          if (this.pathTypes.length > 0) {
            this.srcURL = this.pathTypes[this.pathIndex].dictionaryLabel + this.url;
          }
        }).catch((res) => {})
      },
      switchURL() {
        if (this.pathTypes.length > 0) {
          if (this.url === '') {
            this.$notify({
              title: '提示',
              message: '无播放地址'
            });
          }
        }
        this.switchLoading = true;
        let index = ++this.pathIndex % this.pathTypes.length;
        if (this.pathTypes.length > 0) {
          this.srcURL = this.pathTypes[index].dictionaryLabel + this.url;
        }
        this.switchLoading = false;
      },
      paly() {
        this.switchLoading = true;
        let index = ++this.pathIndex % this.pathTypes.length;
        if (this.pathTypes.length > 0) {
          this.srcURL = this.pathTypes[index].dictionaryLabel + this.url;
        }
        this.switchLoading = false;
      }
    }
  };
</script>

<style scoped>
</style>
