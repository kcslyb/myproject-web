<template>
  <div>
    <el-header style="border-bottom: 1px solid #aaa; padding-right: 100px; padding-top: 10px;">
      <el-button style="width: 100px;" type="primary" @click="mainQuery" plain round>首页</el-button>
      <el-button type="primary" plain @click="logQuery" round>访问日志</el-button>
      <el-button type="primary" plain @click="fileQuery" round>文件中心</el-button>
      <el-button type="primary" plain @click="infoQuery" round>个人资料</el-button>
    </el-header>
    <div>
      <div v-show="showMain">
        <div style="padding-right: 1%; color: #000;" align="center"><h3>公告</h3></div>
        <el-collapse v-model="activeNames" :accordion="true">
          <template v-for="(note,index) of noteList">
            <el-collapse-item :name="index" :key="index">
              <template slot="title">
                <div style="width: 100%; text-align: center; color: #000 ">{{note.noteTitle}}</div>
              </template>
              <div style="border: 1px solid #a2c9f5 ;background-color: #edf5fe;border-radius: 10px ; margin: 10px; box-shadow: 2px 3px #a2c9f5;">
                <div>
                  <p style="text-indent:2em; padding: 20px 20%; font-size: 1.5rem; font-family: 'Kaiti SC'; color: #000">{{note.noteContent}}</p>
                </div>
                <div align="right" style="padding: 10px 15%; color: #000">
                  <span>发布人: {{note.noteCreated}}</span>
                  <span>发布时间: {{$dateFmt('yyyy-MM-dd hh:mm:ss',note.noteModifytime )}}</span>
                </div>
              </div>
            </el-collapse-item>
          </template>
        </el-collapse>
        <div v-show="noteList.length === noteSize"
             style="height: 45px; padding-right: 20px; border-bottom: 1px solid #ebeef4; text-align: right">
          <el-button type="text" @click="moreNote">查看更多>></el-button>
        </div>
      </div>
      <div v-show="showLog">
        <self-search :datalist="childList" :strList="['logUsed','logOperate']"
                     @search-result="setResultList"></self-search>
        <el-table
          v-loading="loading"
          :data="childList"
          align="center"
          style="width: 100%">
          <el-table-column type="index" :index="updateIndex" label="序号" width="50" align="center"></el-table-column>
          <!--<el-table-column prop="logId" label="编号" width="200" align="center"></el-table-column>-->
          <el-table-column prop="logAccessUserName" label="操作者" width="180" align="center"></el-table-column>
          <el-table-column prop="logAccessTime" label="时间" width="200" :formatter="setTime"></el-table-column>
          <el-table-column prop="logAccessType" label="操作类型" show-overflow-tooltip></el-table-column>
          <el-table-column prop="logAccessIp" label="访问IP"></el-table-column>
          <el-table-column prop="logAccessUrl" label="访问路径" show-overflow-tooltip></el-table-column>
        </el-table>
        <el-footer align="center" style="background-color: #fff" v-show="childList.length">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pager.current"
            :page-sizes="[10, 20, 100]"
            :page-size="10"
            layout="total, sizes, prev, pager, next, jumper"
            :total="pager.pagerCount">
          </el-pagination>
        </el-footer>
      </div>
      <div v-show="showFile">
        <el-row :gutter="22">
          <el-col :span="2">
            <perm label="upload-file-manage">
              <div style="padding: 10px">
                <self-fileupload @callback="callback"></self-fileupload>
              </div>
            </perm>
          </el-col>
          <el-col :offset="10" :span="10">
            <self-search :datalist="fileList" :strList="['fileName']" @search-result="setResultList"></self-search>
          </el-col>
        </el-row>
        <el-table :data="fileChildList" stripe style="width: 100%;" align="center" class="tableHead">
          <el-table-column type="index"
                           :index="updateIndexFile"
                           label="序号" width="50" align="center">
          </el-table-column>
          <el-table-column prop="fileOwnerName" label="上传者" width="220" align="center"></el-table-column>
          <el-table-column prop="fileName" label="文件名" show-overflow-tooltip></el-table-column>
          <el-table-column prop="fileSize" label="文件大小"></el-table-column>
          <el-table-column prop="fileType" label="文件类型" show-overflow-tooltip></el-table-column>
          <el-table-column prop="filePath" label="文件路径" show-overflow-tooltip></el-table-column>
          <el-table-column prop="fileCreateTime" label="上传时间" :formatter="setTimeFile" width="200">
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
        <self-footer v-show="fileChildList.length"
          :dataList="fileList"
          :size="pager.pagerSize"
          :current="pager.current"
          :total="pager.pagerTotal"
          @result-list="setResultFileList">
        </self-footer>
      </div>
      <div class="page-right-wrap" v-show="showInfo">
        <el-container>
          <el-aside>
            <div style="padding: 10px 10px 10px 20px">
              <span>详情记录:</span>
            </div>
            <el-timeline>
              <el-timeline-item
                v-for="(activity, index) in activities"
                :key="index"
                :icon="activity.icon"
                :type="activity.type"
                :color="activity.color"
                :size="activity.size"
                :timestamp="activity.timestamp">
                {{activity.content}}
              </el-timeline-item>
            </el-timeline>
          </el-aside>
          <el-main>
            <div align="center">
              <h3 class="user-tile">{{user.userName}}</h3>
              <ul class="user-ul">
              <li class="user-ul-li"><span>姓名:</span>{{user.userName}}</li>
              <li class="user-ul-li"><span>等级:</span>{{user.userDepartmentName}}</li>
              <li class="user-ul-li"><span>角色:</span>{{user.userRoleName}}</li>
              <li class="user-ul-li"><span>电话:</span>{{user.userPhone}}</li>
              <li class="user-ul-li"><span>邮箱:</span>{{user.userEmail}}</li>
              </ul>
            </div>
          </el-main>
        </el-container>
      </div>
    </div>
  </div>
