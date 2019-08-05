<template>
  <div>
    <div class="el-container">
      <div class="el-aside" :style="'width: 200px ; border: 1px solid #e6e6e6; height: '+ defaultHeight +'px;'">
        <div align="center">
          <h3 style="display: inline-block;">账户角色</h3>
          <el-button @click="showSearchInput = !showSearchInput" size="mini" type="primary" plain icon="el-icon-search" circle></el-button>
          <perm label="add-user-account">
            <el-tooltip class="item" effect="dark" content="账户角色" placement="top" style="margin-top: 10px">
              <el-button size="mini" type="primary" icon="el-icon-circle-plus-outline" plain circle
                         @click.stop.prevent="addRole"></el-button>
            </el-tooltip>
          </perm>
          <div style="padding: 0 10px 10px 10px" v-show="showSearchInput">
            <el-input v-model="searchText" placeholder="请输入关键字搜索"></el-input>
          </div>
        </div>
        <div v-loading="loading">
          <template v-for="item of rolePermissionList">
            <el-button style="width: 196px; margin: 0; height: 60px" :class="{'is-selected-color': role.roleId === item.roleId}" @click="setUserAccountList(item)" :key="item.roleId">
              <div style="text-align: center;font-size: 1.1em; user-select: text">{{item.roleDescription}}</div>
              <div style="text-align: center; font-size: 0.7em; color: #aaa; user-select: text">{{item.roleName}}</div>
            </el-button>
          </template>
        </div>
      </div>
      <div class="el-main" :style="'padding: 0; border-bottom: 1px solid #e6e6e6; height:' +defaultHeight + 'px'" v-loading="loading">
        <el-header align="right" style="padding-top: 20px; border-bottom: 1px solid #e6e6e6; border-top: 1px solid #e6e6e6">
          <div style="display: inline-block; float: left">
            <span>{{role.roleDescription}}</span>
            <span>({{role.roleName}})</span>
          </div>
          <el-button type="warning" size="mini" plain circle class="el-icon-edit" @click="editRolePermission"></el-button>编辑
        </el-header>
        <el-tree
          :data="permissionList"
          default-expand-all
          node-key="id"
          ref="tree"
          :props="defaultProps">
        </el-tree>
      </div>
    </div>
    <page-right :show="showRight" @rightClose="rightClose" :css="{'width': '800px'}">
      <permission-tree :permissionList="permissionListIds" :role="role" @rightClose="rightClose" @right-Close="rightCloseRoad"></permission-tree>
    </page-right>
  </div>
</template>

<script>
  import {RolePermission} from '@/api/resources'
  import permission from './permission';
  import pageRight from '../../common/self-pageright';
  import Perm from '../../common/self-perm';
  export default {
    components: {
      Perm,
      permissionTree: permission,
      pageRight: pageRight,
    },
    data() {
      return {
        showRight: false,
        showSearchInput: false,
        showSearchInputTwo: false,
        loading: true,
        searchText: '',
        searchTextTwo: '',
        role: {
          roleId: '',
          roleName: '',
          roleDescription:''
        },
        activeName: '',
        defaultHeight: window.innerHeight-130,
        mainDefaultHeight: window.innerHeight-130,
        rolePermissionList: [],
        permissionList: [],
        permissionListIds: [],
        condition: {},
        pager: {
          size: 10,
          current: 1,
          total: 0
        },
        defaultProps: {
          children: 'children',
          label: 'permkey',
          id:'permid'
        }
      };
    },
    watch: {
      searchText(val) {
        this.rolePermissionList = this.$filterListOfString(this.rolePermissionList,['roleDescription', 'roleName'], val);
      }
    },
    mounted() {
      this.getRolePermissionList();
    },
    methods: {
      handleSizeChange(val) {
        this.pager.size = val;
        this.getRolePermissionList();
      },
      handleCurrentChange(val) {
        this.pager.current = val;
        this.getRolePermissionList();
      },
      getRolePermissionList() {
        this.loading = true;
        let formData = JSON.parse(JSON.stringify(this.condition));
        RolePermission.queryAllPermissionByRole(formData).then((res) => {
          if (res.length > 0) {
            this.rolePermissionList = res;
            let obj = this.rolePermissionList.filter(value => {return value.roleName === this.role.roleName});
            this.role = Object.assign({}, obj.length > 0 ? obj[0] : this.rolePermissionList[0], );
            this.setPermissionList(this.role.permissions);
          }
          this.loading = false;
        })
      },
      setUserAccountList(item) {
        if (item.permissions.length > 0) {
          this.setPermissionList(item.permissions);
        } else {
          this.setPermissionList([]);
        }
        this.role = Object.assign({}, item);
      },
      setTime (row) {
        return this.$dateFmt('yyyy-MM-dd hh:mm:ss',row.userCreateTime );
      },
      setPermissionList(res) {
        let dataList = res;
        if (dataList.length > 1) {
          let listType0 = dataList.filter(value => {
            return value.permtype === '0';
          });
          this.parentList = listType0;
          let listType1 = dataList.filter(value => {
            return value.permtype === '1';
          });
          this.permissionListIds = [];
          listType1.forEach(perm => {
            this.permissionListIds.push(perm.permid);
          });
          this.permissionList = [];
          listType0.forEach(async (t0,index) => {//构建展示数组
            await this.permissionList.push({
              permid: t0.permid,
              permkey: t0.permkey + '('+ t0.permvalue + ')---->(' + t0.permpath + ')',
              children: []
            });
            if (t0.permchild !== '') {
              await listType1.forEach(t1 => {
                if (t1.permparent === t0.permid) {
                  this.permissionList[index].children.push({
                    permid: t1.permid,
                    permkey: t1.permkey + '('+ t1.permvalue + ')---->(' + t1.permpath + ')'
                  })
                }
              });
            }
          });
        }else {
          this.permissionListIds = [];
          this.permissionList = []
        }
      },
      editRolePermission() {
        this.showRight = true;
      },
      getCheckedNodes() {//获取选择的节点信息
        let requestTree = [];
        let indexTree = -1;
        this.$refs.tree.getCheckedNodes().forEach(value => {
          if (value.children && value.children.length > 0) {
            indexTree++;
            requestTree.push({
              parentId: value.permid,
              childrens: []
            });
            value.children.forEach(value => {
              requestTree[indexTree].childrens.push(value.permid)
            })
          } else {
            requestTree.push({
              parentId: value.permid
            });
          }
        });
        return requestTree;
      },
      addRole() {
        console.log('add');
      },
      editRole() {
        console.log('edit');
      },
      deleteRole() {
        console.log('delete');
      },
      addDepartment() {
        this.action = 'add';
        this.dictionary = JSON.parse(JSON.stringify({}));
        this.showRight = true;
      },
      editDepartment(item) {
        this.action = 'edit';
        this.dictionary = JSON.parse(JSON.stringify(item));
        this.showRight = true;
      },
      deleteDepartment(item) {
        this.$confirm('确认删除？','提示',{
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          RolePermission.delete(item).then(() => {
            this.rightCloseRoad();
            this.$notify.success({
              title: '提示',
              message: '删除成功'
            })
          }).catch(()=> {
            this.$notify.error({
              title: '提示',
              message: '删除失败'
            })
          });
        }).catch(() => {});
      },
      rightClose() {
        this.showRight = false;
      },
      rightCloseRoad() {
        this.showRight = false;
        this.getRolePermissionList();
      }
    }
  };
</script>

<style scoped lang="scss">
@import "../../../assets/main.scss";
</style>
