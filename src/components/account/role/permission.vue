<template>
  <div>
    <div class="el-container">
      <div class="el-aside" style="width: 130px; border-right: 1px solid #e6e6e6; border-top: 1px solid #e6e6e6">
        <div>
          <h3>编辑角色</h3>
        </div>
        <div style="position: absolute; bottom: 130px; left: 40px">
          <div>
            <el-button type="primary" :loading="loading" plain @click="changeRolePermission">保存</el-button>
          </div>
          <div style="margin-top: 20px">
            <el-button type="info " plain @click="rightClose">取消</el-button>
          </div>
        </div>
      </div>
      <div class="el-main" :style="'border-top: 1px solid #e6e6e6; padding: 0 0 20px 0; height:' +defaultHeight + 'px'">
        <div class="el-form-item__content" style="padding: 10px 0 10px 10px">
          <span>{{role.roleDescription}}</span>
          <span>({{role.roleName}})</span>
        </div>
        <div>
          <el-form label-width="80px" :model="role">
            <el-form-item label="角色别名:">
              <el-input v-model="role.roleName" style="width:300px;"></el-input>
            </el-form-item>
            <el-form-item label="角色名称:">
              <el-input v-model="role.roleDescription" style="width:300px;"></el-input>
            </el-form-item>
            <el-form-item label="分配权限:">
              <div align="right" style="padding-right: 30px">
                <div style="display: inline-block;">
                  <el-input v-model="searchText" size="small" placeholder="请输入关键字搜索"></el-input>
                </div>
                <el-button size="small" type="primary" plain icon="el-icon-search" circle></el-button>
              </div>
            </el-form-item>
          </el-form>
        </div>
        <el-tree
          :data="dataList"
          show-checkbox
          node-key="permid"
          ref="tree"
          default-expand-all
          :default-expanded-keys="permissionList"
          :props="defaultProps">
        </el-tree>
      </div>
    </div>
  </div>
</template>
<script>
  import {PermMenu, RolePermission} from '@/api/resources'
  export default {
    props: {
      permissionList: {
        type: Array,
        default: () =>[]
      },
      role: {
        type: Object,
        default: () =>{}
      }
    },
    data() {
      return {
        showSearchInput: false,
        loading: false,
        searchText: '',
        defaultHeight: window.innerHeight-30,
        defaultProps: {
          children: 'children',
          label: 'permkey',
          id:'permid'
        },
        requestForm: {
          permissionIds: []
        },
        dataList: []
      };
    },
    mounted() {
      this.getPermList();
    },
    watch: {
      permissionList() {
        this.setCheckedKeys();
      }
    },
    methods: {
      setCheckedKeys() {
        this.$refs.tree.setCheckedKeys(this.permissionList);
      },
      getPermList() {
        PermMenu.queryList({}).then((res) => {
          let resultList = res;
          let listType0 = resultList.filter(value => {
            return value.permtype === '0';
          });
          let listType1 = resultList.filter(value => {
            return value.permtype === '1';
          });
          this.dataList = [];
          listType0.forEach(async (t0,index) => {//构建展示数组
            await this.dataList.push({
              permid: t0.permid,
              permkey: t0.permkey + '('+ t0.permvalue + ')---->(' + t0.permpath + ')',
              children: []
            });
            if (t0.permchild !== '') {
              await listType1.forEach(t1 => {
                if (t1.permparent === t0.permid) {
                  this.dataList[index].children.push({
                    permid: t1.permid,
                    permkey: t1.permkey + '('+ t1.permvalue + ')---->(' + t1.permpath + ')'
                  })
                }
              });
            }
          })
        })
      },
      getCheckedNodes() {//获取选择的节点信息
        let requestTree = '';
        this.$refs.tree.getCheckedNodes().forEach((value) => {
          requestTree += 'permissionIds='+ value.permid+ '&';
        });
        return requestTree;
      },
      changeRolePermission() {
        this.loading = true;
        this.requestForm.permissionIds = this.getCheckedNodes();
        let path = this.getCheckedNodes() + 'roleId='+ this.role.roleId;
        RolePermission.updateRolePermission(path).then((res) => {
          this.loading = false;
          this.close();
          this.$notify.success({
            title: '提示',
            message: '编辑成功'
          });
          if (this.role.roleName === this.$store.state.user.roleName) {
            this.$store.dispatch('LogOut').then(() => {
              this.$store.dispatch('FedLogOut').then(() => {
              });
              location.reload();
            }).catch(() => {
            });
          }
        }).catch((reject) => {
          this.loading = false;
          this.$notify.error({
            title: '提示',
            message: '编辑失败' + reject
          })
        })
      },
      close() {
        this.setCheckedKeys();
        this.$emit('right-Close');
      },
      rightClose() {
        this.setCheckedKeys();
        this.$emit('rightClose');
      }
    }
  };
</script>

<style scoped>
</style>
