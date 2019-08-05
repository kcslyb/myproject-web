<template>
  <div>
    <div class="el-header">
      <page-right :show="pageIsShow" @rightClose="rightClose">
        <desk-dto
          :show="pageIsShow"
          :action="action"
          :ruleForm="product"
          @rightClose="rightClose">
        </desk-dto>
      </page-right>
      <div align="right">
        <perm label="add-product-manage">
          <el-tooltip class="item" effect="dark" content="新增" placement="top" style="margin-top: 10px">
            <el-button size="mini" type="primary" icon="el-icon-circle-plus-outline" plain circle @click.stop.prevent="proAdd"></el-button>
          </el-tooltip>
          添加
        </perm>
      </div>
    </div>
    <div v-loading="loading">
      <el-table
        :data="deskList"
        :height="defaultHeight"
        align="center"
        :row-class-name="tableRowClassName"
        style="width: 100%;">
        <el-table-column type="index" label="编号" width="50" :index="indexMethod" align="center"></el-table-column>
        <el-table-column prop="deskName" label="名称" align="center">
          <template slot-scope="scope">
            {{scope.row.deskName}}
            <el-tag type="success" size="mini" v-if="scope.row.deskStatus === '0'">可用</el-tag>
            <el-tag type="primary" size="mini" v-else-if="scope.row.deskStatus === '1'">使用中</el-tag>
            <el-tag type="info" size="mini" v-else>停用</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="deskSerialNumber" label="编码" align="center"></el-table-column>
        <el-table-column prop="deskCapacity" label="容量" align="center"></el-table-column>
        <el-table-column label="操作" align="center" width="200">
          <template slot-scope="scope">
            <el-button type="warning" size="mini" plain circle class="el-icon-edit" @click="update(scope.row)"></el-button>编辑
            <el-button :type="scope.row.deskStatus === '2' ? 'primary' : 'danger'" size="mini" plain circle class="el-icon-refresh" @click="remove(scope.row)"></el-button>{{scope.row.deskStatus === '2' ? '启用' : '停用'}}
          </template>
        </el-table-column>
      </el-table>
      <el-footer align="center" v-show="deskList.length > 0">
        <div class="block">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pager.offset"
            :page-sizes="[pager.limit, 20]"
            :page-size="pager.limit"
            layout="total, sizes, prev, pager, next, jumper"
            :total="pager.total">
          </el-pagination>
        </div>
      </el-footer>
    </div>
  </div>
</template>

<script>
  import {Desk} from '../../api/resources';
  import pageRight from '../common/self-pageright.vue'
  import deskDto from '../desk/desk.vue'
  import Perm from '../common/self-perm';
  export default {
    name: 'desklist',
    components: {
      Perm,
      pageRight: pageRight,
      deskDto:deskDto
    },
    data() {
      // noinspection JSAnnotator
      return {
        loading: false,
        pageIsShow: false,
        defaultHeight: window.innerHeight - 210,
        deskList: [],
        product: {},
        action: '',
        deskDto: {
          deskId: '',
          deskNumber: 0,
          deskSize: '',
          deskStatus: ''
        },
        pager: {
          offset: 1,
          limit: 10,
          total: 0
        },
      }
    },
    mounted () {
      this.getDeskList();
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
      indexMethod(index) {
        return ((this.pager.offset - 1) * this.pager.limit) + index + 1;
      },
      handleSizeChange(val) {
        this.pager.limit = val;
        this.getDeskList();
      },
      handleCurrentChange(val) {
        this.pager.offset = val;
        this.getDeskList();
      },
      rightClose () {
        this.pageIsShow = false;
        this.getDeskList();
      },
      getDeskList () {
        this.loading = true;
        let formDate = JSON.parse(JSON.stringify(this.deskDto));
        Desk.queryPager(formDate).then((res) => {
          this.deskList = res.list;
          this.pager.total = this.deskList.length;
          this.loading = false;
        }).catch(() => {
        });
      },
      proAdd () {
        this.product = {};
        this.action = 'add';
        this.pageIsShow = true
      },
      update (row) {
        this.action = 'update';
        this.product = row;
        this.pageIsShow = true;
      },
      remove (row) {
        let _this = this;
        _this.$confirm('确认更改'+ row.deskName + '状态？', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          Desk.delete(row.deskId).then((res) => {
            _this.$notify.success({
              duration: 2000,
              name: '成功',
              message: '更改成功'
            });
            _this.getDeskList();
          }).catch(() => {
          });
        }).catch(() => {
        });
      },
      typeSet (date) {
        if (date.deskStatus === '0'){
          return '可用';
        } else if (date.deskStatus === '1') {
          return '不可用';
        } else {
          return '';
        }
      }
    }
  };

</script>

<style scoped>

</style>
