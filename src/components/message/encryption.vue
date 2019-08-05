<template>
<div>
  <div>
    <el-header align="right" style="margin-top: 20px">
      <!--<el-button type="primary" @click="doEncrypt" plain>ENCRYPT</el-button>-->
      <el-button type="primary" @click="doDecrypt" plain>DECRYPT</el-button>
      <el-button type="primary" @click="reset" plain>RESET</el-button>
    </el-header>
    <div class="content">console view:
      <el-input type="textarea" :autosize="{ minRows: 6, maxRows: 20}" placeholder="please enter the content" v-model="textarea"></el-input>
    </div>
  </div>
</div>
</template>

<script>
  import {aesDecrypt} from '../../utils/encryption';
  export default {
    name: 'encryption',
    data() {
      return{
        textarea: '',
        encryptionTextarea: ''
      }
    },
    methods: {
      // doEncrypt() {
      //   if (this.textarea === '' ) {
      //     this.$message({
      //       type: 'info',
      //       message: '没有内容！'
      //     });
      //     return '';
      //   }
      //   this.encryptionTextarea = aesEncrypt(this.textarea);
      // },
      doDecrypt() {
        if (this.textarea === '' ) {
          this.$message({
            type: 'info',
            message: '没有内容！'
          });
          return '';
        }
        new Promise(() => {
          console.info(aesDecrypt(this.textarea.substring(1, this.textarea.length - 1)));
          this.$message({
            type: 'success',
            message: 'console view result ！'
          });
        }).catch(() => {
          this.$message({
            type: 'error',
            message: 'decrypt error ！'
          });
          return '';
        });
      },
      reset() {
        this.textarea = '';
        this.encryptionTextarea = '';
      }
    }
  };
</script>

<style scoped>
  .content{
    margin-top: 20px;
    padding: 20px;
  }
</style>
