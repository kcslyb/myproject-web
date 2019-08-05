<template>
  <div>
    <div>
      <div style="padding: 0 100px">
        <roletag-perm :label="roletag">
          <el-button size="small" type="primary" @click="addUer" align="left">add user</el-button>
          <!--<el-button size="mini" type="success" @click="importFile">export Excel</el-button>-->
          <el-button size="mini" type="success" @click="excelPrint">print Excel</el-button>
        </roletag-perm>
        <div align="right">
          <el-input
            size="small"
            style="width: 300px"
            placeholder="请输入内容"
            prefix-icon="el-icon-search"
            v-model="filterStr">
          </el-input>
          <el-button size="small" type="primary" >查询</el-button>
          <!--<el-button size="small" type="info">重置</el-button>-->
        </div>
      </div>
      <el-table :data="filterUsers" :row-class-name="tableRowClassName" align="center">
        <el-table-column type="index" :index="updateIndex" label="序号" width="50" align="center"></el-table-column>
        <!--<el-table-column prop="uuid" label="用户编号" width="200" align="center">-->
        <!--</el-table-column>-->
        <el-table-column prop="userName" label="用户姓名" width="100" align="center"></el-table-column>
        <el-table-column prop="roleDto.roleDescription" label="用户角色" align="center"></el-table-column>
        <el-table-column prop="userPhone" label="电话号码" align="center"></el-table-column>
        <el-table-column prop="userEmail" label="电子邮箱" align="center"></el-table-column>
        <!--<el-table-column prop="cretedata" label="创建时间" width="200" :formatter="setTime" align="center"></el-table-column>-->
        <el-table-column prop="userStatus" label="状态" :formatter="judge" width="80" align="center"></el-table-column>
        <el-table-column label="操作" align="center" width="440">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-search"
              @click="queryUser(scope.row)"
            >查看
            </el-button>
            <el-button
              type="warning"
              size="mini"
              icon="el-icon-star-off"
              @click="updateUser(scope.row)"
            >修改
            </el-button>
            <el-button
              type="info"
              size="mini"
              icon="el-icon-refresh"
              @click="disableUser(scope.row)"
            >{{scope.row.userStatus | filterStatus}}
            </el-button>
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-refresh"
              @click="deleteUser(scope.row)"
            >删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <pageright :show="showRight" @right-close="resetRightBox">
        <edit-form :title="formTitle" :action="action" :actionType="showRight"
                   :userlist="userDto"
                   @right-close="resetRightBox"
                   @change="change">
        </edit-form>
      </pageright>
      <pageright :show="showInfo" :css="{'width':'100%','padding':0}" @right-close="closeShowInfo">
        <self-info :userId="userId"></self-info>
      </pageright>
    </div>
    <el-footer align="center" style="background-color: #fff">
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage4"
          :page-sizes="[8, 20]"
          :page-size="8"
          layout="total, sizes, prev, pager, next, jumper"
          :total="count">
        </el-pagination>
      </div>
    </el-footer>
  </div>
</template>

