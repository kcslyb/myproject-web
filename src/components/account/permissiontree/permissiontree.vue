<template>
  <div>
    <div align="right" style="border-bottom: 1px solid #e6e6e6; padding-right: 50px">
      <el-button type="primary" size="mini" plain circle class="el-icon-plus" @click="addPermMenu()"></el-button>添加
      <el-button type="warning" size="mini" plain circle class="el-icon-edit" @click="updateNodes()"></el-button>编辑
      <el-button type="danger" size="mini" plain circle class="el-icon-delete" @click="deleteNodes()"></el-button>删除
    </div>
    <el-tree
      :data="tableList"
      show-checkbox
      default-expand-all
      node-key="id"
      ref="tree"
      v-loading="loading"
      :props="defaultProps">
    </el-tree>
    <Pageright v-show="showRight" @rightClose="rightClose">
      <Treeform :permMenu="permMenu" :action="action" :parentList="parentList" v-show="showRight" @right-Close="rightClose"></Treeform>
    </Pageright>
  </div>
</template>
<script>
  import {PermMenu} from '@/api/resources'
  import Treeform from './treeform';
  import Pageright from '../../common/self-pageright';
  export default {
    components: {Pageright, Treeform},
    data() {
      return {
        showRight: false,
        loading: true,
        action: 'add',
        defaultProps: {
          children: 'children',
          label: 'permkey',
          id:'permid'
        },
        parentList: [],
        dataList: [],
        permMenu: {},
        conditionPermMenu: {},
        tableList: []
      };
    },
    mounted() {
      this.getPermList();
    },

    methods: {
      getPermList() {
        let params = JSON.parse(JSON.stringify(this.conditionPermMenu));
        PermMenu.queryList(params).then((res) => {
          this.dataList = res;
          let listType0 = this.dataList.filter(value => {
            return value.permtype === '0';
          });
          this.parentList = listType0;
          let listType1 = this.dataList.filter(value => {
            return value.permtype === '1';
          });
          this.tableList = [];
          listType0.forEach(async (t0,index) => {//构建展示数组
            await this.tableList.push({
              permid: t0.permid,
              permkey: t0.permkey + '('+ t0.permvalue + ')---->(' + t0.permpath + ')',
              children: []
            });
            if (t0.permchild !== '') {
              await listType1.forEach(t1 => {
                if (t1.permparent === t0.permid) {
                  this.tableList[index].children.push({
                    permid: t1.permid,
                    permkey: t1.permkey + '('+ t1.permvalue + ')---->(' + t1.permpath + ')'
                  })
                }
              });
            }
          });
          this.loading = false;
        })
      },
      getCheckedNodes() {//获取选择的节点信息
        let requestTree = [];
        this.$refs.tree.getCheckedNodes().forEach(value => {
          requestTree.push({
            permid: value.permid
          });
        });
        return requestTree;
      },
      addPermMenu() {
        this.permMenu = JSON.parse(JSON.stringify({}));
        this.action = 'add';
        this.showRight = true;
      },
      deleteNodes() {
        if (this.getCheckedNodes().length < 1) {
          this.$notify.info({
            title: '提示',
            message: '请选择需要删除的节点'
          });
          return '';
        }
        this.$confirm('此操作将永久删除该节点, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let requestTree = this.getCheckedNodes();
          requestTree.forEach(value => {
            PermMenu.delete(value.permid).then(() => {
              this.getPermList();
              this.$notify.success({
                title: '提示',
                message: '删除成功'
              })
            }).catch(() => {
              this.$notify.error({
                title: '提示',
                message: '删除失败'
              })
            })
          })
        }).catch(() => {});
      },
      updateNodes() {
       let formDate = this.getCheckedNodes();
       if (formDate.length !== 1) {
          this.$notify.info({
            title: '提示',
            message: '只能选择一个子节点,且根节点不开修改'
          });
         return '';
       }
       let updateDto = this.dataList.filter(value => {
         return value.permid === formDate[0].parentId?formDate[0].parentId:formDate[0].permid;
       });
       this.action = 'edit';
       this.permMenu = JSON.parse(JSON.stringify(updateDto[0]));
       this.showRight = true;
      },
      rightClose() {
        this.showRight = false;
        this.getPermList();
      }
    }
  };
</script>

<style scoped>
</style>
