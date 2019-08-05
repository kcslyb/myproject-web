<template>
  <div style="">
    <div style="display: inline-block;width: 70%" v-loading="loading">
      <ul class="el-upload-list el-upload-list--picture-card">
        <li tabindex="0" class="el-upload-list__item is-success" v-for="item of photoList" :key="item.photoId">
          <img :src="$REPLACEURL(item.photoPath)" alt="" class="el-upload-list__item-thumbnail"/>
          <span class="el-upload-list__item-actions">
          <span class="el-upload-list__item-preview"><i class="el-icon-zoom-in" @click="showDialog(item.photoPath)"></i></span>
          <span class="el-upload-list__item-preview"><i class="el-icon-download" @click="showDialog(item.photoPath)"></i></span>
        </span>
        </li>
      </ul>
      <div id="dialog" v-show="dialogShow">
        <div @click.prevent.stop="dialogShow = false" class="el-dialog__wrapper" style="padding: 0; z-index: 1003; background-color: rgba(0, 0, 0, 0.7)">
          <div class="el-dialog"  @click.stop="" style="margin-top: 15vh;">
            <div class="el-dialog__body">
              <img :src="$REPLACEURL(dialogShowPath)" style="width: 100%;">
            </div>
          </div>
        </div>
      </div>
    </div>
    <div style="display: inline-block; width: 24%; position: absolute; top: 90px;">
      <self-fileupload :check-type="true" @handleRemove="handleRemove" @callback="callback" :file-list="fileList"></self-fileupload>
      <div align="right" style="margin-top: 30px; border-bottom: 1px solid #e6e6e6;">
        <el-tooltip class="item" effect="dark" content="提交" placement="top">
          <el-button icon="el-icon-upload2" type="primary" size="small" circle plain @click="uploadImages"></el-button>
        </el-tooltip>
      </div>
    </div>
  </div>
</template>

<script>
  import {PHOTO} from '../../../api/resources';
  import SelfFileupload from '../../common/self-fileupload';
  export default {
    name: 'accountimage',
    components: {SelfFileupload},
    data() {
      return {
        dialogShow: false,
        loading: false,
        dialogShowPath: '',
        dialogImageSrc: '',
        photoList: [],
        fileList: [],
        formDateList: [],
        pager: {
          offset: 1,
          limit: 10,
          total: 0
        },
        condition: {

        }
      };
    },
    mounted() {
      this.getPhotoList();
    },
    methods: {
      getPhotoList() {
        this.loading = true;
        let formDate = Object.assign({}, this.pager, this.condition);
        PHOTO.queryPager(formDate).then(res => {
          this.photoList = res.list;
          this.pager.total = res.total;
          this.loading = false;
        });
      },
      handleRemove(file) {
        this.$notify.success({
          title: '提示！',
          type: 'success',
          message: '文件' + file.name + '已删除！'
        });
      },
      callback(file) {
        this.formDateList = [];
        this.formDateList.push({
          photoFileId: file.fileId,
          photoName: file.fileName,
          photoPath: file.filePath
        })
      },
      uploadImages() {
        if (this.formDateList.length === 0) {
          this.$notify.success({
            title: '提示！',
            type: 'info',
            message: '请上传文件'
          });
          return '';
        }
        PHOTO.save(this.formDateList).then(res => {
          this.$notify.success({
            title: '提示！',
            type: 'info',
            message: res ? 'successful！' : 'failed！'
          });
          this.formDateList = [];
          this.getPhotoList();
        })
      },
      showDialog(path) {
        this.dialogShow = true;
        this.dialogShowPath = path
      }
    }
  };
</script>

<style scoped>
  .el-dialog__header {
    padding: 0;
  }
  .el-dialog{
    border-radius: 20px;
    overflow: hidden;
  }
  .el-dialog__body {
    padding: 0;
  }
  .el-dialog__body img{
    transform: scale(1.2);
    width:auto;
    height:auto;
    max-width:100%;
    max-height:100%;
  }
  .avatar-uploader-icon {
    margin-top: 20px;
    font-size: 28px;
    color: #8c939d;
    width: 145px;
    height: 145px;
    border: 1px solid #e6e6e6;
    border-radius: 5px;
    display: -webkit-box;
    -webkit-box-pack:center;
    -webkit-box-align:center;
    -webkit-box-orient: vertical;
    text-align: center
  }
  .avatar {
    width: 145px;
    height: 145px;
    border: 1px solid #e6e6e6;
    border-radius: 5px;
    display: -webkit-box;
    -webkit-box-pack:center;
    -webkit-box-align:center;
    -webkit-box-orient: vertical;
    text-align: center
  }
</style>
