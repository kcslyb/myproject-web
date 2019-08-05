<template>
  <div>
    <el-button style="margin-left: 200px" @click="addRole" size="small" type="primary" align="left">添加角色</el-button>
    <self-search :datalist="list" :strList="['roleName','roleDescription']" @search-result="setResultList"></self-search>
    <el-table :data="list" align="center" :row-class-name="tableRowClassName">
      <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
      <!--<el-table-column prop="roleId" label="角色编号" width="200" align="center">-->
      <!--</el-table-column>-->
      <el-table-column prop="roleName" label="角色名称" width="200" align="center">
      </el-table-column>
      <el-table-column prop="roleDescription" label="角色描述" align="center">
      </el-table-column>
      <el-table-column label="操作" align="center" width="240">
        <template slot-scope="scope">
          <el-button
            size="small"
            type="warning"
            icon="el-icon-star-off"
            @click="updateRole(scope.row)"
          >修改
          </el-button>
          <el-button
            size="small"
            type="danger"
            icon="el-icon-delete"
            @click="deleteRole(scope.row)"
          >删除
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="权限" width="130" align="center">
        <template slot-scope="scope">
          <!--<el-row v-for="perm of scope.row.permissionDtos" :key="perm.id">-->
            <!--<el-tag>{{perm.permissionName}}&ndash;&gt;{{perm.permissionMethod}}</el-tag>-->
          <!--</el-row>-->
          <el-row style="height: 50px">
            <el-badge :value="scope.row.permissionDtos.length" class="item" type="primary" style="margin-bottom: -30px">
              <el-button type="text" size="small">拥有</el-button>
            </el-badge>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column label="编辑权限" align="center" width="240">
        <template slot-scope="scope">
          <el-button
            size="small"
            type="warning"
            icon="el-icon-star-off"
            @click="updateRolePerm(scope.row)"
          >授权
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pageright :show="showRight" @right-close="resetRightBox" :showClose="false"
               :closeOnClickModal="false" :visible.sync="showRight" :css="{'width':'480px'}">
      <edit-form :title="formTitle" :action="action" :actionType="showRight"
                 :rolelist="role"
                 @right-close="resetRightBox"
                 @change="change">
      </edit-form>
    </pageright>
    <el-dialog :show="showPermission" @right-close="resetRightBox" :showClose="false"
               :closeOnClickModal="false" :visible.sync="showPermission" :css="{'width':'480px'}">
      <permission-form :title="formTitle" :action="action" :actionType="showRight" ref="roleperm"
                 :rolelist="role"
                 @right-close="resetRightBox"
                 @change="change">
      </permission-form>
    </el-dialog>
  </div>
</template>

<script>
  import editForm from './rolefrom';
  import permissionForm from './rolepermissionfrom';
  import Pageright from '../../common/self-pageright';
  import selfcearch from '../../common/self-cearch';
export default {
  name: 'frame',
  components: {
    Pageright,
    editForm: editForm,
    permissionForm: permissionForm,
    selfSearch: selfcearch
  },
  data () {
    return {
      showPermission: false,
      showRight: false,
      actionType: false,
      action: '',
      formTitle: '',
      list: [],
      role: {
        roleId: '',
        roleName: '',
        roleDescription: '',
        permissionDtos: []
      }
    }
  },
  mounted() {
    this.getRoleList();
  },
  methods: {
    setResultList (resultList) {
      this.list = resultList;
    },
    tableRowClassName({row, rowIndex}) {
      if (rowIndex%2 === 0) {
        return 'warning-row';
      } else if (rowIndex%2 === 1) {
        return 'success-row';
      }
      return '';
    },
    getRoleList() {
      let _this = this;
      let url = this.HOST + '/role/list';
      _this.api.get(url).then((res) => {
        _this.list = res;
      }).catch(() => {
      });
    },
    addRole() {
      this.showRight = true;
      this.formTitle = 'add';
      this.action = 'add';
      this.role = {};
    },
    updateRole (role) {
      this.showRight = true;
      this.formTitle = 'update';
      this.action = 'update';
      this.role = role;
    },
    deleteRole(row) {
      let _this = this;
      _this.$confirm('确认删除'+ row.roleName + '角色？', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let url = this.HOST + '/role/' + row.roleId;
        _this.$http.delete(url).then(() => {
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
      this.showPermission = false;
      this.showRight = false;
      this.getRoleList();
    },
    change() {
      this.getRoleList();
      this.resetRightBox();
      this.getRoleList();
    },
    updateRolePerm (row) {
      this.role = row;
      this.showPermission = true;
      this.formTitle = '编辑';
      this.role = row;
    },
  }
}
</script>

<style scoped>
</style>