</template>
<script>
  import {PermMenu} from '@/api/resources'
  import {getPager} from '../../utils/pager';
  import selfSearch from '../common/self-cearch.vue';
  import userInfo from '../account/user/info/userInfo.vue';
  import SelfFooter from '../common/self-footer';
  import SelfFileupload from '../common/self-fileupload';
  import Perm from '../common/self-perm';
  // import UserInfo from '../user/userInfo';

  export default {
    components: {
      Perm,
      SelfFileupload,
      SelfFooter,
      selfSearch: selfSearch
    },
    data() {
      return {
        activities: [],
        activeNames: [0],
        loading: true,
        showMain: true,
        showFile: false,
        showLog: false,
        showInfo: false,
        logList: [],
        childList: [],
        pager: {
          current: 1,
          pagerSize: 10,
          pagerCount: 0,
          pagerTotal: 0
        },
        noteList: [],
        noteSize: 5,
        fileList: [],
        fileChildList: [],
        permList: [],
        userId: this.$store.state.user.userId,
        user: {},
        defaultHeight: this.$store.state.app.bodyHeight-170,
        defaultWith: this.$store.state.app.windowSize.width-250,
        condition: {
          pageNo: 0,
          pageSize: 10
        }
      };
    },
    mounted() {
      this.mainQuery();
      this.setUserMse();
    },
    methods: {
      setUserMse () {
        if (!this.userId) {
          return '';
        }
        this.$api.get('api/user/account?id=' + this.userId).then((res) => {
          this.user = res;
          this.activities.push({
            content: '创建日期',
            timestamp: this.$formatStringtoDateTime(res.userCreateTime),
            size: 'large',
            type: 'primary',
            icon: 'el-icon-more'
          });
          this.activities.push({
            content: '修改日期',
            timestamp: this.$formatStringtoDateTime(res.userUpdateTime),
            size: 'large',
            type: 'primary',
            icon: 'el-icon-more'
          });
          this.activities.push({
            content: '最后登录日期',
            timestamp: this.$formatStringtoDateTime(res.userLastLoginTime),
            size: 'large',
            type: 'primary',
            icon: 'el-icon-more'
          });
          this.activities.push({
            content: '当前第'+res.userLoginNumber+'次登录',
            size: 'large',
            type: 'primary',
            icon: 'el-icon-loading'
          })
        });
      },
      mainQuery() {
        this.showLog = false;
        this.showMain = true;
        this.showFile = false;
        this.showInfo = false;
        this.getNoteList(this.noteSize);
      },
      getNoteList(noteSize) {
        this.$api.post(this.$HOST + '/note/listNote?start=0&size=' + noteSize).then((res) => {
          this.noteList = res;
        });
      },
      fileQuery() {
        this.showLog = false;
        this.showMain = false;
        this.showFile = true;
        this.showInfo = false;
        this.$api.get(this.$HOST + '/file/currentList',{param:this.condition}).then((res) => {
          this.fileList = res.list;
          this.pager.pagerTotal = res.total;
          this.fileChildList = getPager(1,8,this.fileList);
        });
      },
      infoQuery() {
        this.showLog = false;
        this.showMain = false;
        this.showFile = false;
        this.showInfo = true;
      },
      logQuery() {
        this.showLog = true;
        this.showMain = false;
        this.showFile = false;
        this.showInfo = false;
        this.loading = true;
        this.$api.get(this.$HOST + '/logger/query?logAccessUserName=' + this.$store.state.user.userName+'&offset='+ this.pager.current +'&limit='+this.pager.pagerSize).then((res) => {
          this.childList = res.list;
          this.pager.pagerCount = res.total;
          this.loading = false;
        });
      },
      setTime(row) {
        return this.$dateFmt('yyyy-MM-dd hh:mm:ss', row.logAccessTime);
      },
      setTimeFile(row) {
        return this.$moment(row.fileCreateTime).format('YYYY-MM-D hh:mm:ss');
      },
      download (file) {
        let _this = this;
        let url = this.$HOST + '/file/' + file.fileId;
        return new Promise(function (resolve, reject) {
          // Get file name from url.
          _this.filename = file.fileName;
          let xhr = new XMLHttpRequest();
          xhr.responseType = 'blob';
          xhr.onload = function () {
            resolve(xhr);
          };
          xhr.onerror = reject;
          xhr.open('GET', url);
          xhr.send();
        }).then(function (xhr) {
          let a = document.createElement('a');
          a.href = window.URL.createObjectURL(xhr.response); // xhr.response is a blob
          a.download = _this.filename; // Set the file name.
          a.style.display = 'none';
          document.body.appendChild(a);
          a.click();
          // 下载后重新加载数据
          _this.fileQuery();
          return xhr;
        });
      },
      handleSizeChange(val) {
        this.pager.pagerSize = val;
        this.logQuery();
      },
      handleCurrentChange(val) {
        this.pager.current = val;
        this.logQuery()
      },
      updateIndex(index) {
        return index + (this.pager.current - 1) * this.pager.pagerSize + 1;
      },
      updateIndexFile(index) {
        return index + (this.pager.current - 1) * this.pager.pagerSize + 1;
      },
      setResultList(resultList) {
        this.pager.pagerTotal = resultList.length;
        this.childList = resultList;
        this.fileChildList = getPager(1,this.pager.pagerSize,resultList);
      },
      setResultFileList(pager,resultList) {
        this.pager.current = pager.current;
        this.pager.pagerSize = pager.size;
        this.fileChildList = resultList;
      },
      moreNote() {
        this.noteSize += 5;
        this.getNoteList(this.noteSize);
      },
      callback(data) {
        // console.info(data);
        this.fileQuery();
      }
    }
  };