<script>
  import editForm from './from.vue';
  import Vue from 'vue';
  import roletagPerm from '../common/self-roletagperm.vue';
  import Pageright from '../common/self-pageright';
  import selfInfo from '../user/userInfo';

  // 注册
  Vue.filter('filterStatus', function (value) {
    if (value === '1') {
      return '禁用';
    } else {
      return '启用';
    }
  });
  export default {
    components: {
      Pageright,
      editForm: editForm,
      selfInfo: selfInfo,
      roletagPerm: roletagPerm
    },
    data() {
      // noinspection JSAnnotator
      return {
        page: 1,
        str: '',
        roletag: 'SuperAdmin',
        currentnum: 1,
        pagesizenum: 8,
        userId: '',
        showInfo: false,
        showRight: false,
        actionType: false,
        action: '',
        formTitle: '',
        list: [],
        filterStr: '',
        filterUsers: [],
        userDto: {
          uuid: '',
          userName: '',
          userPhone: '',
          userEmail: '',
          userStatus: '',
          roleDto: {
            roleId: '',
            roleName: '',
            roleDescription: '',
            permissionDtos: {}
          }
        },
        dataTotal: 10,
        currentPage1: 5,
        currentPage2: 5,
        currentPage3: 5,
        currentPage4: 1,
        count: 0,
        filterStatus: Vue.directive('filterStatus')
      };
    },
    watch: {
      filterStr(val) {
        if (val !== '' && this.filterStr !== '') {
          this.handSearch(val);
        }
        if (val === '') {
          this.filterUsers = this.list;
        }
      }
    },
    mounted() {
      this.getUserList();
    },
    methods: {
      tableRowClassName({row, rowIndex}) {
        if (rowIndex%4 === 0) {
          return 'warning-row';
        } else if (rowIndex%4 === 2) {
          return 'success-row';
        }else if (rowIndex%4 === 4) {
          return 'info-row';
        }
        return '';
      },
      getUserList() {
        let _this = this;
        let url = this.$HOST + '/user/list' + '?pageNo=' + _this.currentnum + '&pageSize=' + _this.pagesizenum;
        _this.$api.get(url).then((res) => {
          _this.list = res.list;
          _this.filterUsers = res.list;
          _this.count = res.count;
        }).catch(() => {
        });
      },
      disableUser(row) {
        let _this = this;
        _this.$confirm('确认更改'+ row.userName + '状态？', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let url = this.$HOST + '/user/' + row.uuid +'/disable';
          this.$api.delete(url).then((res) => {
            this.$notify.success({
              duration: 2000,
              name: '成功',
              message: '更改状态成功'
            });
            this.getUserList();
          });
        }).catch(() => {
        });
      },
      deleteUser(row) {
        let _this = this;
        _this.$confirm('确认删除'+ row.userName + '？', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let url = this.$HOST + '/user/' + row.uuid +'/delete';
          this.$api.delete(url).then((res) => {
            this.$notify.success({
              duration: 2000,
              name: '成功',
              message: '删除成功'
            });
            this.getUserList();
          });
        }).catch(() => {
        });
      },
      queryUser(user) {
        this.userId = user.uuid;
        this.showInfo = true;
      },
      updateUser(str) {
        // alert(str.uuid)
        this.showRight = true;
        this.formTitle = 'update';
        this.action = 'update';
        this.userDto = str;
      },
      addUer() {
        this.showRight = true;
        this.formTitle = 'add';
        this.action = 'add';
        this.userDto = {};
      },
      handSearch(str) {
        this.filterUsers = this.list.filter(value => {
          return value.userName.indexOf(str) > -1 || value.userPhone.indexOf(str) > -1;
        });
      },
      resetRightBox() {
        this.showRight = false;
      },
      closeShowInfo() {
        this.showInfo = false;
      },
      change() {
        this.resetRightBox();
        this.getUserList();
      },
      handleSizeChange(val) {
        this.pagesizenum = val;
        this.getUserList();
      },
      handleCurrentChange(val) {
        this.currentnum = val;
        this.getUserList();
      },
      updateIndex(index) {
        return index + (this.currentnum - 1) * this.pagesizenum + 1;
      },
      judge (date) {
        return date.userStatus === '1' ? '可用' : '不可用';
      },
      setTime (row) {
        return this.$dateFmt('yyyy-MM-dd hh:mm:ss',row.createdata );
      },
      excelPrint() {
        let url = this.$HOST + '/user/print';
        let oReq = new XMLHttpRequest();
        oReq.open("GET", url, true);
        oReq.responseType = "blob";
        oReq.onload = function (oEvent) {
          let content = oReq.response;

          let elink = document.createElement('a');
          elink.download = "userDto.xls";
          elink.style.display = 'none';

          let blob = new Blob([content]);
          elink.href = URL.createObjectURL(blob);

          document.body.appendChild(elink);
          elink.click();

          document.body.removeChild(elink);
        };
        oReq.send();
      },
      importFile () {
        // import/contact
        let url = this.$HOST + '/tMsg/import/contact';
        this.$api.post(url).then((res) => {
          // this.getUserList();
        }).catch(() => {
        });
      }
    }
  };
</script>

<style scoped>
  .info-row {
    background: #f5f5f5;
  }
  .warning-row {
    background: #dcecf6;
  }

  .success-row {
    background: #f0f9eb;
  }
</style>
