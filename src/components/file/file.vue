<template>
  <div v-loading="loading">
    <el-header>
      <el-row>
        <el-col :offset="2" :span="4">
          <div style="margin-top: 20px">
            <el-upload
              class="upload-demo"
              ref="upload"
              :action="$HOSTURL('http://127.0.0.1:8018/api/file/upload')"
              :on-success ="uploadSuccess"
              :before-upload="beforeAvatarUpload"
              :file-list = "fileList"
              :auto-upload="false">
              <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
            </el-upload>
          </div>
        </el-col>
        <el-col :span="2">
          <div style="margin-top: 20px">
            <el-button style="margin-top: -60px" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
          </div>
        </el-col>
      </el-row>
    </el-header>
    <el-row :gutter="24">
      <el-col :offset="9" :span="12">
        <self-search :datalist="list" :strList="['fileName']" @search-result="setResultList"></self-search>
      </el-col>
      <el-col :span="3">
        <div style="margin-top: 15px">
          <el-button style="margin-top: -60px" size="small" type="primary" @click="batchDownload">批量下载</el-button>
        </div>
      </el-col>
    </el-row>
    <el-table :data="list" stripe style="width: 100%" align="center" :row-class-name="tableRowClassName" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="50"></el-table-column>
      <el-table-column type="index"
                       :index="updateIndex"
                       label="序号" width="50" align="center">
      </el-table-column>
      <el-table-column prop="fileOwnerName" label="上传者"></el-table-column>
      <el-table-column prop="fileName" label="文件名" show-overflow-tooltip></el-table-column>
      <el-table-column prop="fileSize" label="文件大小"></el-table-column>
      <el-table-column prop="fileType" label="文件类型" show-overflow-tooltip></el-table-column>
      <el-table-column prop="filePath" label="文件路径" show-overflow-tooltip></el-table-column>
      <el-table-column prop="fileCreateTime" label="上传时间" :formatter="setTime" width="200" align="center">
      </el-table-column>
      <el-table-column label="操作" align="center" width="200px">
        <template slot-scope="scope">
          <perm label="download-file-manage">
            <el-button type="primary" size="mini" plain circle class="el-icon-download" @click="download(scope.row)"></el-button>
            <el-tag v-show="scope.row.fileDownloadNumber > 0" size="mini">已下载{{scope.row.fileDownloadNumber}}次</el-tag>
          </perm>
        </template>
      </el-table-column>
    </el-table>
    <el-footer align="center" style="background-color: #fff">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="condition.offset"
        :page-sizes="[8, 20, 30]"
        :page-size="8"
        layout="total, sizes, prev, pager, next, jumper"
        :total="count">
      </el-pagination>
    </el-footer>
  </div>
</template>
<script>
  import selfcearch from '../common/self-cearch';
  import {File} from '@/api/resources';
  import Perm from '../common/self-perm';
  export default {
    name: 'cont',
    components: {
      Perm,
      selfSearch: selfcearch
    },
    data () {
      return {
        loading: true,
        multipleSelection: [],
        fileDto: {
          fileDescription: '上传者：'+this.$store.state.user.userName
        },
        filename: '',
        list: [],
        fileList: [],
        file: '',
        count: 0,
        condition: {
          offset: 1,
          limit: 8
        }
      }
    },
    mounted() {
      this.getFileList();
    },
    methods: {
      tableRowClassName({row, rowIndex}) {
        if (rowIndex%2 === 0 || rowIndex%2 === '0') {
          return 'warning-row';
        } else if (rowIndex%2 === 1 || rowIndex%2 === '1') {
          return 'warning-row';
        }
        return '';
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      updateIndex(index) {
        return index + (this.condition.offset-1) * this.condition.limit + 1;
      },
      setTime (row) {
        return this.$moment(row.fileCreateTime).format('YYYY-MM-D hh:mm:ss');
      },
      submitUpload() {
        this.$refs.upload.submit();
      },
      uploadSuccess () {
        this.list=[];
        this.getFileList();
      },
      beforeAvatarUpload(file) {
        // const isJPG = file.type === 'image/jpeg';
        // const isPNG = file.type === 'image/png';
        const isLt5M = file.size / 1024 / 1024 < 5;
        // if (!isJPG && !isPNG) {
        //   this.$message.error('上传图片只能是 JPG 格式 或 PNG 格式!');
        //   return false;
        // }
        if (!isLt5M) {
          this.$message.error('上传图片大小不能超过 5MB!');
          return false;
        }
        return file;
      },
      handleSizeChange(val) {
        this.condition.limit = val;
        this.getFileList();
      },
      handleCurrentChange(val) {
        this.condition.offset = val;
        this.getFileList();
      },
      setResultList (resultList) {
        this.list = resultList;
        this.count = resultList.length;
      },
      getFileList () {
        this.loading = true;
        File.queryAllUserFiles(this.condition).then((res) => {
          this.count = res.total;
          this.list = res.list;
          this.loading = false;
        }).catch(() => {
        });
      },
      batchDownload() {
        if (this.multipleSelection.length === 0) {
          this.$notify({
            type: 'info',
            title: '提示',
            message: '请勾选要下载的文件！'
          });
          return '';
        }
        this.multipleSelection.forEach(value => {
          this.download(value);
        });
        this.multipleSelection = [];
      },
      download (file) {
        this.filename = file.fileName;
        let url = this.$HOST + '/file/' + file.fileId;
        return new Promise((resolve, reject) => {
          // Get file name from url.
          let xhr = new XMLHttpRequest();
          xhr.responseType = 'blob';
          xhr.onload = () => {
            resolve(xhr);
          };
          xhr.onerror = reject;
          xhr.open('GET', url);
          xhr.send();
        }).then((xhr) => {
          let a = document.createElement('a');
          a.href = window.URL.createObjectURL(xhr.response); // xhr.response is a blob
          a.download = this.filename; // Set the file name.
          a.style.display = 'none';
          document.body.appendChild(a);
          a.click();
          this.getFileList();
          return xhr;
        });
      }
    }
  };
</script>

<style scoped>
  .el-table__body .warning-row {
    background: oldlace;
  }

  .el-table__body .success-row {
    background: #f0f9eb;
  }
</style>
