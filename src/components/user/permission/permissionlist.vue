<template>
  <div>
    <div style="padding: 0 100px">
      <el-button @click="addPermission" size="small" type="primary" align="left">添加权限</el-button>
      <div align="right">
        <el-input
          @keyup.enter.native="filterPerm"
          size="small"
          style="width: 200px"
          placeholder="请输入内容"
          prefix-icon="el-icon-search"
          v-model="filterStr">
        </el-input>
        <el-button size="small" type="primary" @click="filterPerm">查询</el-button>
        <el-button size="small" type="info" @click="filterPermReset">重置</el-button>
      </div>
    </div>
    <el-table :data="childList" align="center" :row-class-name="tableRowClassName">
      <el-table-column type="index" :index="updateIndex" label="序号" width="50" align="center"></el-table-column>
      <!--<el-table-column prop="permissionId" label="权限编号" width="200" align="center">-->
      <!--</el-table-column>-->
      <el-table-column prop="permissionName" label="权限名称" width="200">
      </el-table-column>
      <el-table-column prop="permissionUrl" label="路径权限" :formatter="judge">
      </el-table-column>
      <el-table-column prop="permissionMethod" label="菜单权限">
      </el-table-column>
      <el-table-column prop="permissionDescription" label="权限描述">
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            size="small"
            type="warning"
            icon="el-icon-star-off"
            @click="updatePermission(scope.row)"
          >修改
          </el-button>
          <el-button
            size="small"
            type="danger"
            icon="el-icon-delete"
            @click="deletePermission(scope.row)"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-footer align="center" style="background-color: #fff">
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pager.pagerCurrent"
          :page-sizes="[8, 20]"
          :page-size="8"
          layout="total, sizes, prev, pager, next, jumper"
          :total="list.length">
        </el-pagination>
      </div>
    </el-footer>
    <pageright :show="showRight" @right-close="resetRightBox" :visible.sync="showRight" :css="{'width':'680px'}">
      <edit-form :title="formTitle" :action="action" :actionType="showRight"
                 :permissionlist="permissionDtos"
                 @right-close="resetRightBox"
                 @change="change">
      </edit-form>
    </pageright>
  </div>
</template>

<script>
  import editForm from './permissionfrom';
  import Pageright from '../../common/self-pageright';
  import {getPager,serialNumber} from '../../../utils/pager';

  export default {
  name: 'frame',
  components: {
    Pageright,
    editForm: editForm
  },
  data () {
    return {
      showRight: false,
      actionType: false,
      action: '',
      formTitle: '',
      list: [],
      childList: [],
      permissionDtos: {
        permissionId: '',
        permissionName: '',
        permissionUrl: '',
        permissionMethod: '',
        permissionDescription: ''
      },
      filterStr: '',
      filterPerms: [],
      pager: {
        pagerSize: 8,
        pagerCurrent: 1,
        pagerTotal: 0
      }
    }
  },
  mounted() {
    this.getPermissionList();
  },
  methods: {
    tableRowClassName({row, rowIndex}) {
      if (rowIndex%2 === 0) {
        return 'warning-row';
      } else if (rowIndex%2 === 1) {
        return 'success-row';
      }
      return '';
    },
    getPermissionList() {
      let url = this.$HOST + '/permission/list';
      this.$api.get(url).then((res) => {
        // console.info(res);
        this.list = res;
        this.filterPerms = res;
        this.childList = getPager(1,this.pager.pagerSize,this.list);
        // console.info(this.childList);
      }).catch(() => {
      });
    },
    addPermission() {
      this.showRight = true;
      this.formTitle = 'add';
      this.action = 'add';
      this.permissionDtos = {};
    },
    updatePermission (row) {
      this.showRight = true;
      this.formTitle = 'update';
      this.action = 'update';
      this.permissionDtos = row;
    },
    deletePermission(row) {
      let _this = this;
      _this.$confirm('确认删除'+ row.permissionName + '角色？', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let url = this.$HOST + '/permission/delete/' + row.permissionId;
        _this.$api.delete(url).then(() => {
          _this.change();
        });
        this.$notify.success({
          duration: 2000,
          name: '成功',
          message: '删除成功'
        });
      }).catch(() => {
      });
      this.change();
    },
    resetRightBox() {
      this.showRight = false;
      this.permissionDtos = {}
    },
    change() {
      this.getPermissionList();
      this.resetRightBox();
    },
    judge (date) {
      return date.permissionUrl ? date.permissionUrl : '无';
    },
    filterPerm() {
      let _this = this;
      this.filterPerms = this.list.filter(val => {
        return val.permissionName.indexOf(_this.filterStr) > -1 || val.permissionMethod.indexOf(_this.filterStr) > -1;
      })
    },
    filterPermReset () {
      this.filterStr = '';
      this.filterPerm();
    },
    handleSizeChange(val) {
      this.pager.pagerSize = val;
      this.childList = getPager(this.pager.pagerCurrent,val,this.list);
    },
    handleCurrentChange(val) {
      this.pager.pagerCurrent = val;
      this.childList = getPager(val,this.pager.pagerSize,this.list);
    },
    updateIndex(index){
      return index + (this.pager.pagerCurrent - 1) * this.pager.pagerSize + 1;
    }
  }
}
</script>

<style scoped>
</style>
