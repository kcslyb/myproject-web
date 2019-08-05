<template>
  <div>
    <el-upload
      class="upload-demo"
      :action="$HOSTURL(uploadPath)"
      :on-success ="uploadSuccess"
      :on-remove="handleRemove"
      :before-upload="beforeAvatarUpload"
      :file-list = "fileList"
      :list-type="checkType ? 'picture' : 'text'">
      <el-button size="small" class="el-icon-upload" type="primary">点击上传</el-button>
    </el-upload>
  </div>
</template>

<script>
  import {aesDecrypt} from '../../utils/encryption';

  export default {
    name: 'CustomFileUpload',
    props: {
      checkType: {
        type: Boolean,
        default: false
      },
      uploadPath: {
        type: String,
        default: 'http://127.0.0.1:8018/api/file/upload'
      },
      fileList: {
        type: Array,
        default: () => []
      }
    },
    data(){
      return{
        file: {}
      }
    },
    methods: {
      handleRemove (file, fileList) {
        this.$emit('handleRemove', file, fileList);
      },
      uploadSuccess(response) {
        this.file = aesDecrypt(response);
        let data = this.file.hasOwnProperty('data') ? this.file.data : this.file;
        this.$emit('callback', data);
      },
      beforeAvatarUpload(file) {
        if (this.checkType) {
          const isJPG = file.type === 'image/jpeg';
          const isPNG = file.type === 'image/png';
          if (!isJPG && !isPNG) {
            this.$message.error('上传图片只能是 JPG 格式 或 PNG 格式!');
            return false;
          }
        }
        const isLt5M = file.size / 1024 / 1024 < 5;
        if (!isLt5M) {
          this.$message.error('上传图片大小不能超过 5MB!');
          return false;
        }
        return file;
      }
    }
  };
</script>

<style scoped>

</style>