</script>

<style scoped>
  .tableHead{
    color: #000;
  }
  .user-info{
  }
  #user-avatar{
    -webkit-filter: blur(0px);
    -moz-filter: blur(0px);
    -o-filter: blur(0px);
    -ms-filter: blur(5px);
    filter: blur(0px);
  }
  #user-avatar img {
    position: absolute;
    top: 110px;
    left: 12%;
    height: 220px;
    width: 20%;
  }
  #content {
    position: absolute;
    top: 30%;
    left: 16%;
    height: 70%;
    width: 80%;
    text-align: center;
    color: #fff;
    background-color: rgba(0, 0, 0, 0.5);
  }
  .user-tile{
    font-size: 1.8em;
    line-height: 60px;
  }
  .user-ul{
    padding-left: 46%;
  }
  .user-ul-li {
    display: inline-block;
    width: 100%;
    text-align: left;
    font-size: 1.2em;
    line-height: 50px;
  }
  .user-total{
    position: absolute;
    bottom: 80px;
    width: 80%;
  }
  .user-total .user-total-title{
    position: absolute;
    left: 15%;
    text-align: center;
    font-size: 1.5em;
  }
  .user-total .user-total-thor{
    margin-top: 40px;
    position: absolute;
    right: 0px;
    text-align: right;
    display: inline-flex;
  }
</style>
