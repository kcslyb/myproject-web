<template>
<div>
  <el-input :size="size" v-model="valueString" :placeholder="placeholder"></el-input>
  <span style="color: #F56C6C; font-size: 0.2em" v-show="result !== 0 || result !== '0'">{{result === 0 ? '无法再输入!' : '还能输入' + result + '个字符'}}</span>
</div>
</template>

<script>
  export default {
    name: 'CustomFeedback',
    props: {
      length: {
        type: Number,
        default: 10
      },
      placeholder: {
        type: String,
        default: '请输入内容'
      },
      size: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        result: this.length,
        valueString: ''
      }
    },
    watch: {
      valueString(v, o) {
        this.changeNumber(v, o);
      }
    },
    methods: {
      changeNumber(v, o) {
        this.result = this.length > this.valueString.hasOwnProperty('length') ? this.length - this.valueString.length : 0;
        if (this.result <= -1) {
          this.valueString = v.substring(0, this.length);
        } else {
          this.valueString = v;
        }
        this.$emit('input', this.valueString);
      }
    }
  };
</script>

<style scoped>

</style>
