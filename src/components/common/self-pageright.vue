<template>
  <div class="page-right-wrap" v-show="show" @click="rightClose">
    <div class="page-right-part lightBox" @click.stop="" ref="pageRightPart" :style="style">
      <div align="right">
        <el-button icon="el-icon-close" size="mini" @click.stop.prevent="rightClose" circle></el-button>
      </div>
      <div class="page-right-main">
        <slot></slot>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'CustomDrawer',
    props: {
      show: {
        type: Boolean,
        default: false
      },
      css: {
        type: Object
      },
      defaultWith: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        showDrawer: this.show
      }
    },
    computed: {
      style() {
        let defaultObj = {};
        if (this.defaultWith) {
          defaultObj = Object.assign(defaultObj, {width: '600px', padding: '20px', height: '100%'})
        }
        let cssArr = [];
        let obj = {};
        obj = Object.assign({}, defaultObj, this.css);
        for (let i in obj) {
          cssArr.push(i + ':' + obj[i]);
        }
        return cssArr.join(';');
      }
    },
    methods: {
      rightClose () {
        this.$emit('update:show', false);
        this.$emit('right-close');
        this.$emit('rightClose');
      }
    }
  };
</script>

<style scoped>
  .page-right-wrap{
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 999;
    background-color: rgba(0,0,0,0.7);
  }
  .page-right-part{
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    overflow: auto;
    background-color: #fff;
  }
  .lightBox { /*需要引起用户注意的元素*/
    position: absolute;
    z-index: 1000;
  }
</style>
